"use client";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Key } from "lucide-react";
import { useState } from "react";
import { changePasswordAPI } from "../../../../api/auth.api";
import toast from "react-hot-toast";
import { useSidebarColor } from "../../../../hooks/useSidebarColor";

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    try {
      setLoading(true);
      const res = await changePasswordAPI(passwordData);
      toast.success(res.data.message || "Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 flex justify-center items-start font-sans text-slate-800">
      <div className="w-full max-w-4xl space-y-8 mt-4">
        
        {/* HEADER */}
        <div className="px-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Manage your profile details and security settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Profile Details Card */}
          <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="relative group">
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--sidebar-from)] to-[var(--sidebar-via)] opacity-20 blur-md group-hover:opacity-40 transition-opacity"
              />
              <img
                src={user?.profilePhoto?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=${sidebarColor}&color=fff`}
                alt={user?.name || "User"}
                style={{ borderColor: `#${sidebarColor}` }}
                className="relative w-32 h-32 rounded-full object-cover border-4 shadow-md transition-transform transform group-hover:scale-105"
              />
              <span
                className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                  user?.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
                title={user?.isActive ? "Active" : "Inactive"}
              />
            </div>
            
            <div className="text-center space-y-3 w-full">
              <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{user?.name}</p>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-slate-400 font-bold tracking-wide uppercase">Mobile: {user?.mobile}</p>
                <div className="flex justify-center gap-2 mt-1">
                  <span 
                    style={{
                      color: `#${sidebarColor}`,
                      borderColor: `#${sidebarColor}30`,
                      backgroundColor: `#${sidebarColor}10`
                    }}
                    className="text-xs font-bold border px-3.5 py-1 rounded-full uppercase tracking-wider"
                  >
                    Role: {user?.role}
                  </span>
                  <span className={`text-xs font-bold px-3.5 py-1 rounded-full border uppercase tracking-wider ${
                    user?.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-2 w-full mt-4 py-4 bg-rose-50 hover:bg-rose-100/80 active:scale-[0.98] text-rose-600 border border-rose-100/60 font-bold rounded-2xl transition duration-200 shadow-xs cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Change Password Form */}
          <form
            className="w-full flex flex-col gap-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xs"
            onSubmit={handleChangePassword}
          >
            <h3 className="text-xl font-bold text-slate-850 border-b border-slate-100 pb-3">Change Password</h3>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Old Password <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter old password"
                value={passwordData.oldPassword}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-semibold text-sm shadow-xs"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                New Password <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Minimum 6 characters"
                value={passwordData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-semibold text-sm shadow-xs"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Confirm New Password <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-semibold text-sm shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full mt-3 py-4 bg-gradient-to-r from-[var(--sidebar-from)] to-[var(--sidebar-via)] hover:brightness-105 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md shadow-slate-900/5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Key size={18} />
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl w-80 p-6 flex flex-col items-center gap-6 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 text-2xl font-black">
                !
              </div>
              <p className="text-slate-800 font-bold text-base text-center">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3 w-full mt-1">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;