import React, { useState, useEffect } from 'react';
import { compareProducts, getSimilarProducts } from './services/geminiService';
import { Search, Loader2, Info, ShieldCheck, Home, Mail, Sun, Moon, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [productA, setProductA] = useState('');
  const [similarProducts, setSimilarProducts] = useState<string[]>([]);
  const [productB, setProductB] = useState('');
  const [comparison, setComparison] = useState<{ text: string; groundingChunks?: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [view, setView] = useState<'home' | 'about' | 'privacy' | 'contact'>('home');
  const [contactForm, setContactForm] = useState({ email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleReset = () => {
    setProductA('');
    setProductB('');
    setSimilarProducts([]);
    setComparison(null);
    setView('home');
  };

  const handleFindSimilar = async () => {
    if (!productA) return;
    setLoadingSimilar(true);
    try {
      const products = await getSimilarProducts(productA);
      setSimilarProducts(products);
      setProductB('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleCompare = async () => {
    if (!productA || !productB) return;
    setLoading(true);
    try {
      let location: { lat: number; lng: number } | undefined;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = { lat: position.coords.latitude, lng: position.coords.longitude };
      } catch (e) {
        console.warn("Geolocation not available or denied", e);
      }
      
      const result = await compareProducts(productA, productB, location);
      setComparison(result || { text: 'No comparison available.' });
    } catch (error) {
      setComparison({ text: 'Error comparing products.' });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        setContactStatus('sent');
        setContactForm({ email: '', message: '' });
      } else {
        setContactStatus('error');
      }
    } catch (error) {
      setContactStatus('error');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'about':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-3xl font-bold mb-4 text-emerald-green">About Us</h2>
            <p className="text-neutral-600 dark:text-neutral-300">Versusfy is a minimalist, futuristic product comparison engine. Our goal is to provide clear, data-driven insights to help you make informed purchasing decisions. We focus on features and price ranges, ensuring you get the best information without unnecessary clutter.</p>
          </motion.div>
        );
      case 'privacy':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
            <h2 className="text-4xl font-bold mb-6 text-apple-red">Privacy Policy & Terms of Service</h2>
            <p className="mb-4">Last updated: March 31, 2026</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">1. Introduction</h3>
            <p className="mb-4">Welcome to Versusfy ("we," "us," or "our"). Your privacy is of paramount importance to us. This Privacy Policy explains how we collect, use, and protect your information when you use our product comparison service at www.versusfy.com.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">2. Information We Collect</h3>
            <p className="mb-4">We are committed to a "Privacy by Design" approach. Versusfy is designed to function without the need to collect, store, or process personal user data. When you use our comparison tool, we process the product names you provide using AI to generate comparisons. We do not store these queries, nor do we link them to any identifiable user information.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">3. Use of AI and Data Processing</h3>
            <p className="mb-4">We use advanced AI models to analyze product features and provide comparisons. This processing happens in real-time. We do not retain your input data for training purposes or any other long-term storage.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">4. Cookies and Tracking</h3>
            <p className="mb-4">We use minimal, essential cookies to ensure the website functions correctly. We do not use tracking cookies for advertising or profiling purposes.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">5. Amazon Associates Disclaimer</h3>
            <p className="mb-4 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <strong>www.versusfy.com</strong> is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com. As an Amazon Associate, we earn from qualifying purchases.
            </p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">6. Third-Party Links</h3>
            <p className="mb-4">Our site may contain links to third-party websites, including Amazon. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">7. Changes to This Policy</h3>
            <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-white">8. Contact Us</h3>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us through our <button onClick={() => setView('contact')} className="text-emerald-green hover:underline">Contact form</button>.</p>
            
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 text-center">
              <button onClick={() => setView('home')} className="bg-emerald-green hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition">
                Return to Versusfy Home
              </button>
            </div>
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">Contact Us</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:border-apple-red outline-none transition text-neutral-900 dark:text-white"
                required
              />
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:border-apple-red outline-none transition text-neutral-900 dark:text-white h-32"
                required
              />
              <button
                type="submit"
                disabled={contactStatus === 'sending'}
                className="w-full bg-emerald-green hover:bg-emerald-600 text-white font-bold py-4 rounded-lg transition"
              >
                {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {contactStatus === 'sent' && <p className="text-emerald-green text-center">Message sent successfully!</p>}
              {contactStatus === 'error' && <p className="text-apple-red text-center">Error sending message.</p>}
            </form>
          </motion.div>
        );
      default:
        return (
          <>
            <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Product A"
                    value={productA}
                    onChange={(e) => setProductA(e.target.value)}
                    className="flex-grow bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:border-apple-red outline-none transition text-neutral-900 dark:text-white"
                  />
                  <button
                    onClick={handleFindSimilar}
                    disabled={loadingSimilar}
                    className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white p-4 rounded-lg transition"
                  >
                    {loadingSimilar ? <Loader2 className="animate-spin" /> : <Search />}
                  </button>
                </div>
                <select
                  value={productB}
                  onChange={(e) => setProductB(e.target.value)}
                  disabled={similarProducts.length === 0}
                  className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:border-apple-red outline-none transition text-neutral-900 dark:text-white appearance-none"
                >
                  <option value="">Select Similar Product</option>
                  {similarProducts.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCompare}
                disabled={loading || !productB}
                className="w-full bg-apple-red hover:bg-red-600 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
                Compare
              </button>
            </div>

            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl mt-12 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800"
              >
                <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Comparison Results</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{comparison.text}</div>
                {comparison.groundingChunks && comparison.groundingChunks.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Sources:</h3>
                    <ul className="space-y-1">
                      {comparison.groundingChunks.map((chunk, index) => (
                        chunk.maps && (
                          <li key={index}>
                            <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-emerald-green hover:underline">
                              {chunk.maps.title}
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center">
      <header className="mb-12 text-center flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white transition">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={handleReset} className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white transition">
            <RotateCcw size={20} />
          </button>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-emerald-green">Versusfy</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Pick Your Winner!</p>
      </header>

      {renderContent()}

      <footer className="mt-auto pt-12 flex gap-6 text-neutral-500">
        <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-white transition"><Home size={16}/> Home</button>
        <button onClick={() => setView('about')} className="flex items-center gap-1 hover:text-white transition"><Info size={16}/> About</button>
        <button onClick={() => setView('privacy')} className="flex items-center gap-1 hover:text-white transition"><ShieldCheck size={16}/> Privacy</button>
        <button onClick={() => setView('contact')} className="flex items-center gap-1 hover:text-white transition"><Mail size={16}/> Contact</button>
      </footer>
    </div>
  );
}
