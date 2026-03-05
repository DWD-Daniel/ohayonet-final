import { useState, useEffect, memo, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import Carousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';
import PaystackCheckout from '../components/PaystackCheckout';
import { PRODUCT_CATEGORIES, getNewArrivals, getDiscountedProducts, Product } from '../data/categories';

interface HomePageProps {
  onNavigate: (page: string, productType?: string) => void;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'drug' | 'non-drug' | 'medical-device'>('drug');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeCategory = PRODUCT_CATEGORIES.find((cat) => cat.type === activeTab);
  const newArrivals = useMemo(() => getNewArrivals(), []);
  const discountedProducts = useMemo(() => getDiscountedProducts(), []);

  const handleSubcategoryClick = () => {
    onNavigate('products', activeTab);
  };

  const ProductCard = memo(({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group">
      <div
        className="h-48 bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
        style={{
          backgroundImage: `url(${product.image})`,
        }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-bold text-black flex-1">{product.name}</h3>
          {product.isNew && (
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full ml-2 flex-shrink-0">
              New
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-red-600">{product.price}</span>
          {product.discount && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{product.discount}</span>
          )}
        </div>
        <div className="mt-3">
          <PaystackCheckout
            productName={product.name}
            productPrice={product.price}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="pt-16 min-h-screen bg-white">
      <section
        className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HERO_IMAGES[heroImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out',
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 mt-6 md:mt-0">Advanced Healthcare Solutions</h1>
          <p className="text-base md:text-xl text-gray-100 mb-4 md:mb-8">
            Your trusted source for quality pharmaceuticals and health products
          </p>

          <div className="md:hidden mb-6">
            <SearchBar onSearch={setSearchQuery} placeholder="Search products..." />
          </div>

          <button
            onClick={() => onNavigate('products', 'drug')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-full font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-12 bg-stone-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4 mb-8 justify-center">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.type}
                onClick={() => setActiveTab(category.type as typeof activeTab)}
                className={`px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-base font-semibold rounded-full transition-all ${
                  activeTab === category.type
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-black border-2 border-gray-200 hover:border-red-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {activeCategory && (
            <Carousel items={activeCategory.subcategories} onCardClick={handleSubcategoryClick} />
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black mb-8">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black mb-8">Special Discounts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; 2026 Ohayonet Pharmacy. All rights reserved. | Terms & Conditions | Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
