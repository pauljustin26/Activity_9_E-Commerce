import { useState } from "react"; // Import useState
import { Plus } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  const [imageError, setImageError] = useState(false); // New State
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <div className="group flex flex-col h-full cursor-pointer">
      
      {/* Image Area */}
      <div className="aspect-square bg-[#f5f5f5] relative overflow-hidden mb-3">
        {/* LOGIC: Show Image only if URL exists AND it hasn't failed yet */}
        {product.imageUrl && !imageError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            onError={() => setImageError(true)} // If it fails, switch to fallback
          />
        ) : (
          // Fallback: Clean Gray Box (Uniqlo Style)
          <div className="w-full h-full flex flex-col items-center justify-center text-[#ccc] bg-[#f0f0f0]">
            <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-1 p-2">
            {isLowStock && <span className="bg-[#E60033] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Limited</span>}
        </div>

        {/* Quick Add Overlay */}
        <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            disabled={product.stock <= 0}
            className="absolute bottom-0 right-0 bg-white text-black p-3 hover:bg-black hover:text-white transition-colors border-t border-l border-[#e0e0e0]"
        >
            <Plus size={20} />
        </button>
      </div>

      {/* Info Area */}
      <div className="flex flex-col flex-1 gap-1">
        <h3 className="font-medium text-[#1a1a1a] text-sm group-hover:underline decoration-1 underline-offset-2">{product.name}</h3>
        
        <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold text-lg text-[#E60033]">₱{product.price.toFixed(2)}</span>
            <span className="text-xs text-[#999] line-through">₱{(product.price * 1.2).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}