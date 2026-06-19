import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { loginAPI, meAPI } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import FullScreenLoader from "../components/common/FullScreenLoader";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400">
            Login to access your dashboard
          </p>
        </div>

        {/* MOBILE */}
        <div className="relative">
          <Phone
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            className="w-full bg-white/5 text-white border border-white/20 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-white/5 text-white border border-white/20 rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-xl transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
