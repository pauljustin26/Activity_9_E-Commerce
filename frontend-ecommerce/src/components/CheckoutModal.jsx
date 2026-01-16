import { useState } from "react";
import { CreditCard, MapPin, X, ArrowLeft } from "lucide-react";

export default function CheckoutModal({ isOpen, onClose, cart, total, onConfirm }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onConfirm(); 
    }, 2000); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal: Sharp Box */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl border border-black animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e0e0e0] flex justify-between items-center bg-[#f5f5f5]">
            <h2 className="font-bold text-xl uppercase tracking-widest text-black">Checkout</h2>
            <button onClick={onClose} className="text-[#999] hover:text-[#E60033] hover:rotate-90 transition-all duration-300"><X size={24} /></button>
        </div>

        <div className="p-8">
            {/* Step Indicator: Sharp Bars */}
            <div className="flex gap-1 mb-10">
                <div className={`h-1 flex-1 transition-all duration-300 ${step >= 1 ? 'bg-[#E60033]' : 'bg-[#e0e0e0]'}`} />
                <div className={`h-1 flex-1 transition-all duration-300 ${step >= 2 ? 'bg-[#E60033]' : 'bg-[#e0e0e0]'}`} />
            </div>

            {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <h3 className="font-bold text-black flex items-center gap-3 text-sm uppercase tracking-wide border-b border-black pb-2">
                        <MapPin size={18} className="text-[#E60033]"/> Shipping Address
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none col-span-2 placeholder:text-[#ccc]" placeholder="FULL NAME" />
                        <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none col-span-2 placeholder:text-[#ccc]" placeholder="STREET ADDRESS" />
                        <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none placeholder:text-[#ccc]" placeholder="CITY" />
                        <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none placeholder:text-[#ccc]" placeholder="ZIP CODE" />
                    </div>
                    <button onClick={() => setStep(2)} className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#E60033] transition-colors mt-6 rounded-none">
                        Continue to Payment
                    </button>
                </div>
            ) : (
                <form onSubmit={handlePay} className="space-y-6 animate-in slide-in-from-right duration-300">
                    <h3 className="font-bold text-black flex items-center gap-3 text-sm uppercase tracking-wide border-b border-black pb-2">
                        <CreditCard size={18} className="text-[#E60033]"/> Payment Method
                    </h3>
                    
                    <div className="bg-[#f5f5f5] p-6 border border-[#e0e0e0]">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wide text-[#767676]">Total Amount</span>
                            <span className="font-bold text-xl text-[#E60033]">${total.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] uppercase text-[#999] tracking-wider">Sandbox Mode: No Charge</p>
                    </div>

                    <div className="space-y-4">
                        <input className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none placeholder:text-[#ccc]" placeholder="CARD NUMBER" maxLength={19} required />
                        <div className="grid grid-cols-2 gap-4">
                            <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none placeholder:text-[#ccc]" placeholder="MM / YY" required />
                            <input className="border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none placeholder:text-[#ccc]" placeholder="CVC" maxLength={3} required />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-[#E60033] text-white py-4 font-bold uppercase tracking-widest text-xs mt-6 flex justify-center items-center hover:bg-[#cc002d] transition-colors disabled:opacity-50 disabled:cursor-wait rounded-none">
                        {loading ? "PROCESSING..." : `PAY $${total.toFixed(2)}`}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="w-full text-[#767676] text-xs font-bold uppercase tracking-wide hover:text-black transition-colors flex items-center justify-center gap-2 mt-2">
                        <ArrowLeft size={14} /> Back to Shipping
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}