import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaystackCheckout from '../components/PaystackCheckout';
import { getAllProducts, Product } from '../data/categories';
import { PRODUCT_DETAILS, ProductDetail } from '../data/productDetails';
import { ShoppingCart, BadgeCheck, Calendar, MapPin } from 'lucide-react';

interface EnhancedProduct extends Product {
  strength: string;
  form: string;
  sku: string;
  expiration: string;
  description: string;
  isInStock: boolean;
  gallery: string[];
  genericAlternatives: Product[];
}

// Dynamic tabs from product data

const PDP_FAQS = [
  { question: 'What is Daktacort used for?', answer: "Treats fungal skin infections with inflammation like athlete's foot, jock itch." },
  { question: 'How long to use Daktacort?', answer: '7-14 days or as prescribed. Do not exceed 2 weeks without doctor advice.' },
  { question: 'Can children use it?', answer: 'Not for children under 10 without pediatrician consultation.' },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<EnhancedProduct | null>(null);
  const [activeTab, setActiveTab] = useState('how-to-use');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      const allProds = getAllProducts();
        const baseProduct = allProds.find(p => p.id === id);
      if (baseProduct) {
        const detail = PRODUCT_DETAILS[id as keyof typeof PRODUCT_DETAILS] || PRODUCT_DETAILS['default'];
        const enhanced: EnhancedProduct = {
          ...baseProduct,
          ...detail,
          sku: id!.toUpperCase(),
          isInStock: true,
          gallery: [baseProduct.image, baseProduct.image, baseProduct.image],
        };
        setProduct(enhanced);
      }
    }
  }, [id]);

  const schemaData = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${product.name} ${product.strength} ${product.form}`,
    image: product.gallery[0],
    brand: { '@type': 'Brand', name: 'Ohayonet Pharmacy' },
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price.replace('₦', '').replace(/,/g, ''),
      priceCurrency: 'NGN',
      availability: product.isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  } : null;

  if (!product) return <div className="pt-16 p-8 text-center">Product not found</div>;

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* SEO Schema */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {null}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="w-full h-80 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={product.gallery[selectedImage]}
                alt={`${product.name} packaging`}
                className="w-full h-full object-cover lazy"
                loading="lazy"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto p-2 -m-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === idx ? 'border-red-600 ring-4 ring-red-200' : 'border-gray-200'} shadow-md`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name} {product.strength} {product.form}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Pharmacy
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">SKU: {product.sku}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Expires: {new Date(product.expiration).toLocaleDateString('en-NG', { year: 'numeric', month: 'short' })}
              </div>
            </div>

            {/* Price & Stock */}
            <div className="space-y-3">
              {product.discount && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-red-600">{product.price}</span>
                  <span className="text-xl line-through text-gray-500">Original Price</span>
                </div>
              )}
              {!product.discount && (
                <span className="text-3xl md:text-4xl font-bold text-red-600">{product.price}</span>
              )}
              <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
                <span>✓ In Stock</span>
              </div>
            </div>

            {/* Buy Button */}
            <PaystackCheckout
              productName={`${product.name} ${product.strength} ${product.form}`}
              productPrice={product.price}
              productId={product.id}
            />

            {/* Local SEO */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Fast Delivery</p>
                  <p className="text-sm text-blue-800">Lagos, Abuja, Port Harcourt - Same day dispatch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </section>

          {/* Beat the Competition Tabs */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Beat the Competition</h2>
            <div className="border-b border-gray-200">
              {Object.keys(TAB_CONTENT).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm md:text-base mr-1 ${activeTab === tab
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-red-600'
                    }`}
                >
                  {tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
            <div className="py-8 text-gray-700 leading-relaxed">
              (product as any)[activeTab.replace('-', 'ToUse' === 'how-to-use' ? 'howToUse' : activeTab === 'side-effects' ? 'sideEffects' : activeTab === 'precautions' ? 'precautions' : 'ingredients')] || 'Details coming soon.'
            </div>
          </section>

          {/* Generic Alternatives */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Generic Alternatives (Save More)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.genericAlternatives.map((alt) => (
                <div key={alt.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="h-32 bg-gray-200 rounded-xl mb-4 bg-cover bg-center" style={{ backgroundImage: `url(${alt.image})` }} />
                  <h3 className="font-bold mb-2">{alt.name}</h3>
                  <div className="text-2xl font-bold text-red-600 mb-4">{alt.price}</div>
                  <PaystackCheckout
                    productName={alt.name}
                    productPrice={alt.price}
                    productId={alt.id}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Accordion FAQs for SEO */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            {PDP_FAQS.map((faq, idx) => (
              <details key={idx} className="mb-4 border rounded-xl p-4 [&_summary]:font-semibold [&_summary]:cursor-pointer">
                <summary className="list-none mb-2">{faq.question}</summary>
                <p className="text-gray-700 ml-4">{faq.answer}</p>
              </details>
            ))}
          </section>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-50 shadow-2xl">
        <PaystackCheckout
          productName={`${product.name} ${product.strength} ${product.form}`}
          productPrice={product.price}
          productId={product.id}
        />
      </div>
    </div>
  );
}

