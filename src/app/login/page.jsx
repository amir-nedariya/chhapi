"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] bg-[#1e2330] border border-[#2a3143] rounded-[24px] shadow-2xl p-10 space-y-7"
      >
        {/* HEADER */}
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-[32px] font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-[15px] text-gray-400 font-medium">
            Login to access your dashboard
          </p>
        </div>

        {/* MOBILE */}
        <div className="relative">
          <Phone
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            name="mobile"
            placeholder="123456890"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full bg-[#242a38] text-white border border-[#333a4d] rounded-[14px] pl-12 pr-4 py-4 focus:border-[#00c6d9] focus:ring-1 focus:ring-[#00c6d9] outline-none transition text-[15px] font-medium placeholder-white"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="•••••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-[#242a38] text-white border border-[#333a4d] rounded-[14px] pl-12 pr-12 py-4 focus:border-[#00c6d9] focus:ring-1 focus:ring-[#00c6d9] outline-none transition text-[15px] font-medium placeholder-white tracking-widest"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-[#00c6d9] hover:bg-[#00b0c2] text-black font-bold text-[16px] py-4 rounded-[14px] transition mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
