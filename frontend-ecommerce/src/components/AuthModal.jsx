import { useState } from "react";
import { X, ArrowRight, Eye, EyeOff } from "lucide-react"; // Import Eye icons
import { login, register } from "../services/api";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const data = await login(formData.email, formData.password);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        await register(formData.name, formData.email, formData.password);
        setIsLogin(true);
        alert("Account created. Please login.");
        return;
      }
      onClose();
    } catch (err) {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: Simple fade */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal: Sharp edges, High contrast border */}
      <div className="relative bg-white w-full max-w-md shadow-2xl border border-black animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 border-b border-[#e0e0e0] flex justify-between items-center bg-[#f5f5f5]">
            <h2 className="text-xl font-bold uppercase tracking-widest text-black">
                {isLogin ? "Welcome Back" : "Join Lotus"}
            </h2>
            <button onClick={onClose} className="text-[#999] hover:text-[#E60033] transition-colors hover:rotate-90 duration-300">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-[#E60033]/10 text-[#E60033] text-xs font-bold uppercase p-4 border-l-4 border-[#E60033]">
               Error: {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#767676]">Full Name</label>
                <input 
                  className="w-full bg-white border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none transition-colors placeholder:text-[#ccc]"
                  placeholder="ENTER YOUR NAME" 
                  required
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#767676]">Email Address</label>
                <input 
                    type="email" 
                    className="w-full bg-white border border-[#ccc] p-3 text-sm focus:outline-none focus:border-black rounded-none transition-colors placeholder:text-[#ccc]"
                    placeholder="ENTER YOUR EMAIL" 
                    required
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#767676]">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full bg-white border border-[#ccc] p-3 pr-10 text-sm focus:outline-none focus:border-black rounded-none transition-colors placeholder:text-[#ccc]"
                        placeholder="ENTER YOUR PASSWORD" 
                        required
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
          </div>

          <button className="w-full bg-[#E60033] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#cc002d] transition-colors flex items-center justify-center gap-2 rounded-none group">
            {isLogin ? "Sign In" : "Create Account"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>

          <div className="text-center pt-4 border-t border-[#e0e0e0]">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold uppercase tracking-wider text-[#767676] hover:text-black transition-colors">
              {isLogin ? "New Customer? " : "Already have an account? "}
              <span className="text-black underline decoration-1 underline-offset-4">
                {isLogin ? "Register here" : "Log in"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}