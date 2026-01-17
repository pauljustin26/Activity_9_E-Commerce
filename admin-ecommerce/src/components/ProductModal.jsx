import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Upload } from "lucide-react";

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }) {
  // 1. State for text inputs
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "" });
  // 2. State for the existing image URL (from DB)
  const [existingImageUrl, setExistingImageUrl] = useState("");
  // 3. State for the NEW file selected by user
  const [selectedFile, setSelectedFile] = useState(null);
  // 4. State for the preview URL of the new file
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [imageError, setImageError] = useState(false);

  // Reset states when opening modal or changing initialData
  useEffect(() => {
    if (initialData) {
        setForm({
            name: initialData.name,
            price: initialData.price,
            stock: initialData.stock,
            description: initialData.description || ""
        });
        setExistingImageUrl(initialData.imageUrl || "");
    } else {
        setForm({ name: "", price: "", stock: "", description: "" });
        setExistingImageUrl("");
    }
    // Always clear new selections on open
    setSelectedFile(null);
    setPreviewUrl("");
    setImageError(false);
  }, [initialData, isOpen]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary local URL for immediate preview
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Create FormData object
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("description", form.description);

    // 2. Only append the 'image' field if a NEW file was selected
    if (selectedFile) {
        formData.append("image", selectedFile); 
    }

    // 3. Send FormData up to App.jsx
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Determine what image to show in preview area
  // Priority: New Preview > Existing URL > Placeholder
  const activeImageDisplay = previewUrl || existingImageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg border border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 max-h-[90vh] overflow-y-auto">
        
        <div className="px-8 py-6 border-b border-[#e0e0e0] flex justify-between items-center bg-black text-white sticky top-0 z-10">
          <h3 className="font-bold text-lg uppercase tracking-widest">
            {initialData ? "Edit Product" : "New Product"}
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
             {/* Left Column: Text Inputs */}
             <div className="col-span-2 md:col-span-1 space-y-4">
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

             {/* Right Column: Image Upload Preview */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Image</label>
                
                {/* Preview Box */}
                <div className="w-full h-40 bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center overflow-hidden relative mb-3">
                    {activeImageDisplay && !imageError ? (
                        <img 
                            src={activeImageDisplay} 
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
                
                {/* File Input Button styling */}
                <label className="cursor-pointer flex items-center justify-center gap-2 w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors rounded-none">
                    <Upload size={16} /> 
                    {selectedFile ? "Change File" : "Upload Image"}
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                </label>
                {selectedFile && <p className="text-[10px] mt-1 text-gray-500 truncate">{selectedFile.name}</p>}
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Description</label>
            <textarea className="w-full border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none h-20 resize-none" 
                placeholder="Details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <button className="w-full bg-[#E60033] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#cc002d] transition-colors rounded-none">
            {initialData ? "Save Changes" : "Add to Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
}