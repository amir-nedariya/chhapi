"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAdminAPI } from "../../../../api/user.api";
import { UserPlus, Phone, Lock, Save } from "lucide-react";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createAdminAPI(form);
      toast.success("Admin created successfully");

      setForm({
        name: "",
        mobile: "",
        password: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create admin ❌");
    } finally {
      setLoading(false);
    }
  };

  // Clean Modern Styles
  const cardShadow = {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const inputShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
  };

  const buttonShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  return (
    <div className="min-h-screen w-full bg-white p-2 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-4">
          <div 
            className="p-3.5 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm bg-white"
          >
            <UserPlus className="text-cyan-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Create Admin Account
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Register a new administrator for Chhapi</p>
          </div>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-8 space-y-6 transition-all duration-300"
          style={cardShadow}
        >
          {/* NAME */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
              Admin Name
            </label>
            <div className="relative">
              <UserPlus
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter admin name"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold text-sm"
                style={inputShadow}
              />
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold text-sm"
                style={inputShadow}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold text-sm"
                style={inputShadow}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              disabled={loading}
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
              onMouseLeave={() => setButtonPressed(false)}
              onTouchStart={() => setButtonPressed(true)}
              onTouchEnd={() => setButtonPressed(false)}
              className="w-full flex items-center justify-center gap-2 text-cyan-600 font-extrabold py-4 rounded-2xl transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              style={buttonShadow}
            >
              <Save size={20} className="text-cyan-600" />
              <span>{loading ? "Creating..." : "Create Admin"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
