import { ShoppingBag, LogIn, LogOut, User as UserIcon, Search } from "lucide-react";

export default function Navbar({ cartCount, onOpenCart, user, onLogin, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0]">
      <div className="max-w-400 mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
        
        {/* LOGO: The Classic Red Box */}
        <div className="flex items-center gap-1">
            <div className="bg-[#E60033] text-white w-10 h-10 flex flex-col items-center justify-center font-bold text-[8px] leading-none tracking-tighter">
                <span>LO</span>
                <span>TUS</span>
            </div>
            <span className="font-bold text-xl tracking-tighter ml-2 hidden md:block">LOTUS</span>
        </div>

        {/* Search - Square & Simple */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input 
                className="w-full bg-[#f5f5f5] border-none px-4 py-2 text-sm placeholder:text-[#999] focus:ring-1 focus:ring-black outline-none rounded-none" 
                placeholder="Search by keyword" 
            />
            <Search size={16} className="absolute right-3 top-2.5 text-[#999]" />
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="hidden sm:block text-[#1a1a1a] uppercase">{user.name}</span>
              <button onClick={onLogout} className="text-[#1a1a1a] hover:text-[#E60033] transition-colors"><LogOut size={20} /></button>
            </div>
          ) : (
            <button onClick={onLogin} className="text-sm font-bold text-[#1a1a1a] hover:text-[#E60033] uppercase transition-colors">Log in</button>
          )}

          <button onClick={onOpenCart} className="relative group">
            <ShoppingBag className="w-6 h-6 text-[#1a1a1a] hover:text-[#E60033] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#E60033] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}