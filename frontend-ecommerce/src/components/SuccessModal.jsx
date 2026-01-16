import { Check } from "lucide-react";

export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal: Sharp Box */}
      <div className="bg-white p-12 w-full max-w-sm text-center border border-black shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Icon: Simple Circle Border */}
        <div className="mx-auto w-16 h-16 border-2 border-[#E60033] rounded-full flex items-center justify-center mb-6 text-[#E60033]">
          <Check size={32} strokeWidth={3} />
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tighter leading-none">Order Confirmed</h2>
        <p className="text-[#767676] mb-8 text-sm leading-relaxed">
            Your order has been received. <br/> We are preparing it for shipment.
        </p>
        
        <button 
          onClick={onClose}
          className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#E60033] transition-colors rounded-none"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}