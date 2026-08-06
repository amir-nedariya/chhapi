"use client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Key, X, ShieldCheck, User as UserIcon, Palette, Mail, Phone, CalendarDays, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { changePasswordAPI, updateProfileAPI } from "../../api/auth.api";
import toast from "react-hot-toast";
import { useSidebarColor } from "../../hooks/useSidebarColor";

const SettingsContent = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setProfileLoading(true);
      const res = await updateProfileAPI(profileData);
      setUser(res.data.data);
      toast.success("Profile updated successfully!");
      setShowEditProfileModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
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
      setShowChangePasswordModal(false);
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

  const dynamicColor = `#${sidebarColor}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 flex justify-center items-start font-sans text-slate-800">
      <div className="w-full max-w-3xl space-y-8 mt-2 transition-all duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h2>
            <p className="text-slate-500 font-medium text-sm mt-1.5">Manage your profile details and security settings</p>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="w-full bg-white border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
              
              {/* LEFT COL - AVATAR */}
              <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
                <div className="relative group p-1.5 bg-white rounded-full shadow-lg border border-slate-100">
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 opacity-50 blur-xl group-hover:opacity-80 transition-opacity duration-500"
                  />
                  <img
                    src={user?.profilePhoto?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=${sidebarColor}&color=fff`}
                    alt={user?.name || "User"}
                    className="relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-inner transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-1 right-3 p-1.5 bg-white rounded-full shadow-md border border-slate-100">
                    <ShieldCheck size={22} className="text-emerald-500" />
                  </div>
                </div>

                <div className="text-center w-full">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <span 
                      style={{ color: dynamicColor, backgroundColor: `${dynamicColor}15` }}
                      className="text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest"
                    >
                      {user?.role?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COL - INFO & ACTIONS */}
              <div className="w-full md:w-2/3 flex flex-col gap-8">
                
                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Phone size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Mobile Number</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-base sm:text-lg">{user?.mobile}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Mail size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Email Address</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-base truncate">{user?.email || "Not set"}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 sm:col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Status</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-emerald-600 font-bold text-sm uppercase tracking-wide">Active Account</p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-teal-600/10 cursor-pointer text-sm"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-slate-900/10 cursor-pointer text-sm"
                  >
                    <Key size={18} />
                    Update Password
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-600 font-bold rounded-xl transition-all duration-200 border border-rose-100 cursor-pointer text-sm"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>

              </div>
            </div>
          </div>

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 flex flex-col gap-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowChangePasswordModal(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-1.5 pr-8">
                <h3 className="text-2xl font-black text-slate-900">Security</h3>
                <p className="text-slate-500 text-sm font-medium">Update your password to keep your account secure.</p>
              </div>

              <form className="w-full flex flex-col gap-5" onSubmit={handleChangePassword}>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Enter current password"
                    value={passwordData.oldPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Minimum 6 characters"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full mt-2 py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  <ShieldCheck size={18} />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 flex flex-col items-center gap-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                <LogOut size={28} strokeWidth={2.5} />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900">Sign Out</h3>
                <p className="text-slate-500 text-sm font-medium px-4">
                  Are you sure you want to log out of your account? You will need to login again.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all active:scale-95"
                >
                  Yes, Log out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 flex flex-col gap-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-1.5 pr-8">
                <h3 className="text-2xl font-black text-slate-900">Edit Profile</h3>
                <p className="text-slate-500 text-sm font-medium">Update your account name and email address.</p>
              </div>

              <form className="w-full flex flex-col gap-5" onSubmit={handleUpdateProfile}>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="e.g. user@example.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-semibold text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center justify-center gap-2 w-full mt-2 py-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-teal-600/10 text-sm"
                >
                  <Edit3 size={18} />
                  {profileLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsContent;
