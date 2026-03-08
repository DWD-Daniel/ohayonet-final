import { useState } from 'react';
import { Pill, Menu, X, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, productType?: string, productId?: string) => void;
  onSearchSubmit?: (query: string) => void;
}
const MAIN_CATEGORIES = [
  { id: 'drug', label: 'Drugs' },
  { id: 'non-drug', label: 'Non-Drugs' },
  { id: 'medical-device', label: 'Medical Devices' },
];

export default function Navigation({ currentPage, onNavigate, onSearchSubmit }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const handleProductTypeClick = (type: string) => {
    onNavigate('products', type);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    setMobileProductsOpen(false);
  };

  const handleSearchSubmit = (query: string) => {
    if (onSearchSubmit) {
      onSearchSubmit(query);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 sm:gap-2 text-lg sm:text-2xl font-semibold text-black hover:text-red-600 transition-colors flex-shrink-0"
          >
            <Pill className="w-8 h-8 text-red-600 flex-shrink-0" />
             <span className="inline truncate">Ohayonet Pharmacy</span>
          </button>

          <div className="hidden lg:block flex-1 max-w-xs">
            <SearchBar onSubmit={handleSearchSubmit} placeholder="Search products..." />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Home
            </button>

            <div className="relative group">
              <button
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentPage === 'products' ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                Products
                <ChevronDown className="w-4 h-4" />
              </button>

              {productsDropdownOpen && (
                <div
                  onMouseEnter={() => setProductsDropdownOpen(true)}
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                  className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl"
                >
                  <div className="flex flex-col">
                    {MAIN_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleProductTypeClick(cat.id)}
                        className="text-left px-4 py-3 text-sm font-medium text-black hover:bg-red-50 hover:text-red-600 border-b border-gray-100 transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'contact' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'cart' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Cart
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:text-red-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-4 pt-4 pb-4">
            <div className="mb-4">
              <SearchBar onSubmit={handleSearchSubmit} placeholder="Search products..." className="w-full" />
            </div>

            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Home
            </button>

            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center justify-between ${
                  currentPage === 'products' ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileProductsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileProductsOpen && (
                <div className="bg-gray-50 py-2">
                  {MAIN_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleProductTypeClick(cat.id)}
                      className="block w-full text-left px-8 py-2 text-sm text-black hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors border-t border-gray-200 mt-2 pt-2 ${
                currentPage === 'contact' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors border-t border-gray-200 mt-2 pt-2 ${
                currentPage === 'cart' ? 'text-red-600' : 'text-black hover:text-red-600'
              }`}
            >
              Cart
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
