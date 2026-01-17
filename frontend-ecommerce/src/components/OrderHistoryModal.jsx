import { X, Package, Calendar } from "lucide-react";

export default function OrderHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl h-[80vh] shadow-2xl border border-black flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#e0e0e0] flex justify-between items-center bg-[#f5f5f5]">
            <h2 className="text-xl font-bold uppercase tracking-widest text-black flex items-center gap-3">
                <Package size={20} /> My Orders
            </h2>
            <button onClick={onClose} className="text-[#999] hover:text-[#E60033] hover:rotate-90 transition-all duration-300">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#999]">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="uppercase tracking-widest text-xs">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-[#e0e0e0]">
                            {/* Order Header */}
                            <div className="bg-[#fafafa] p-4 flex justify-between items-center text-xs border-b border-[#e0e0e0]">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="block text-[#999] uppercase font-bold mb-1">Order Placed</span>
                                        <span className="font-bold text-[#1a1a1a] flex items-center gap-1">
                                            <Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[#999] uppercase font-bold mb-1">Order ID</span>
                                        <span className="font-mono text-[#1a1a1a]">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[#999] uppercase font-bold mb-1 text-right">Total</span>
                                    <span className="font-bold text-[#E60033] text-lg">${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-[#1a1a1a]" /> {/* Bullet point */}
                                            <span className="font-medium text-[#1a1a1a]">{item.productName}</span>
                                            <span className="text-[#999] text-xs">x{item.quantity}</span>
                                        </div>
                                        <span className="font-mono">${item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}