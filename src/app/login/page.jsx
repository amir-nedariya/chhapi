"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock, Heart, Users, Leaf, HeartHandshake } from "lucide-react";
import { loginAPI, meAPI } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import FullScreenLoader from "../../components/common/FullScreenLoader";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // LOGIN API
      const loginRes = await loginAPI(form);
      localStorage.setItem("token", loginRes.data.token);

      // FETCH LOGGED IN USER
      const meRes = await meAPI();
      const user = meRes.data.data;
      setUser(user);

      toast.success("Login successful!");

      // ROLE BASED REDIRECT
      if (user.role === "USER") {
        navigate("/dashboard/user", { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/super-admin", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FULL SCREEN LOADER
  if (loading) {
    return <FullScreenLoader text="Logging you in..." />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f0fdfa] overflow-hidden px-4">
      {/* --- BACKGROUND DECORATIONS --- */}

      {/* Top Left Watercolor Blob */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl mix-blend-multiply"></div>

      {/* Top Left Logo */}
      <div className="absolute top-10 left-10 md:top-14 md:left-14 z-20 hidden md:block">
        <img
          src="/logo.png"
          alt="Chhapi Donation Logo"
          className="w-40 md:w-52 h-auto mix-blend-multiply opacity-50"
          onError={(e) => { e.target.src = '/applogo.png'; }} // Fallback
        />
      </div>

      {/* Top Right Dotted/Leaf Patterns */}
      <div className="absolute top-10 right-10 opacity-20">
        <Leaf size={40} className="text-teal-600 rotate-45 mb-4" />
        <Heart size={20} className="text-teal-500 ml-8" />
      </div>

      {/* Bottom Wavy Shape & Hands */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[150px] sm:h-[250px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,110.36,112.55,108.79,166.4,92.83,219.06,77.3,269.58,66,321.39,56.44Z"
            className="fill-[var(--primary)] opacity-90"
          ></path>
          <path
            d="M0,50 C200,100 300,10 500,50 C700,90 800,20 1200,50 L1200,120 L0,120 Z"
            className="fill-[var(--primary)] opacity-60"
          ></path>
          <path
            d="M0,80 C150,110 300,30 500,60 C700,90 900,40 1200,80 L1200,120 L0,120 Z"
            className="fill-[var(--primary)] opacity-30"
          ></path>
        </svg>

        {/* Silhouettes / Donation Theme in Bottom Left */}
        <div className="absolute bottom-12 left-12 flex items-end gap-2 opacity-20 hidden md:flex">
          <Users size={80} className="text-[var(--primary-hover)]" />
          <HeartHandshake size={120} className="text-[var(--primary)] mb-8 -ml-8" />
        </div>
      </div>

      {/* --- LOGIN FORM --- */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg shadow-2xl p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="Chhapi Donation Logo" 
              className="w-16 h-auto drop-shadow-sm"
              onError={(e) => { e.target.src = '/applogo.png'; }}
            />
          </div>
          <h2 className="text-[26px] font-extrabold text-slate-800 tracking-tight">
            Welcome to Chhapi
          </h2>
          <p className="text-[14px] text-slate-500 font-medium px-4">
            Sign in to continue making a difference and saving lives.
          </p>
        </div>

        {/* MOBILE */}
        <div>
          <label className="block text-[15px] font-bold text-[#1C2434] mb-2 text-left">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobile"
            placeholder="10 digit mobile number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-white"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-[15px] font-bold text-[#1C2434] mb-2 text-left">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-white pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-[16px] py-3.5 rounded-md transition mt-4 flex items-center justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
