import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createUserAPI, createAdminAPI } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import { fireConfetti } from "../../utils/confetti";
import Modal from "./Modal";

const CreateUserModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [form, setForm] = useState({
    name: initialData?.name || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || "",
        mobile: initialData?.mobile || "",
        email: initialData?.email || "",
        password: "",
        role: "USER",
      });
    }
  }, [isOpen, initialData]);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

      // Remove from Leads list if present
      try {
        const savedLeads = JSON.parse(localStorage.getItem("chhapi_leads") || "[]");
        const updatedLeads = savedLeads.filter(l => 
          l.mobile !== form.mobile && 
          l.name.toLowerCase().trim() !== form.name.toLowerCase().trim()
        );
        localStorage.setItem("chhapi_leads", JSON.stringify(updatedLeads));
        window.dispatchEvent(new Event("chhapi_leads_updated"));
      } catch (e) {
        console.error("Error updating leads after user creation:", e);
      }

      setForm({ name: "", mobile: "", email: "", password: "", role: "USER" });
      fireConfetti();
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Creation failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <Modal.Header onClose={onClose}>
        Create {form.role === "ADMIN" ? "Admin" : "User"}
      </Modal.Header>

      <Modal.Body>
        <form id="createUserModalForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div>
              <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
              />
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. user@example.com"
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
              />
            </div>

            {/* ROLE */}
            {isSuperAdmin && (
              <div>
                <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 focus:outline-none focus:border-gray-300 transition-all bg-white cursor-pointer"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            )}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-[15px] font-medium text-slate-500 hover:text-slate-700 transition-colors bg-transparent border-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="createUserModalForm"
          disabled={loading}
          className="px-6 py-2.5 text-[15px] font-medium text-white bg-[#1C2434] hover:bg-[#1C2434]/90 rounded-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : "Save User"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUserModal;
