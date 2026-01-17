import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function Sidebar({ currentView, setView, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "products", label: "Inventory", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <aside 
        className={`${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-[#e0e0e0] min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Header: Logo & Toggle */}
      <div className={`h-20 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-6"} border-b border-[#e0e0e0]`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-[#E60033] text-white w-8 h-8 shrink-0 flex flex-col items-center justify-center font-bold text-[8px] leading-none tracking-tighter">
                <span>LO</span>
                <span>TUS</span>
            </div>
            {!isCollapsed && <span className="font-bold text-lg tracking-tight text-[#1a1a1a] uppercase whitespace-nowrap animate-in fade-in duration-300">Admin</span>}
        </div>

        {/* Toggle Button */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#999] hover:text-[#1a1a1a] transition-colors p-1"
        >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Menu */}
      <nav className="flex-1 py-6 space-y-1 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            title={isCollapsed ? item.label : ""}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "gap-4 px-6"} py-4 text-sm font-bold uppercase tracking-wider transition-colors border-l-4 group ${
              currentView === item.id 
                ? "border-[#E60033] text-[#E60033] bg-[#fafafa]" 
                : "border-transparent text-[#999] hover:text-[#1a1a1a] hover:bg-[#fafafa]"
            }`}
          >
            <item.icon size={20} className="shrink-0" /> 
            
            {/* Label (Hidden when collapsed) */}
            {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in duration-200">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer: Logout & Info */}
      <div className="border-t border-[#e0e0e0]">
        
        {/* Logout Button */}
        <button 
            onClick={onLogout}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-4 px-6"} py-5 text-sm font-bold uppercase tracking-wider text-[#999] hover:text-[#E60033] hover:bg-red-50 transition-colors group`}
            title="Logout"
        >
            <LogOut size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="animate-in fade-in">Logout</span>}
        </button>
      </div>
    </aside>
  );
}