import { useState } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"; // Import Eye icons

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Use the same API URL as the backend
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      // SECURITY CHECK: Only allow 'admin' role
      if (data.user.role !== "admin") {
        setError("Access Denied: You are not an administrator.");
        return;
      }

      // Success
      localStorage.setItem("admin_token", data.access_token);
      onLogin(); // Tell App.jsx we are logged in
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] font-sans">
      <div className="bg-white w-full max-w-md border border-[#e0e0e0] shadow-xl p-12">
        
        {/* Logo Area */}
        <div className="flex justify-center mb-8">
            <div className="bg-[#E60033] text-white w-12 h-12 flex flex-col items-center justify-center font-bold text-[10px] leading-none tracking-tighter">
                <span>LO</span>
                <span>TUS</span>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-[#1a1a1a] uppercase tracking-widest mb-2">Admin Panel</h2>
        <p className="text-center text-[#999] text-xs uppercase tracking-wide mb-10">Restricted Access</p>

        {error && (
            <div className="bg-[#E60033]/10 text-[#E60033] text-xs font-bold uppercase p-4 border-l-4 border-[#E60033] mb-6">
               {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#767676]">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#ccc]" size={16} />
                <input 
                    type="email" 
                    className="w-full border border-[#ccc] pl-10 p-3 text-sm focus:outline-none focus:border-black rounded-none transition-colors"
                    placeholder="admin@lotus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#767676]">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#ccc]" size={16} />
                <input 
                    type={showPassword ? "text" : "password"} // Dynamic type
                    className="w-full border border-[#ccc] pl-10 pr-10 p-3 text-sm focus:outline-none focus:border-black rounded-none transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#ccc] hover:text-black transition-colors"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
          </div>

          <button className="w-full bg-[#1a1a1a] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#E60033] transition-colors flex items-center justify-center gap-2 rounded-none">
            Enter System <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}