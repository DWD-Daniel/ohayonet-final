import { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

// Match this EXACTLY to what App.tsx passes
interface NewProductsPageProps {
  initialProductType?: string;
  initialSearchQuery?: string;
  initialBuyId?: string | null;
  onSearchQueryUsed?: () => void;
}

export default function NewProductsPage({
  initialProductType = 'drug',
  initialSearchQuery = '',
  initialBuyId = null,
  onSearchQueryUsed
}: NewProductsPageProps) {
  
  const [activeProductType, setActiveProductType] = useState<ProductType>(initialProductType as ProductType);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // track whether to show all subcategories on mobile
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  // Sync state when props change (e.g., clicking a category in the Navigation)
  useEffect(() => {
    if (initialProductType) {
      setActiveProductType(initialProductType as ProductType);
      setActiveSubcategory(null);
    }
  }, [initialProductType]);

  // Sync search queries from the Navigation
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      if (onSearchQueryUsed) onSearchQueryUsed();
    }
  }, [initialSearchQuery, onSearchQueryUsed]);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeProductType);
  const subcategories = activeCategory?.subcategories || [];

  const filteredProducts = useMemo(() => {
    // 1. If we have a specific Buy ID, find that product globally
    if (initialBuyId) {
      const allProducts: Product[] = [];
      PRODUCT_CATEGORIES.forEach(cat => {
        cat.subcategories.forEach(sub => allProducts.push(...sub.products));
      });
      return allProducts.filter(p => p.id === initialBuyId);
    }

    let products: Product[] = [];

    // 2. Otherwise, filter by the selected tabs
    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => { products.push(...sub.products); });
    }

    // 3. Apply search bar filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.price.toLowerCase().includes(query),
      );
    }
    
    return products;
  }, [activeProductType, activeSubcategory, searchQuery, subcategories, initialBuyId]);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Category & Subcategory Menus (Hidden if buying a specific item) */}
      {!initialBuyId && (
        <div className="bg-stone-50 border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {PRODUCT_CATEGORIES.map((category) => (
                  <button
                    key={category.type}
                    onClick={() => {
                      setActiveProductType(category.type as ProductType);
                      setActiveSubcategory(null);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      activeProductType === category.type ? 'bg-red-600 text-white' : 'bg-white border text-gray-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-72">
                <SearchBar onSearch={setSearchQuery} value={searchQuery} placeholder="Search products..." />
              </div>
            </div>

            {/* Subcategory Menu - This is your missing "types of drugs" list */}
            {activeProductType !== 'medical-device' && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!activeSubcategory ? 'bg-black text-white' : 'bg-gray-100'}`}
                >
                  All {activeCategory?.label}
                </button>
                {subcategories.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubcategory(sub.id)}
                    className={`${idx > 5 && !showAllSubcategories ? 'hidden md:block' : ''} px-3 py-1.5 rounded-lg text-xs font-medium ${
                      activeSubcategory === sub.id ? 'bg-black text-white' : 'bg-gray-100'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}

                {/* toggle arrow for mobile when there are more than 6 categories */}
                {subcategories.length > 6 && (
                  <button
                    className="md:hidden flex items-center"
                    onClick={() => setShowAllSubcategories((s) => !s)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showAllSubcategories ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg p-4">
                <div
                  className="h-48 bg-gray-200 bg-cover bg-center rounded-lg mb-4"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <h3 className="text-sm font-bold text-black mb-3 h-10 line-clamp-2">{product.name}</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <span className="text-lg font-bold text-red-600">{product.price}</span>
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
                    <PaystackCheckout
                      productName={product.name}
                      productPrice={product.price}
                      productId={product.id}
                      autoOpen={initialBuyId === product.id} // Auto-opens modal if clicked from home
                    />
                    <button
                      onClick={() => {
                        const existing = localStorage.getItem('cart');
                        let cart: Array<any> = existing ? JSON.parse(existing) : [];
                        const idx = cart.findIndex((item: any) => item.id === product.id);
                        if (idx > -1) {
                          cart[idx].quantity += 1;
                        } else {
                          cart.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1,
                          });
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert(`${product.name} added to cart`);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}