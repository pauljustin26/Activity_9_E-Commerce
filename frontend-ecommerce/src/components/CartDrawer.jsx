import { X, Trash2, Minus, Plus } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, updateQuantity, checkout }) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-100 h-full shadow-none border-l border-[#e0e0e0] flex flex-col p-8 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
          <h2 className="text-xl font-bold uppercase tracking-tight">Shopping Cart</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300"><X size={24} /></button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {cart.length === 0 ? <p className="text-[#999] text-sm text-center mt-10">Your shopping cart is empty.</p> : null}
          
          {cart.map((item) => (
            <div key={item._id} className="flex gap-4 border-b border-[#e0e0e0] pb-6">
              {/* Optional: Add Product Image if available in item object */}
              <div className="w-24 h-24 bg-[#f5f5f5] shrink-0 flex items-center justify-center relative">
                 {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-[#1a1a1a] uppercase">{item.name}</h4>
                        <button onClick={() => removeFromCart(item._id)} className="text-[#999] hover:text-[#E60033] transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <div className="text-xs text-[#767676] mt-1 uppercase">ID: {item._id.slice(-6)}</div>
                </div>

                <div className="flex justify-between items-end mt-4">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex border border-[#e0e0e0]">
                        <button 
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                            <Minus size={12} />
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center text-sm font-bold border-l border-r border-[#e0e0e0]">
                            {item.quantity}
                        </div>
                        <button 
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className="font-bold text-[#1a1a1a] text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-black pt-6">
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>SUBTOTAL</span>
            <span className="text-[#E60033]">${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full bg-[#E60033] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#cc002d] disabled:bg-[#ccc] transition-colors rounded-none"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}