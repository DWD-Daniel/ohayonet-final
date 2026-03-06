import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react'; // Added for the "pop-up" icon
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

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

  // Synchronize state with props
  useEffect(() => {
    if (initialProductType) {
      setActiveProductType(initialProductType as ProductType);
      setActiveSubcategory(null);
    }
  }, [initialProductType]);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      if (onSearchQueryUsed) onSearchQueryUsed();
    }
  }, [initialSearchQuery, onSearchQueryUsed]);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeProductType);
  const subcategories = activeCategory?.subcategories || [];

  const filteredProducts = useMemo(() => {
    let products: Product[] = [];

    // 1. Get products based on category/subcategory
    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => { products.push(...sub.products); });
    }

    // 2. Buy Now Override
    if (initialBuyId) {
      return products.filter((p) => p.id === initialBuyId);
    }

    // 3. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.price.toLowerCase().includes(query),
      );
    }
    
    return products;
  }, [activeProductType, activeSubcategory, searchQuery, subcategories, initialBuyId]);

  return (
    <div className=\"pt-16 min-h-screen bg-white\">
      {/* RESTORED SECTION: 
          This contains the category tabs and the subcategory "pop-up" menu. 
          We hide this when a user clicks "Buy Now" to keep the focus on the product.
      */}
      {!initialBuyId && (
        <div className=\"bg-stone-50 border-b border-gray-200 sticky top-16 z-40\">
          <div className=\"max-w-7xl mx-auto px-6 py-4\">
            <div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4\">
              
              {/* Main Category Tabs */}
              <div className=\"flex gap-2 overflow-x-auto pb-2 md:pb-0\">
                {PRODUCT_CATEGORIES.map((category) => (
                  <button
                    key={category.type}
                    onClick={() => {
                      setActiveProductType(category.type as ProductType);
                      setActiveSubcategory(null);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeProductType === category.type
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className=\"w-full md:w-72\">
                <SearchBar onSearch={setSearchQuery} value={searchQuery} placeholder=\"Search products...\" />
              </div>
            </div>

            {/* Subcategory "Pop-up" / Filter List */}
            {activeProductType !== 'medical-device' && (
              <div className=\"mt-4 flex flex-wrap gap-2\">
                <button
                  onClick={() => setActiveSubcategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeSubcategory === null
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All {activeCategory?.label}
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubcategory(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeSubcategory === sub.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section className=\"py-12\">
        <div className=\"max-w-7xl mx-auto px-6\">
          <div className=\"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className=\"bg-white rounded-xl shadow-lg p-4\">
                  <div
                    className=\"h-48 bg-gray-200 bg-cover bg-center rounded-lg mb-4\"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <h3 className=\"text-sm font-bold text-black mb-3 line-clamp-2 h-10\">{product.name}</h3>
                  <div className=\"flex items-center justify-between\">
                    <span className=\"text-lg font-bold text-red-600\">{product.price}</span>
                    <PaystackCheckout
                      productName={product.name}
                      productPrice={product.price}
                      productId={product.id}
                      autoOpen={initialBuyId === product.id}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className=\"col-span-full text-center py-12 text-gray-500\">No products found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}