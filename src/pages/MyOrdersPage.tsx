import { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

interface NewProductsPageProps {
  initialProductType?: string;
  initialSearchQuery?: string;
}

export default function NewProductsPage({
  initialProductType = 'drug',
}: NewProductsPageProps) {
  
  const [searchParams] = useSearchParams();
  const buyId = searchParams.get('buyId');

  const [activeProductType, setActiveProductType] = useState<ProductType>(initialProductType as ProductType);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- THE FIX: CATEGORY SYNC EFFECT ---
  // When buyId exists, find which category it belongs to and force the switch
  useEffect(() => {
    if (buyId) {
      PRODUCT_CATEGORIES.forEach((category) => {
        const found = category.subcategories.some(sub => 
          sub.products.some(p => p.id === buyId)
        );
        if (found) {
          setActiveProductType(category.type as ProductType);
        }
      });
    }
  }, [buyId]);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeProductType);
  const subcategories = activeCategory?.subcategories || [];

  const filteredProducts = useMemo(() => {
    let products: Product[] = [];

    // 1. Get products based on current active category/subcategory
    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => { products.push(...sub.products); });
    }

    // 2. SEARCH OVERRIDE: If buyId exists, filter strictly to that item
    if (buyId) {
      return products.filter((p) => p.id === buyId);
    }

    // 3. REGULAR SEARCH BAR FILTER
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return products.filter((p) => 
        p.name.toLowerCase().includes(query) || p.price.toLowerCase().includes(query)
      );
    }

    return products;
  }, [activeProductType, activeSubcategory, searchQuery, subcategories, buyId]);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-stone-50 border-b border-gray-200 sticky top-16 z-40 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <SearchBar onSearch={setSearchQuery} value={searchQuery} placeholder="Search products..." />
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <p className="text-red-600 font-bold mb-4">{product.price}</p>
                  
                  <PaystackCheckout
                    productName={product.name}
                    productPrice={product.price}
                    productId={product.id}
                    autoOpen={buyId === product.id} // Triggers modal automatically
                  />
                </div>
              ))
            ) : (
              <p className="text-center w-full py-20 text-gray-500">
                {buyId ? "Locating your product..." : "No products found."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}