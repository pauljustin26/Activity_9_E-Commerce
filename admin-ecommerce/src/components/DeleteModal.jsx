import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    // Backdrop with blur
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal: White box with Red Shadow for danger context */}
      <div className="bg-white w-full max-w-sm border border-black shadow-[8px_8px_0px_0px_#E60033] animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
            
            {/* Warning Icon */}
            <div className="mx-auto w-12 h-12 bg-[#E60033]/10 text-[#E60033] flex items-center justify-center mb-4 rounded-full">
                <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-bold uppercase tracking-widest mb-2 text-[#1a1a1a]">Delete Item?</h3>
            <p className="text-xs text-[#767676] mb-8 leading-relaxed font-medium">
                This action cannot be undone.<br/>The product will be permanently removed.
            </p>

            <div className="flex gap-4">
                {/* Cancel Button */}
                <button 
                    onClick={onClose}
                    className="flex-1 bg-white border border-[#e0e0e0] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#f5f5f5] transition-colors text-[#1a1a1a]"
                >
                    Cancel
                </button>
                
                {/* Delete Button */}
                <button 
                    onClick={onConfirm}
                    className="flex-1 bg-[#E60033] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#cc002d] transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}