import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import customerImg from '../assets/customer.png';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mnjowjzk");

  return (
    <div className="pt-16 min-h-screen">
      <section
       className="relative py-32"
       style={{
       backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${customerImg})`,
       backgroundSize: 'cover',
       backgroundPosition: 'center',
       backgroundAttachment: 'fixed',
       }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Get in touch with our team of pharmaceutical experts
          </p>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Get In Touch</h2>
              <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                Have questions about our products or services? Our dedicated team is here to help
                you find the right pharmaceutical solutions for your needs.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Phone</h3>
                    <p className="text-gray-600">+234 816 013 7474</p>
                    <p className="text-gray-600">Mon-Fri, 8am-6pm WAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email</h3>
                    <p className="text-gray-600">ohayonetpharmacy@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Address</h3>
                    <p className="text-gray-600">Aiye Bus Stop, 21 Osolo Wy, Isolo</p>
                    <p className="text-gray-600">Lagos 102214, Lagos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {state.succeeded ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-6">Thank You!</h3>
                  <p className="text-gray-600">Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-black mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        required
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                        required
                      />
                      <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>

                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2"
                    >
                      {state.submitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; 2024 Ohayonet Pharmacy. All rights reserved. | Terms & Conditions | Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
