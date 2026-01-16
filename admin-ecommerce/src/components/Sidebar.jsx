import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export default function Sidebar({ currentView, setView }) {
  const menuItems = [
    { id: "products", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e0e0e0] min-h-screen flex flex-col">
      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-[#e0e0e0]">
        <div className="bg-[#E60033] text-white w-8 h-8 flex flex-col items-center justify-center font-bold text-[8px] leading-none tracking-tighter">
            <span>LO</span>
            <span>TUS</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-[#1a1a1a] uppercase">Admin</span>
      </div>
      
      {/* Menu */}
      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-l-4 ${
              currentView === item.id 
                ? "border-[#E60033] text-[#E60033] bg-[#fafafa]" 
                : "border-transparent text-[#999] hover:text-[#1a1a1a] hover:bg-[#fafafa]"
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-[#e0e0e0]">
        <div className="text-[10px] text-[#999] uppercase font-medium">
            System v1.0<br/>Lotus Corp
        </div>
      </div>
    </aside>
  );
}