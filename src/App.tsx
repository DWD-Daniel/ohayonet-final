import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NewProductsPage from './pages/NewProductsPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [buyProductId, setBuyProductId] = useState<string | null>(null);

  // UPDATED: Now uses actual URL navigation
  const handleNavigate = (page: string, productType?: string, param?: string) => {
    if (productType) {
      const category = productType.split('?')[0];
      setSelectedProductType(category);
    }
    
    if (param && param !== buyProductId) {
      setSelectedSubcategory(param);
    }
    
    if (param?.startsWith('p-') || param?.startsWith('ad-') || param?.startsWith('ah-')) {
      setBuyProductId(param);
    } else {
      setBuyProductId(null);
    }

    // Convert internal state names to URLs
    let targetPath = page === 'home' ? '/' : `/${page}`;
    if (page === 'product' && param) {
      targetPath = `/product/${param}`;
    }
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
        <Route path="/" element={<HomePage onNavigate={handleNavigate} onSearchSubmit={handleSearchSubmit} />} />
        
        <Route path="/products" element={
          <NewProductsPage
            initialProductType={selectedProductType}
            initialSubcategory={selectedSubcategory}
            initialSearchQuery={searchQuery}
            initialBuyId={buyProductId}
            onSearchQueryUsed={() => setSearchQuery('')}
            onNavigate={handleNavigate}
          />
        } />
        
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* Fallback for typing wrong URLs */}
        <Route path="*" element={<HomePage onNavigate={handleNavigate} />} />
      </Routes>
    </div>
  );
}

export default App;