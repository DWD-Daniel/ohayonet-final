import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

export default function NewProductsPage({
  initialProductType = 'drug',
}: { initialProductType?: string }) {

  const [searchParams] = useSearchParams();
  const buyId = searchParams.get('buyId');

  const [activeProductType, setActiveProductType] = useState<ProductType>(initialProductType as ProductType);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // --- AUTOMATIC CATEGORY SWITCHER ---
  // When a buyId exists in the URL, this looks for the product globally 
  // and forces the page to the correct category.
  useEffect(() => {
    if (buyId) {
      PRODUCT_CATEGORIES.forEach((cat) => {
        const found = cat.subcategories.some(sub => sub.products.some(p => p.id === buyId));
        if (found) {
          setActiveProductType(cat.type as ProductType);
        }
      });
    }
  }, [buyId]);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeProductType);
  const subcategories = activeCategory?.subcategories || [];

  const filteredProducts = useMemo(() => {
    let products: Product[] = [];

    // 1. Get initial list based on current active category
    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => { products.push(...sub.products); });
    }

    // 2. IF A BUY ID EXISTS: Force filter to show ONLY that product
    if (buyId) {
      return products.filter(p => p.id === buyId);
    }

    return products;
  }, [activeProductType, activeSubcategory, subcategories, buyId]);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* If buyId exists, we hide the filters to make it a "Focused View" */}
      {!buyId && (
        <div className="bg-stone-50 border-b border-gray-200 sticky top-16 z-40 p-4">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.type}
                onClick={() => setActiveProductType(category.type as ProductType)}
                className={`px-4 py-2 font-semibold rounded-full ${activeProductType === category.type ? 'bg-red-600 text-white' : 'bg-white border'}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-xl border p-6">
                <div className="h-64 bg-gray-100 rounded-lg mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-red-600 mb-6">{product.price}</p>
                
                <PaystackCheckout 
                  productName={product.name} 
                  productPrice={product.price} 
                  productId={product.id}
                  autoOpen={true} // Always open since we filtered down to just this product
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading product...</p>
        )}
      </div>
    </div>
  );
}