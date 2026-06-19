"use client";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Key } from "lucide-react";
import { useState } from "react";
import { changePasswordAPI } from "../../../../api/auth.api";
import toast from "react-hot-toast";

const SuperAdminSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
      setShowPasswordForm(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[#0b1224] p-1">
      <div className="w-full max-w-md flex flex-col items-center gap-28">

        {/* Profile Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col items-center gap-4 shadow-2xl transform hover:scale-[1.02] transition-all">
          <div className="relative group">
            <img
              src={user?.profilePhoto?.url || "https://ui-avatars.com/api/?name=User&background=0f172a&color=fff"}
              alt={user?.name || "User"}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-lg transition-transform transform group-hover:scale-105"
            />
            <span
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white/30 ${
                user?.isActive ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
              title={user?.isActive ? "Active" : "Inactive"}
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-white">{user?.name}</p>
            <p className="text-sm text-white/60">Mobile: {user?.mobile}</p>
            <p className="text-sm text-cyan-300 font-medium">Role: {user?.role}</p>
            <p className={`text-sm font-semibold ${user?.isActive ? "text-green-400" : "text-red-400"}`}>
              {user?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-400/90 hover:bg-cyan-500/90 text-black font-semibold rounded-2xl transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Key size={20} />
            {showPasswordForm ? "Hide Change Password" : "Change Password"}
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Password Form */}
        {showPasswordForm && (
          <form
            className="w-full flex flex-col gap-3 mt-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-inner"
            onSubmit={handleChangePassword}
          >
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-400/90 hover:bg-cyan-500/90 text-black font-semibold rounded-2xl shadow-md transition transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Logout Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-80 p-6 flex flex-col items-center gap-6 shadow-2xl animate-fadeIn">
              <div className="text-red-500 text-6xl font-bold animate-pulse">!</div>
              <p className="text-white/90 font-semibold text-lg text-center">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-4 w-full mt-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-[1.02]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 border border-white/40 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl font-semibold transform hover:scale-[1.02]"
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


export default SuperAdminSettings;
