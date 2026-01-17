import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProductTable from "./components/ProductTable";
import OrderTable from "./components/OrderTable";
import StatsCard from "./components/StatsCard";
import ProductModal from "./components/ProductModal";
import Login from "./components/Login"; 
import DeleteModal from "./components/DeleteModal"; 
import { getProducts, createProduct, deleteProduct, updateProduct, getOrders } from "./services/api"; 
import { Plus, Package, Layers, PhilippinePeso } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("products");

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  
  // DELETE MODAL STATE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [productToDelete, setProductToDelete] = useState(null);      

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        setIsAuthenticated(true);
        loadData();
    }
  }, []);

  const loadData = async () => {
    const [p, o] = await Promise.all([getProducts(), getOrders()]);
    setProducts(p || []);
    setOrders(o || []);
  };

  const handleLogin = () => { setIsAuthenticated(true); loadData(); };
  const handleLogout = () => { localStorage.removeItem("admin_token"); setIsAuthenticated(false); setProducts([]); setOrders([]); };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  // --- HANDLERS ---
  const handleOpenCreate = () => { setEditingProduct(null); setIsProductModalOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setIsProductModalOpen(true); };

  const handleSubmit = async (formData) => {
    if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
    } else {
        await createProduct(formData);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    loadData();
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
        await deleteProduct(productToDelete);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        loadData();
    }
  };

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans text-[#1a1a1a]">
      
      {/* 1. Sidebar with Logout Prop */}
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} // <--- Pass Logout Function Here
      />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen transition-all">
        <header className="flex justify-between items-end mb-12 border-b border-[#e0e0e0] pb-6">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-tight leading-none mb-1">
                  {view === "products" ? "Inventory" : "Orders"}
                </h1>
                <p className="text-xs text-[#999] uppercase tracking-widest font-bold">
                  {view === "products" ? "Manage Catalog" : "Track Sales"}
                </p>
            </div>
            <div className="flex gap-4">
                {/* Logout Button Removed from Here */}
                
                {view === "products" && (
                <button onClick={handleOpenCreate} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#E60033] transition-colors flex items-center gap-2 rounded-none">
                    <Plus size={16} /> New Item
                </button>
                )}
            </div>
        </header>

        {view === "products" ? (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard title="Total Stock Keeping Unit" value={products.length} icon={Package} />
                <StatsCard title="Stock Count" value={totalStock} icon={Layers} />
                <StatsCard title="Valuation" value={`₱${totalValue.toLocaleString()}`} icon={PhilippinePeso} />
            </div>
            
            <ProductTable 
                products={products} 
                onDelete={handleDeleteClick} 
                onEdit={handleEdit} 
            />
          </div>
        ) : (
             <OrderTable orders={orders} />
        )}

        <ProductModal 
            isOpen={isProductModalOpen} 
            onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} 
            onSubmit={handleSubmit}
            initialData={editingProduct} 
        />

        <DeleteModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
        />

      </main>
    </div>
  );
}