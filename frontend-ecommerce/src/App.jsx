import { useState, useEffect, useRef } from "react";
import { getProducts, createOrder, getCart, syncCart, getMyOrders } from "./services/api";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer"; 
import SuccessModal from "./components/SuccessModal";
import AuthModal from "./components/AuthModal";
import CheckoutModal from "./components/CheckoutModal";
import OrderHistoryModal from "./components/OrderHistoryModal";
import { ArrowRight } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Cart State & Safety Flag
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); 
  
  // Refs for Scrolling
  const collectionRef = useRef(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  // ------------------------------------------------------------------
  // 1. INITIALIZATION
  // ------------------------------------------------------------------
  useEffect(() => {
    // Load Products
    getProducts().then(setProducts);

    // Check User Session
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        // Logged in? Fetch DB Cart.
        fetchDbCart(); 
    } else {
        // Guest? Load from LocalStorage.
        const savedGuestCart = localStorage.getItem("cart_guest");
        if (savedGuestCart) setCart(JSON.parse(savedGuestCart));
        // Guest is ready immediately
        setIsCartLoaded(true); 
    }
  }, []);

  const fetchDbCart = async () => {
    try {
        const dbCart = await getCart();
        if (Array.isArray(dbCart)) {
            setCart(dbCart);
        }
    } catch (err) {
        console.error("Failed to load DB cart", err);
    } finally {
        // Allow syncing only AFTER we tried to load data
        setIsCartLoaded(true);
    }
  };

  // ------------------------------------------------------------------
  // 2. SYNC LOGIC (Save Cart)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isCartLoaded) return; // Wait for initial load to finish

    if (user) {
        // Silent Background Sync to MongoDB
        syncCart(cart).catch(err => console.error("Sync failed", err));
    } else {
        // Sync to LocalStorage
        localStorage.setItem("cart_guest", JSON.stringify(cart));
    }
  }, [cart, user, isCartLoaded]); 

  // ------------------------------------------------------------------
  // 3. CART ACTIONS
  // ------------------------------------------------------------------
  const addToCart = (product) => {
    if (!user) { 
        setIsAuthOpen(true); 
        return; 
    }

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
  // 4. VIEW & FILTER HANDLERS
  // ------------------------------------------------------------------
  const handleViewAll = () => {
    setSearchTerm(""); // Reset Search
    if (collectionRef.current) {
        // Smooth scroll to top of list
        collectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ------------------------------------------------------------------
  // 5. AUTH HANDLERS
  // ------------------------------------------------------------------
  const handleLoginSuccess = async (userData) => {
    const guestCart = [...cart];
    setUser(userData);
    setIsAuthOpen(false);
    
    // Pause syncing during merge
    setIsCartLoaded(false);

    try {
        const dbCart = await getCart();
        // Merge Strategy: Guest items take priority
        if (guestCart.length > 0) {
            setCart(guestCart); 
        } else if (Array.isArray(dbCart)) {
            setCart(dbCart);
        }
    } catch (error) {
        console.error("Merge error", error);
    } finally {
        setIsCartLoaded(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCart([]); 
    setIsCartLoaded(true); 
  };

  // ------------------------------------------------------------------
  // 6. CHECKOUT LOGIC
  // ------------------------------------------------------------------
  const initiateCheckout = () => { setIsCartOpen(false); setIsCheckoutOpen(true); };
  
  const finalizeOrder = async () => {
    const orderData = { customerName: user.name, items: cart.map(i => ({ productId: i._id, quantity: i.quantity })) };
    await createOrder(orderData);
    setCart([]); setIsCheckoutOpen(false); setShowSuccess(true);
    getProducts().then(setProducts);
  };

  // Handler to open orders
  const handleOpenOrders = async () => {
    if (!user) return;
    try {
        const data = await getMyOrders();
        setMyOrders(data);
        setIsOrderHistoryOpen(true);
    } catch (err) {
        console.error("Failed to load orders", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        user={user} 
        onLogout={handleLogout}
        onLogin={() => setIsAuthOpen(true)}
        onSearch={setSearchTerm}
        onOpenOrders={handleOpenOrders}
      />
      
      {/* 1. COLLECTION SECTION (Top) */}
      <main ref={collectionRef} className="max-w-400 mx-auto px-4 md:px-12 pt-16 pb-24 scroll-mt-24">
        <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
            <h2 className="text-3xl font-bold text-black tracking-tighter uppercase">
                {searchTerm ? `Results for "${searchTerm}"` : "Collection"}
            </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, idx) => (
                <div key={p._id} className="animate-in fade-in duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ProductCard product={p} onAdd={addToCart} />
                </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-[#999]">
                <p>No products found matching your search.</p>
                <button onClick={handleViewAll} className="mt-4 text-[#E60033] font-bold underline">Clear Search</button>
            </div>
          )}
        </div>
      </main>

      {/* 2. HERO / BRANDING SECTION (Bottom) */}
      <section className="relative py-16 px-4 md:px-12 max-w-400 mx-auto border-t border-[#e0e0e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#e0e0e0]">
            
            <div className="bg-[#E60033] p-12 md:p-24 flex flex-col justify-center text-white">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
                    TACTILE<br/>PRECISION.
                </h1>
                <p className="text-lg opacity-90 max-w-md leading-relaxed">
                    Elevate your workflow with high-performance mechanical keyboards and desk essentials. Engineered for speed, comfort, and aesthetics.
                </p>
            </div>
            
            <div className="bg-gray-100 h-96 md:h-auto flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
        </div>
      </section>

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
            </div>
            <div className="text-xs text-[#999] text-center">
                <p>COPYRIGHT © LOTUS ALL RIGHTS RESERVED 2026.</p>
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

      <OrderHistoryModal 
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={myOrders}
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