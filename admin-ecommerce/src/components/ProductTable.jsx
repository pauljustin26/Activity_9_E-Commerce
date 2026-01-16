import { Trash2, Edit } from "lucide-react";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="border border-[#e0e0e0] bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#f5f5f5] text-[#1a1a1a] text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 border-b border-[#e0e0e0]">Product Name</th>
            <th className="px-6 py-4 border-b border-[#e0e0e0]">Price</th>
            <th className="px-6 py-4 border-b border-[#e0e0e0]">Stock</th>
            <th className="px-6 py-4 border-b border-[#e0e0e0] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-[#fafafa] group transition-colors">
              <td className="px-6 py-4 border-b border-[#e0e0e0] font-bold text-[#1a1a1a]">{p.name}</td>
              <td className="px-6 py-4 border-b border-[#e0e0e0] text-[#1a1a1a]">${p.price}</td>
              <td className="px-6 py-4 border-b border-[#e0e0e0]">
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    p.stock > 10 ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 
                    p.stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-[#E60033] text-white'
                }`}>
                    {p.stock} Units
                </span>
              </td>
              <td className="px-6 py-4 border-b border-[#e0e0e0] text-right space-x-4">
                <button className="text-[#999] hover:text-[#1a1a1a] transition-colors"><Edit size={16} /></button>
                <button onClick={() => onDelete(p._id)} className="text-[#999] hover:text-[#E60033] transition-colors"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}