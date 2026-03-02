import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NewProductsPage from './pages/NewProductsPage';
import ContactPage from './pages/ContactPage';
import MyOrdersPage from './pages/MyOrdersPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductType, setSelectedProductType] = useState('drug');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: string, productType?: string) => {
    setCurrentPage(page);
    if (productType) {
      setSelectedProductType(productType);
    }
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('products');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
          />
        );
      case 'products':
        return (
          <NewProductsPage
            initialProductType={selectedProductType}
            initialSearchQuery={searchQuery}
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
