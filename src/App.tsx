import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NewProductsPage from './pages/NewProductsPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [buyProductId, setBuyProductId] = useState<string | null>(null);

  // UPDATED: Now uses actual URL navigation
  const handleNavigate = (page: string, productType?: string, productId?: string) => {
    if (productType) {
      const category = productType.split('?')[0];
      setSelectedProductType(category);
    }
    
    if (productId) {
      setBuyProductId(productId);
    } else {
      setBuyProductId(null);
    }

    // Convert internal state names to URLs
    const targetPath = page === 'home' ? '/' : `/${page}`;
    navigate(targetPath);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setBuyProductId(null);
    navigate('/products'); // Redirects to the products URL
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Note: You may need to update Navigation.tsx to use 
         the 'location.pathname' to highlight active links 
      */}
      <Navigation
        currentPage={window.location.pathname.replace('/', '') || 'home'}
        onNavigate={handleNavigate}
        onSearchSubmit={handleSearchSubmit}
      />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        
        <Route path="/products" element={
          <NewProductsPage
            initialProductType={selectedProductType}
            initialSearchQuery={searchQuery}
            initialBuyId={buyProductId}
            onSearchQueryUsed={() => setSearchQuery('')}
          />
        } />
        
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Fallback for typing wrong URLs */}
        <Route path="*" element={<HomePage onNavigate={handleNavigate} />} />
      </Routes>
    </div>
  );
}

export default App;