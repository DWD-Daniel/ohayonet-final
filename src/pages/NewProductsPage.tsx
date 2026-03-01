import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, Product, ProductType } from '../data/categories';

interface NewProductsPageProps {
  initialProductType?: string;
  initialSearchQuery?: string;
  onSearchQueryUsed?: () => void;
}

export default function NewProductsPage({
  initialProductType = 'drug',
  initialSearchQuery = '',
  onSearchQueryUsed
}: NewProductsPageProps) {
  const [activeProductType, setActiveProductType] = useState<ProductType>(initialProductType as ProductType);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      if (onSearchQueryUsed) {
        onSearchQueryUsed();
      }
    }
  }, [initialSearchQuery, onSearchQueryUsed]);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeProductType);
  const subcategories = activeCategory?.subcategories || [];

  const filteredProducts = useMemo(() => {
    let products: Product[] = [];

    if (activeProductType === 'medical-device') {
      products = subcategories[0]?.products || [];
    } else if (activeSubcategory) {
      const subcategory = subcategories.find((sub) => sub.id === activeSubcategory);
      products = subcategory?.products || [];
    } else {
      subcategories.forEach((sub) => {
        products.push(...sub.products);
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.price.toLowerCase().includes(query),
      );
    }

    return products;
  }, [activeProductType, activeSubcategory, searchQuery, subcategories]);

  const handleProductTypeChange = (type: ProductType) => {
    setActiveProductType(type);
    setActiveSubcategory(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="bg-stone-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 mb-4">
            <div className="flex gap-2 mb-4 lg:mb-0 overflow-x-auto">
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category.type}
                  onClick={() => handleProductTypeChange(category.type)}
                  className={`px-4 py-2 font-semibold rounded-full whitespace-nowrap transition-all ${
                    activeProductType === category.type
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-black border-2 border-gray-200 hover:border-red-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:block flex-1 max-w-xs">
              <SearchBar
                onSearch={setSearchQuery}
                value={searchQuery}
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="lg:hidden">
            <SearchBar
              onSearch={setSearchQuery}
              value={searchQuery}
              placeholder="Search products..."
            />
          </div>

          {activeProductType !== 'medical-device' && subcategories.length > 0 && (
            <div className="mt-4">
              <div className="relative inline-block w-full lg:w-64">
                <select
                  value={activeSubcategory || ''}
                  onChange={(e) => setActiveSubcategory(e.target.value || null)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg appearance-none bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">All {activeCategory?.label}</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">{activeCategory?.label}</h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group"
                >
                  <div
                    className="h-48 bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-300 relative"
                    style={{
                      backgroundImage: `url(${product.image})`,
                    }}
                  >
                    {product.isNew && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                        {product.discount}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-bold text-black mb-3 line-clamp-2 h-10">{product.name}</h3>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">{product.price}</span>
                      <PaystackCheckout
                        productName={product.name}
                        productPrice={product.price}
                        productId={product.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-black text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; 2026 Ohayonet Pharmacy. All rights reserved. | Terms & Conditions | Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
