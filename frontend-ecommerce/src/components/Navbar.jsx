import { ShoppingBag, LogIn, LogOut, Package, Search, User as UserIcon } from "lucide-react";

export default function Navbar({ cartCount, onOpenCart, user, onLogin, onLogout, onSearch, onOpenOrders }) {
  
  // Helper for consistent Tooltips
  const Tooltip = ({ text }) => (
    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] uppercase font-bold px-2 py-1 whitespace-nowrap pointer-events-none z-50">
      {text}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-400 mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-[#E60033] text-white w-10 h-10 flex flex-col items-center justify-center font-bold text-[8px] leading-none tracking-tighter">
                <span>LO</span>
                <span>TUS</span>
            </div>
            <span className="font-bold text-xl tracking-tighter ml-2 hidden md:block">Lotus Tech</span>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input 
                className="w-full bg-[#f5f5f5] border-none px-4 py-2 text-sm placeholder:text-[#999] focus:ring-1 focus:ring-black outline-none rounded-none transition-all" 
                placeholder="Search products..." 
                onChange={(e) => onSearch(e.target.value)}
            />
            <Search size={16} className="absolute right-3 top-2.5 text-[#999]" />
        </div>
        
        {/* ICONS AREA */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* User Name Display */}
              <span className="hidden sm:block text-xs font-bold text-[#1a1a1a] uppercase mr-2">
                Hi, {user.name.split(' ')[0]}
              </span>

              {/* My Orders Button */}
              <button onClick={onOpenOrders} className="relative group p-2 text-[#1a1a1a] hover:text-[#E60033] transition-colors">
                <Package size={20} />
                <Tooltip text="My Orders" />
              </button>

              {/* Logout Button */}
              <button onClick={onLogout} className="relative group p-2 text-[#1a1a1a] hover:text-[#E60033] transition-colors">
                <LogOut size={20} />
                <Tooltip text="Logout" />
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="text-sm font-bold text-[#1a1a1a] hover:text-[#E60033] uppercase transition-colors px-2">
                Log in
            </button>
          )}

          {/* DIVIDER */}
          <div className="h-6 w-px bg-[#e0e0e0] mx-1 md:mx-2" />

          {/* Cart Button */}
          <button onClick={onOpenCart} className="relative group p-2 text-[#1a1a1a] hover:text-[#E60033] transition-colors">
            <ShoppingBag className="w-6 h-6" />
            <Tooltip text="View Cart" />
            
            {/* Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#E60033] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full pointer-events-none">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
}