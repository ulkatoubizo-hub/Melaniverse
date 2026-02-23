import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreData } from './types';
import WelcomePage from './pages/WelcomePage'; // New Import
import LandingPage from './pages/LandingPage';
import ManualCreationPage from './pages/ManualCreationPage'; // New Import
import GenerationPage from './pages/GenerationPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Storefront from './pages/Storefront';
import StoreProductPage from './pages/StoreProductPage';
import StoreCheckoutPage from './pages/StoreCheckoutPage';
import AddProductPage from './pages/AddProductPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Context
interface AppContextType {
  storeData: StoreData | null;
  setStoreData: (data: StoreData) => void;
}

const AppContext = createContext<AppContextType>({
  storeData: null,
  setStoreData: () => {},
});

export const useApp = () => useContext(AppContext);

// Main Component
const App = () => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  return (
    <AppContext.Provider value={{ storeData, setStoreData }}>
      <HashRouter>
        <div className="min-h-screen">
          <Routes>
            {/* New Entry Point */}
            <Route path="/" element={<WelcomePage />} />
            
            {/* AI Creation Flow (Previously LandingPage) */}
            <Route path="/create-ai" element={<LandingPage />} />
            
            {/* Manual Creation Flow */}
            <Route path="/create-manual" element={<ManualCreationPage />} />

            <Route path="/generating" element={<GenerationPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Seller Routes */}
            <Route path="/dashboard" element={storeData ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/dashboard/add-product" element={storeData ? <AddProductPage /> : <Navigate to="/" />} />
            
            {/* Super Admin Route */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Storefront Routes */}
            <Route path="/store" element={storeData ? <Storefront /> : <Navigate to="/" />} />
            <Route path="/store/product/:id" element={storeData ? <StoreProductPage /> : <Navigate to="/" />} />
            <Route path="/store/checkout" element={storeData ? <StoreCheckoutPage /> : <Navigate to="/" />} />
            <Route path="/store/success" element={<OrderSuccessPage />} />
          </Routes>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;