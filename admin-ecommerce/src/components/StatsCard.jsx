export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border border-[#e0e0e0] p-6 flex flex-col justify-between h-32 hover:border-black transition-colors group">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#999] group-hover:text-[#E60033] transition-colors">{title}</h3>
        <Icon size={20} className="text-[#e0e0e0] group-hover:text-black transition-colors"/>
      </div>
      <p className="text-4xl font-bold text-[#1a1a1a] tracking-tight">{value}</p>
    </div>
  );
}