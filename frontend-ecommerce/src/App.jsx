import { useState, useEffect } from "react";
import { getProducts, createOrder, getCart, syncCart } from "./services/api";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer"; 
import SuccessModal from "./components/SuccessModal";
import AuthModal from "./components/AuthModal";
import CheckoutModal from "./components/CheckoutModal";
import { ArrowRight } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  
  // Cart State
  const [cart, setCart] = useState([]);
  // CRITICAL FLAG: Prevents saving an empty cart to DB before the DB has finished loading
  const [isCartLoaded, setIsCartLoaded] = useState(false); 
  
  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ------------------------------------------------------------------
  // 1. INITIALIZATION LOGIC
  // ------------------------------------------------------------------
  useEffect(() => {
    // 1a. Load Products
    getProducts().then(setProducts);

    // 1b. Check User Session
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        // If logged in, we MUST fetch from DB. 
        // We do NOT set isCartLoaded(true) yet. We wait for fetchDbCart.
        fetchDbCart(); 
    } else {
        // If guest, load from LocalStorage immediately
        const savedGuestCart = localStorage.getItem("cart_guest");
        if (savedGuestCart) setCart(JSON.parse(savedGuestCart));
        // Guests are ready immediately
        setIsCartLoaded(true); 
    }
  }, []);

  // Helper: Fetch Cart from Database
  const fetchDbCart = async () => {
    try {
        const dbCart = await getCart();
        if (Array.isArray(dbCart)) {
            setCart(dbCart);
        }
    } catch (err) {
        console.error("Failed to load DB cart", err);
    } finally {
        // CRITICAL: Only allow syncing AFTER we have attempted to load data
        setIsCartLoaded(true);
    }
  };

  // ------------------------------------------------------------------
  // 2. SYNC LOGIC (The "Save" Mechanism)
  // ------------------------------------------------------------------
  useEffect(() => {
    // SECURITY CHECK: If the app is still loading the cart, DO NOT SAVE.
    // This prevents wiping the database with an empty array on page reload.
    if (!isCartLoaded) return; 

    if (user) {
        // If user, sync to MongoDB in the background
        syncCart(cart).catch(err => console.error("Sync failed", err));
    } else {
        // If guest, sync to LocalStorage
        localStorage.setItem("cart_guest", JSON.stringify(cart));
    }
  }, [cart, user, isCartLoaded]); 

  // ------------------------------------------------------------------
  // 3. CART ACTIONS (Optimistic Updates)
  // ------------------------------------------------------------------
  const addToCart = (product) => {
    // Updates UI immediately. The useEffect above handles the saving.
    setCart(prev => {
      const existing = prev.find(p => p._id === product._id);
      if (existing) {
        return prev.map(p => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // ------------------------------------------------------------------
  // 4. AUTH HANDLERS
  // ------------------------------------------------------------------
  const handleLoginSuccess = async (userData) => {
    // 1. Capture current guest items before switching user
    const guestCart = [...cart];
    
    // 2. Switch User
    setUser(userData);
    setIsAuthOpen(false);
    
    // 3. Pause Syncing while we merge (Safety Lock)
    setIsCartLoaded(false);

    try {
        // 4. Fetch the User's DB Cart
        const dbCart = await getCart();
        
        // 5. Merge Strategy:
        // If guest has items, they override DB (or merge). 
        // For simplicity: If guest cart has items, keep them. If empty, load DB cart.
        if (guestCart.length > 0) {
            setCart(guestCart); // This will eventually overwrite DB with Guest items
        } else if (Array.isArray(dbCart)) {
            setCart(dbCart);
        }
    } catch (error) {
        console.error("Merge error", error);
    } finally {
        // 6. Resume Syncing
        setIsCartLoaded(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear view and reset to guest mode
    setCart([]); 
    setIsCartLoaded(true); 
  };

  // ------------------------------------------------------------------
  // 5. CHECKOUT LOGIC
  // ------------------------------------------------------------------
  const initiateCheckout = () => { setIsCartOpen(false); setIsCheckoutOpen(true); };
  
  const finalizeOrder = async () => {
    const orderData = { customerName: user.name, items: cart.map(i => ({ productId: i._id, quantity: i.quantity })) };
    await createOrder(orderData);
    setCart([]); setIsCheckoutOpen(false); setShowSuccess(true); loadProducts();
  };

  return (
    // UNIQLO STYLE: White BG, Black Text, No Smoothing
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        user={user} 
        onLogout={handleLogout}
        onLogin={() => setIsAuthOpen(true)}
      />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 px-4 md:px-12 max-w-400 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#e0e0e0]">
            <div className="bg-[#E60033] p-12 md:p-24 flex flex-col justify-center text-white">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-4">New Collection</h2>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
                    SIMPLE MADE<br/>BETTER.
                </h1>
                <p className="text-lg opacity-90 max-w-md leading-relaxed mb-8">
                    Thoughtful design for everyday life. High quality, functional, and affordable.
                </p>
                <button className="bg-white text-[#E60033] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-fit">
                    View Lookbook
                </button>
            </div>
            <div className="bg-gray-100 h-96 md:h-auto flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <main className="max-w-400 mx-auto px-4 md:px-12 pb-24">
        <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
            <h2 className="text-3xl font-bold text-black tracking-tighter uppercase">Weekly Arrivals</h2>
            <button className="flex items-center gap-2 text-xs font-bold text-[#767676] hover:text-[#E60033] uppercase tracking-wider transition-colors">
                View All Items <ArrowRight size={14} />
            </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((p, idx) => (
            <div key={p._id} className="animate-in fade-in duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                <ProductCard product={p} onAdd={addToCart} />
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f5f5f5] pt-16 pb-8 border-t border-[#e0e0e0]">
        <div className="max-w-400 mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-sm">
                <div>
                    <h3 className="font-bold mb-4 uppercase">About Us</h3>
                    <ul className="space-y-2 text-[#767676]">
                        <li><a href="#" className="hover:underline">Our Story</a></li>
                        <li><a href="#" className="hover:underline">Sustainability</a></li>
                        <li><a href="#" className="hover:underline">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4 uppercase">Help</h3>
                    <ul className="space-y-2 text-[#767676]">
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                        <li><a href="#" className="hover:underline">Returns</a></li>
                        <li><a href="#" className="hover:underline">Order Status</a></li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h3 className="font-bold mb-4 uppercase">Newsletter</h3>
                    <div className="flex gap-0">
                        <input className="bg-white border border-[#ccc] px-4 py-3 w-full focus:outline-none focus:border-black rounded-none" placeholder="Enter your email address" />
                        <button className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-[#E60033] transition-colors rounded-none">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="text-xs text-[#999] text-center border-t border-[#e0e0e0] pt-8">
                <p>COPYRIGHT © LOTUS CO., LTD. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
      </footer>

      {/* Modals */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateQuantity={updateQuantity} 
        checkout={initiateCheckout} 
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} onConfirm={finalizeOrder} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}