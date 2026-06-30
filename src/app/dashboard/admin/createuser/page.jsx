"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createUserAPI, createAdminAPI } from "../../../../api/user.api";
import { useAuth } from "../../../../context/AuthContext";
import { X } from "lucide-react";

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
      toast.error("Name is required");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error("Enter valid 10-digit mobile number");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
        toast.success("Admin created successfully", { id: toastId });
      } else {
        await createUserAPI(form);
        toast.success("User created successfully", { id: toastId });
      }

      setForm({ name: "", mobile: "", password: "", role: "USER" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Creation failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
      {/* Light UI Card mimicking the image */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1e3a8a]">
            Create {form.role === "ADMIN" ? "Admin" : "User"}
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* FORM / SCROLLABLE CONTENT */}
        <div className="p-6 max-h-none md:max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
          <form id="createUserForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* GRID ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a8a] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* MOBILE */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a8a] mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* GRID ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-[#1e3a8a] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* ROLE */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-bold text-[#1e3a8a] mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}
            </div>
            
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setForm({ name: "", mobile: "", password: "", role: "USER" })}
            className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createUserForm"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] transition shadow-sm disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
