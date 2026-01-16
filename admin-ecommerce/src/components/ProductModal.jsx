import { useState, useEffect } from "react"; // Import useEffect
import { X, Image as ImageIcon } from "lucide-react";

export default function ProductModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "", imageUrl: "" });
  const [imageError, setImageError] = useState(false); // Error state

  // Reset error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [form.imageUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm({ name: "", price: "", stock: "", description: "", imageUrl: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg border border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4">
        
        <div className="px-8 py-6 border-b border-[#e0e0e0] flex justify-between items-center bg-black text-white">
          <h3 className="font-bold text-lg uppercase tracking-widest">New Product</h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
             <div className="col-span-2 md:col-span-1 space-y-4">
                {/* ... Inputs for Name, Price, Stock ... */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Name</label>
                    <input className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none" 
                        placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Price</label>
                        <input type="number" className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none" 
                            placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Stock</label>
                        <input type="number" className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none" 
                            placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
                    </div>
                </div>
             </div>

             {/* Right Column: Image Preview with Error Handling */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Image Preview</label>
                <div className="w-full h-40 bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center overflow-hidden relative">
                    {form.imageUrl && !imageError ? (
                        <img 
                            src={form.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="text-center text-[#ccc]">
                            <ImageIcon size={24} className="mx-auto mb-1 opacity-50"/>
                            <span className="text-[10px] uppercase">No Image</span>
                        </div>
                    )}
                </div>
                <input className="w-full border border-t-0 border-[#ccc] p-2 text-xs focus:outline-none focus:border-black rounded-none" 
                    placeholder="Paste Image URL here..." value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Description</label>
            <textarea className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none h-20 resize-none" 
                placeholder="Details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <button className="w-full bg-[#E60033] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#cc002d] transition-colors rounded-none">
            Add to Inventory
          </button>
        </form>
      </div>
    </div>
  );
}