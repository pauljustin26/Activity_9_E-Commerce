import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProductTable from "./components/ProductTable";
import OrderTable from "./components/OrderTable";
import StatsCard from "./components/StatsCard";
import ProductModal from "./components/ProductModal";
import { getProducts, createProduct, deleteProduct, getOrders } from "./services/api"; 
import { Plus, Package, DollarSign, Layers } from "lucide-react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("products");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    // Parallel loading
    const [p, o] = await Promise.all([getProducts(), getOrders()]);
    setProducts(p || []);
    setOrders(o || []);
  };

  const handleCreate = async (productData) => {
    await createProduct(productData);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
        await deleteProduct(id);
        loadData();
    }
  };

  // Stats
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans text-[#1a1a1a]">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-[#e0e0e0] pb-6">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-tight leading-none mb-1">
                  {view === "products" ? "Inventory" : "Orders"}
                </h1>
                <p className="text-xs text-[#999] uppercase tracking-widest font-bold">
                  {view === "products" ? "Manage Catalog" : "Track Sales"}
                </p>
            </div>
            
            {view === "products" && (
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#E60033] transition-colors flex items-center gap-2 rounded-none"
              >
                  <Plus size={16} /> New Item
              </button>
            )}
        </header>

        {view === "products" ? (
          <div className="animate-in fade-in duration-500">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard title="Total SKU" value={products.length} icon={Package} />
                <StatsCard title="Stock Count" value={totalStock} icon={Layers} />
                <StatsCard title="Valuation" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} />
            </div>
            {/* Table */}
            <ProductTable products={products} onDelete={handleDelete} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             <OrderTable orders={orders} />
          </div>
        )}

        <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreate} />
      </main>
    </div>
  );
}