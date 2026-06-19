"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createUserAPI, createAdminAPI } from "../../../../api/user.api";
import { useAuth } from "../../../../context/AuthContext";
import { UserPlus, Phone, Lock, Shield } from "lucide-react";

const CreateUser = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name.trim()) {
      toast.error("👤 Name is required");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error("📱 Enter valid 10-digit mobile number");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("🔐 Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const toastId = toast.loading("Creating account...");

    try {
      setLoading(true);

      if (form.role === "ADMIN") {
        await createAdminAPI(form);
        toast.success("✅ Admin created successfully", { id: toastId });
      } else {
        await createUserAPI(form);
        toast.success("✅ User created successfully", { id: toastId });
      }

      setForm({ name: "", mobile: "", password: "", role: "USER" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Creation failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-1">
      {/* GLASS CARD */}
      <div
        className="relative w-full max-w-md p-8 rounded-3xl
        bg-white/10 backdrop-blur-2xl
        border border-white/20
        shadow-[0_25px_80px_rgba(0,0,0,0.7)]"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />

        {/* HEADER */}
        <div className="relative flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-cyan-500/20">
            <UserPlus className="text-cyan-400" size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Create {form.role === "ADMIN" ? "Admin" : "User"}
            </h2>
            <p className="text-sm text-white/60">
              {isSuperAdmin ? "Super Admin Access" : "Admin Access"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="relative space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/70 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserPlus
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white/5 border border-white/20
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/70 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                className="w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white/5 border border-white/20
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white/5 border border-white/20
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* ROLE */}
          {isSuperAdmin && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/70 mb-1">
                Role
              </label>
              <div className="relative">
                <Shield
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={18}
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl
                    bg-white/5 border border-white/20
                    text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-cyan-500/70 to-blue-500/70
              hover:from-cyan-500 hover:to-blue-500
              transition-all duration-300
              disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
