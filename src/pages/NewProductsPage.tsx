import { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

interface NewProductsPageProps {
  initialProductType?: string;
  initialSearchQuery?: string;
  initialBuyId?: string | null; // NEW: Receive the ID
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

  // Keep internal category state in sync if App tells us to change categories
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

    // 1. Gather products for the current tab
    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => { products.push(...sub.products); });
    }

    // 2. THE OVERRIDE: If a specific product was clicked on the Home Page, show ONLY that product
    if (initialBuyId) {
      return products.filter((p) => p.id === initialBuyId);
    }

    // 3. Normal Search Bar logic
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
      {/* Hide filters if we are isolating a specific product purchase */}
      {!initialBuyId && (
        <div className="bg-stone-50 border-b border-gray-200 sticky top-16 z-40 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <SearchBar onSearch={setSearchQuery} value={searchQuery} placeholder="Search products..." />
          </div>
        </div>
      )}

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg p-4">
                  <div
                    className="h-48 bg-gray-200 bg-cover bg-center rounded-lg mb-4"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <h3 className="text-sm font-bold text-black mb-3 line-clamp-2 h-10">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">{product.price}</span>
                    <PaystackCheckout
                      productName={product.name}
                      productPrice={product.price}
                      productId={product.id}
                      autoOpen={initialBuyId === product.id} // Automatically triggers checkout!
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center py-12 text-gray-500">No products found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}