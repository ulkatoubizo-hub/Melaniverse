import { GoogleGenAI, Type } from "@google/genai";

// Helper to get fresh AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean and parse JSON safely with Regex extraction
const parseJSONSafe = (text: string) => {
    if (!text) return {};
    try {
        // 1. Try direct parse first
        return JSON.parse(text);
    } catch (e) {
        // 2. If failed, try to extract JSON object using regex (handles markdown blocks or conversational text)
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                // console.warn("Regex JSON extraction failed, trying cleanup...");
            }
        }
        
        // 3. Last resort cleanup: remove markdown code blocks explicitly
        let cleanText = text.replace(/```json\n?|```/g, '').trim();
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanText = cleanText.substring(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(cleanText);
            } catch (e3) {
                 throw new Error("JSON Parsing failed after all attempts.");
            }
        }
        
        throw new Error("No JSON found in response.");
    }
}

/**
 * Executes a generation task with automatic fallback to a lighter model if the primary model is overloaded (429/503).
 */
const runWithFallback = async <T>(
    operation: (model: string) => Promise<T>,
    primaryModel: string = 'gemini-2.5-flash',
    fallbackModel: string = 'gemini-flash-lite-latest'
): Promise<T> => {
    try {
        return await operation(primaryModel);
    } catch (error: any) {
        const errStr = (error.message || '') + JSON.stringify(error);
        
        // Check for Quota (429) or Overload (503) errors
        if (errStr.includes('429') || errStr.includes('503') || errStr.includes('quota') || errStr.includes('resource exhausted')) {
            console.warn(`Primary model ${primaryModel} failed (Quota/Load). Switching to fallback: ${fallbackModel}.`);
            try {
                // Add a small delay before retry to be polite to the API
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await operation(fallbackModel);
            } catch (fallbackError: any) {
                // If fallback also fails, throw the original error or a combined one
                console.error("Fallback also failed.");
                throw fallbackError;
            }
        }
        throw error;
    }
};

/**
 * NEW: Generates the ENTIRE store strategy from just a vague user prompt and image context.
 */
export const generateFullStoreStrategy = async (userPrompt: string, imageContext: string = "") => {
  const ai = getAI();
  const prompt = `
    You are an expert E-commerce Brand Architect.
    The user wants to create a store. 
    User Idea: "${userPrompt}".
    Visual Context from uploaded image (if any): "${imageContext}".
    
    Based on this, INVENT the following details:
    1. A creative Store Name.
    2. The Main Product Name.
    3. A suitable Price (in EUR).
    4. Slogan, Description, Theme Color.
    5. Visual prompts for Logo and Banner.
    6. 3 Related products (text only).

    Output strictly valid JSON. No markdown.
    
    Required JSON Structure:
    {
      "storeName": "Name you invented",
      "productName": "Main product name",
      "price": 99,
      "slogan": "Catchy French slogan",
      "aboutUs": "Professional French description (max 50 words)",
      "themeColor": "#HexColor",
      "logoPrompt": "Visual description for logo, minimalist vector",
      "bannerPrompt": "Visual description for banner, abstract background",
      "products": [
         { "name": "Main Product Name", "description": "...", "price": 99, "features": ["..."] },
         { "name": "Related Product 1", "description": "...", "price": 89, "features": ["..."] },
         { "name": "Related Product 2", "description": "...", "price": 79, "features": ["..."] }
      ]
    }
  `;

  return runWithFallback(async (modelId) => {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        }
      });
      return parseJSONSafe(response.text || "{}");
  });
};

export const generateSingleProductDetails = async (productName: string, imageContext: string) => {
  const ai = getAI();
  const prompt = `
    Analyze this product for an e-commerce listing: "${productName}".
    Context: ${imageContext}.
    
    Output strictly valid JSON:
    {
      "name": "Creative Product Name",
      "description": "SEO friendly French description (max 40 words)",
      "price": 0,
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }
  `;

  return runWithFallback(async (modelId) => {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 4000,
        }
      });
      return parseJSONSafe(response.text || "{}");
  });
};

export const generateImageVariation = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: `Professional product photography. ${prompt}` }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
  } catch (e: any) {
      console.warn("Image generation failed (likely quota). Returning null to proceed.");
      return null; 
  }
};

export const generateAsset = async (prompt: string, type: 'logo' | 'banner') => {
  const ai = getAI();
  
  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `Professional design, high quality. ${prompt}` }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
  } catch (e) {
      console.warn(`Asset generation failed for ${type}. Using placeholder.`);
  }

  // Fallback if generation fails
  return type === 'logo' 
    ? 'https://placehold.co/200x200/black/white?text=LOGO' 
    : 'https://placehold.co/1920x600/black/white?text=BANNER';
};

/**
 * Assistant Dashboard Action
 * Interprets user request to modify store data.
 */
export const performDashboardAction = async (userPrompt: string, currentStoreData: any, imageBase64?: string) => {
    const ai = getAI();
    
    const parts: any[] = [{
        text: `
        You are an AI Assistant managing a Store Dashboard. 
        Current Store Name: "${currentStoreData.name}".
        Current Theme Color: "${currentStoreData.themeColor}".

        User Request: "${userPrompt}"

        Determine what action to take. 
        Supported Actions:
        1. 'add_product': If user wants to add a product (and provided an image).
        2. 'update_theme': If user wants to change color.
        3. 'update_name': If user wants to change store name.
        4. 'update_slogan': If user wants to change slogan.
        5. 'chat': If it's just a question.

        Output JSON ONLY:
        {
            "action": "add_product" | "update_theme" | "update_name" | "update_slogan" | "chat",
            "reply": "Friendly message to user confirming action",
            "data": {
                // For add_product
                "name": "Product Name",
                "price": 99,
                "description": "...",
                "features": [],
                // For update_theme
                "color": "#hex",
                // For update_name
                "storeName": "New Name",
                // For update_slogan
                "slogan": "New Slogan"
            }
        }
        `
    }];

    if (imageBase64) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
        parts[0].text += "\n NOTE: The user has uploaded an image. Use it to generate product details if action is add_product.";
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: { responseMimeType: "application/json" }
    });

    return parseJSONSafe(response.text || "{}");
};


export const blobToBase64Data = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};