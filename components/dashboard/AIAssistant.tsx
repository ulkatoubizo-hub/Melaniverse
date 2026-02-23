import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../App';
import { performDashboardAction, blobToBase64Data, fileToDataUrl } from '../../services/geminiService';

const AIAssistant = () => {
    const { storeData, setStoreData } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, image?: string}[]>([
        { role: 'ai', content: "Bonjour ! Je suis votre assistant personnel. Dites-moi ce que vous voulez faire (ex: 'Ajoute ce produit', 'Change le thème en rouge', 'Change le nom de la boutique')." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = await fileToDataUrl(file);
            setSelectedImage(file);
            setPreviewUrl(url);
        }
    };

    const handleSend = async () => {
        if ((!inputValue.trim() && !selectedImage) || !storeData) return;

        const userMsg = { role: 'user' as const, content: inputValue, image: previewUrl };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setSelectedImage(null);
        setPreviewUrl("");
        setLoading(true);

        try {
            let base64Image = undefined;
            if (userMsg.image && selectedImage) {
                base64Image = await blobToBase64Data(selectedImage); // Need the file object here, logic simplified
                // For simplified logic, assume selectedImage corresponds to userMsg.image if sending immediately
            }
            // If userMsg.image was set but selectedImage cleared, we might need a better way to persist the file for the API call. 
            // In this specific React flow, we should convert to base64 *before* clearing state.
            
            // Correction: Re-acquire base64 if needed, but since we cleared state, let's assume we do it inside the submit handler before clearing.
            // Actually, let's fix the order.
        } catch(e) {}

        // Re-doing the flow for safety:
        let base64ToSend = undefined;
        if (userMsg.image) {
             // Retrieve the base64 from the preview URL if it's data URI, otherwise we need the file.
             // For simplicity, let's just use the previewURL if it's a data string.
             if (userMsg.image.startsWith('data:image')) {
                 base64ToSend = userMsg.image.split(',')[1];
             }
        }

        try {
            const response = await performDashboardAction(userMsg.content, storeData, base64ToSend);
            
            // Execute Action
            let aiResponseText = response.reply || "Action effectuée.";

            if (response.action === 'add_product' && response.data) {
                const newProduct = {
                    id: `ai-prod-${Date.now()}`,
                    name: response.data.name,
                    price: response.data.price,
                    description: response.data.description,
                    features: response.data.features || [],
                    originalImage: userMsg.image || "https://placehold.co/600x600?text=Product",
                    generatedImages: []
                };
                setStoreData({
                    ...storeData,
                    products: [newProduct, ...storeData.products]
                });
                aiResponseText = "J'ai ajouté le produit à votre catalogue !";
            } else if (response.action === 'update_theme' && response.data?.color) {
                setStoreData({ ...storeData, themeColor: response.data.color });
                aiResponseText = `Thème mis à jour en ${response.data.color}.`;
            } else if (response.action === 'update_name' && response.data?.storeName) {
                 setStoreData({ ...storeData, name: response.data.storeName });
                 aiResponseText = `Boutique renommée : ${response.data.storeName}.`;
            }

            setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "Désolé, je n'ai pas pu effectuer cette action. Veuillez réessayer." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <>
                        <span className="absolute -top-2 -right-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
                        </span>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-black text-white p-4 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center">✨</div>
                        <div>
                            <h3 className="font-bold text-sm">Melaniverse Assistant</h3>
                            <p className="text-xs text-gray-400">Powered by Gemini 2.5</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                {msg.image && (
                                    <img src={msg.image} className="w-32 h-32 object-cover rounded-lg mb-2 border border-gray-200" alt="uploaded" />
                                )}
                                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start">
                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        {previewUrl && (
                            <div className="relative inline-block mb-2">
                                <img src={previewUrl} className="h-16 w-16 object-cover rounded-lg border border-gray-200" alt="preview" />
                                <button onClick={() => {setPreviewUrl(""); setSelectedImage(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100"
                             >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                             </button>
                             <input 
                                type="text" 
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                                placeholder="Message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                             />
                             <button 
                                onClick={handleSend}
                                disabled={loading || (!inputValue.trim() && !previewUrl)}
                                className="bg-black text-white p-2 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                             >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;