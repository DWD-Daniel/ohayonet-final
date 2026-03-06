import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NewProductsPage from './pages/NewProductsPage';
import ContactPage from './pages/ContactPage';
import MyOrdersPage from './pages/MyOrdersPage';

function App() {
  // RESTORED: Missing state definitions
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductType, setSelectedProductType] = useState('drug');
  const [searchQuery, setSearchQuery] = useState('');
  
  // NEW: State to hold the specific product ID being bought
  const [buyProductId, setBuyProductId] = useState<string | null>(null);

  // UPDATED: Accept a third parameter (productId)
  const handleNavigate = (page: string, productType?: string, productId?: string) => {
    setCurrentPage(page);
    if (productType) {
      setSelectedProductType(productType);
    }
    // Set or clear the buy ID based on what was clicked
    if (productId) {
      setBuyProductId(productId);
    } else {
      setBuyProductId(null);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setBuyProductId(null); // Clear specific product focus on general search
    setCurrentPage('products');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'products':
        return (
          <NewProductsPage
            initialProductType={selectedProductType}
            initialSearchQuery={searchQuery}
            initialBuyId={buyProductId} // PASS THE ID TO THE PAGE
            onSearchQueryUsed={() => setSearchQuery('')}
          />
        );
      case 'contact':
        return <ContactPage />;
      case 'orders':
        return <MyOrdersPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearchSubmit={handleSearchSubmit}
      />
      {renderPage()}
    </div>
  );
}

export default App;