"use client";
import { useEffect, useMemo, useState } from "react";
import {
  getAllUsersAPI,
  activateUserAPI,
  deactivateUserAPI,
  changeUserRoleAPI,
  uploadUserPhotoAPI,
  deleteUserPhotoAPI,
  getUserByIdAPI,
  createUserAPI,
  createAdminAPI,
  softDeleteUserAPI,
  hardDeleteUserAPI,
} from "../../../../api/user.api";
import { createDonationAPI } from "../../../../api/donation.api";
import { toast } from "react-hot-toast";
import {
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  X,
  Users,
  UserPlus,
  Calendar,
  User,
  TrendingUp,
  IndianRupee,
  Activity,
  CreditCard,
  BarChart3,
  PlusCircle,
} from "lucide-react";

import { useSidebarColor } from "../../../../hooks/useSidebarColor";

const ITEMS_PER_PAGE = 10;

/* ================= ROLE STYLES ================= */
const roleStyles = {
  SUPER_ADMIN:
    "bg-purple-100 text-purple-700 border border-purple-200 font-medium",
  ADMIN:
    "bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium",
  USER:
    "bg-sky-100 text-sky-700 border border-sky-200 font-medium",
};

const UsersList = () => {
  const sidebarColor = useSidebarColor();
  const getAvatarUrl = (userObj) => {
    if (userObj?.profilePhoto?.url) {
      if (userObj.profilePhoto.url.includes("ui-avatars.com")) {
        return userObj.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`);
      }
      return userObj.profilePhoto.url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj?.name || "User")}&background=${sidebarColor}&color=fff`;
  };
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("USER");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isPhotoDeleteOpen, setIsPhotoDeleteOpen] = useState(false);

  // Donation creation states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMonth, setDonationMonth] = useState(new Date().getMonth() + 1);
  const [donationYear, setDonationYear] = useState(new Date().getFullYear());
  const [donationLoading, setDonationLoading] = useState(false);

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const resetCreateForm = () => {
    setNewName("");
    setNewMobile("");
    setNewPassword("");
    setNewRole("USER");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim() || !newPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^\d{10}$/.test(newMobile.trim())) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const payload = {
        name: newName.trim(),
        mobile: newMobile.trim(),
        password: newPassword.trim(),
        role: newRole,
      };

      if (newRole === "ADMIN") {
        await createAdminAPI(payload);
      } else {
        await createUserAPI(payload);
      }

      toast.success("User created successfully!");
      setIsCreateOpen(false);
      resetCreateForm();
      fetchUsers();
    } catch {
      toast.error("Failed to create user");
    }
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await getAllUsersAPI();
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ACTIONS ================= */
  const toggleStatus = async (u) => {
    try {
      setLoadingId(u._id);
      u.isActive
        ? await deactivateUserAPI(u._id)
        : await activateUserAPI(u._id);
      fetchUsers();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await changeUserRoleAPI(id, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  const handlePhotoUpload = async (id, file) => {
    if (!file) return;
    try {
      await uploadUserPhotoAPI(id, file);
      toast.success("Profile updated");
      fetchUsers();
    } catch {
      toast.error("Upload failed");
    }
  };

  const handlePhotoDelete = () => {
    setIsPhotoDeleteOpen(true);
  };

  const handleConfirmPhotoDelete = async () => {
    try {
      await deleteUserPhotoAPI(viewUser._id);
      toast.success("Photo deleted");
      setIsPhotoDeleteOpen(false);
      setViewUser({ ...viewUser, profilePhoto: null });
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openUserModal = async (id) => {
    try {
      const res = await getUserByIdAPI(id);
      setViewUser(res.data.data);
    } catch {
      toast.error("Failed to load user");
    }
  };

  const handleCreateDonation = async () => {
    if (!donationAmount || Number(donationAmount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setDonationLoading(true);
      await createDonationAPI({
        donorId: viewUser._id,
        amount: Number(donationAmount),
        month: Number(donationMonth),
        year: Number(donationYear),
      });
      toast.success("Donation recorded successfully!");
      setDonationAmount("");
      setShowDonationModal(false);
      // Refresh user details to update checkmarks
      openUserModal(viewUser._id);
    } catch {
      toast.error("Failed to add donation");
    } finally {
      setDonationLoading(false);
    }
  };

  const handleOpenDeleteModal = (type) => {
    setDeleteType(type);
    setDeleteConfirmInput("");
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!viewUser) return;
    try {
      if (deleteType === "hard") {
        if (deleteConfirmInput !== "8120") {
          toast.error("Please enter correct confirmation code");
          return;
        }
        await hardDeleteUserAPI(viewUser._id);
        toast.success("User permanently deleted!");
      } else {
        await softDeleteUserAPI(viewUser._id);
        toast.success("User soft deleted (deactivated & hidden)!");
      }
      setIsDeleteOpen(false);
      setViewUser(null);
      fetchUsers();
    } catch {
      toast.error("Deletion failed");
    }
  };

  /* ================= FILTER ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const s =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile.includes(search);
      const r = roleFilter === "ALL" || u.role === roleFilter;
      return s && r;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (viewUser) {
    return (
      <div className="animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                <Users size={20} />
              </div>
              User Profile & Insights
            </h2>
            <p className="text-xs text-slate-500 mt-1">Detailed view of user profile and donation history</p>
          </div>
          <button
            onClick={() => setViewUser(null)}
            className="text-slate-600 hover:text-slate-800 font-medium px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <ChevronLeft size={16} /> Back to Users List
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Avatar & Profile actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <img
                  src={getAvatarUrl(viewUser)}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover ring-2 ring-slate-100/80 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-1.5 justify-center">
                {viewUser.name}
                <svg className="w-4.5 h-4.5 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.275C14.775 2.5 13.51 1.5 12 1.5c-1.51 0-2.775 1-3.422 2.285-.407-.175-.867-.275-1.348-.275-2.11 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.275.647 1.285 1.912 2.285 3.422 2.285 1.51 0 2.775-1 3.422-2.285.407 1.75.867.275 1.348.275 2.11 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.73-3.79-3.79 1.42-1.42 2.37 2.37 5.67-5.67 1.42 1.42-7.09 7.09z"/>
                </svg>
              </h4>
              <p className="text-sm text-slate-500 mb-3">{viewUser.mobile}</p>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyles[viewUser.role]}`}>
                {viewUser.role.replace("_", " ")}
              </span>

              <div className="w-full border-t border-slate-100 my-5" />

              {/* Profile Actions */}
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    setDonationMonth(new Date().getMonth() + 1);
                    setDonationYear(new Date().getFullYear());
                    setShowDonationModal(true);
                  }}
                  className="text-sm font-medium text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/70 px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <PlusCircle size={16} /> Add Donation
                </button>

                <label className="cursor-pointer text-center text-sm font-medium text-cyan-600 bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-100/70 px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95">
                  <Upload size={16} /> Upload Photo
                  <input hidden type="file" accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload(viewUser._id, e.target.files[0])
                    }
                  />
                </label>

                {viewUser.profilePhoto && (
                  <button
                    onClick={handlePhotoDelete}
                    className="text-sm font-medium text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/70 px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Trash2 size={16} /> Delete Photo
                  </button>
                )}

                {viewUser.role !== "SUPER_ADMIN" && (
                  <button
                    onClick={() => handleOpenDeleteModal("choice")}
                    className="text-sm font-medium text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100/70 px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Trash2 size={16} /> Delete User
                  </button>
                )}
              </div>
            </div>

            {/* Account Metadata Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col gap-4">
              <h5 className="font-semibold text-slate-400 text-xs tracking-wider uppercase">System Information</h5>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50/50 text-indigo-500 rounded-xl">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Created By</p>
                  <p className="text-sm font-medium text-slate-700">{viewUser.createdBy || "System"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50/50 text-sky-500 rounded-xl">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Created At</p>
                  <p className="text-sm font-medium text-slate-700">
                    {viewUser.createdAt
                      ? new Date(viewUser.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50/50 text-emerald-500 rounded-xl">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewUser.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${viewUser.isActive ? "bg-green-500" : "bg-slate-400"}`} />
                    {viewUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Change Role Section */}
              {viewUser.role !== "SUPER_ADMIN" && (
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Change User Role</label>
                  <select
                    value={viewUser.role}
                    onChange={(e) => changeRole(viewUser._id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition shadow-sm cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Donation Insights */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* KPI 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Donated</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{(viewUser.totalDonations || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-4">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Donation Count</p>
                  <p className="text-xl font-semibold text-slate-800">
                    {viewUser.donationCount || 0} times
                  </p>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Avg. Donation</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{Math.round(viewUser.avgDonation || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Yearly Stats Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
              <h5 className="font-semibold text-slate-400 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-600" />
                Yearly Distribution
              </h5>
              
              <div className="space-y-4">
                {Object.entries(viewUser.yearlyStats || { "2025": 0, "2026": 0 }).map(([year, amount]) => {
                  const total = Object.values(viewUser.yearlyStats || {}).reduce((a, b) => a + b, 0) || 1;
                  const percentage = Math.round((amount / total) * 100);
                  return (
                    <div key={year} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-600">{year}</span>
                        <span className="font-semibold text-slate-700">₹{amount.toLocaleString("en-IN")} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Stats Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex-1">
              <h5 className="font-semibold text-slate-400 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-cyan-600" />
                Monthly Insights (Recent Year)
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(() => {
                  const defaultMonths = {
                    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
                    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
                  };
                  const fullMonthlyStats = {
                    ...defaultMonths,
                    ...(viewUser.monthlyStats || {})
                  };
                  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const currentMonth = monthNames[new Date().getMonth()];
                  const currentMonthIndex = new Date().getMonth();

                  return Object.entries(fullMonthlyStats).map(([month, amount]) => {
                    const isCurrent = month === currentMonth;
                    const isPaid = amount > 0;
                    const monthIndex = monthNames.indexOf(month);
                    const isFuture = monthIndex > currentMonthIndex;

                    // Styles
                    let cardBg = "";
                    let monthColor = "";
                    let amountColor = "";
                    let borderStyle = "";
                    let badge = null;

                    if (isPaid) {
                      cardBg = "bg-emerald-50/40 hover:bg-emerald-50/70 text-emerald-800";
                      monthColor = "text-emerald-500 font-semibold";
                      amountColor = "text-emerald-700 font-semibold";
                      borderStyle = isCurrent 
                        ? "border-2 border-cyan-500 shadow-sm relative scale-[1.02] z-10" 
                        : "border border-emerald-100/70";
                      badge = (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold animate-in zoom-in duration-150">
                          ✓
                        </span>
                      );
                    } else if (isFuture) {
                      cardBg = "bg-slate-50/40 hover:bg-slate-50/70 text-slate-600";
                      monthColor = "text-slate-400 font-semibold";
                      amountColor = "text-slate-500 font-semibold";
                      borderStyle = "border border-slate-200/60";
                      badge = (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs font-bold">
                          —
                        </span>
                      );
                    } else {
                      cardBg = "bg-rose-50/40 hover:bg-rose-50/70 text-rose-800";
                      monthColor = "text-rose-400 font-semibold";
                      amountColor = "text-rose-600 font-semibold";
                      borderStyle = isCurrent 
                        ? "border-2 border-cyan-500 shadow-sm relative scale-[1.02] z-10" 
                        : "border border-rose-100/70";
                      badge = (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-500 text-xs font-bold animate-in zoom-in duration-150">
                          ✕
                        </span>
                      );
                    }

                    return (
                      <div 
                        key={month} 
                        className={`p-4 rounded-xl flex items-center justify-between transition duration-200 ${cardBg} ${borderStyle}`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-[11px] uppercase tracking-wider ${monthColor} flex items-center gap-1.5`}>
                            {month}
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-100 text-cyan-800 rounded uppercase tracking-wider animate-pulse">
                                Current
                              </span>
                            )}
                          </span>
                          <span className={`text-base ${amountColor}`}>
                            ₹{amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        
                        {/* Right side badge indicating status */}
                        <div>
                          {badge}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>



        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-200 text-left">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  {deleteType === "choice" && (
                    <span className="text-slate-800 flex items-center gap-2">
                      <Trash2 size={20} /> Delete User
                    </span>
                  )}
                  {deleteType === "hard" && (
                    <span className="text-red-600 flex items-center gap-2">
                      <Trash2 size={20} /> Permanently Delete
                    </span>
                  )}
                  {deleteType === "soft" && (
                    <span className="text-amber-600 flex items-center gap-2">
                      <Trash2 size={20} className="stroke-[2.5]" /> Soft Delete
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setDeleteConfirmInput("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4">
                {deleteType === "choice" && (
                  <>
                    <p className="text-sm text-slate-600">
                      Choose how you would like to delete user <span className="font-semibold text-slate-800">{viewUser?.name}</span>:
                    </p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setDeleteType("soft")}
                        className="flex flex-col items-start p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition text-left"
                      >
                        <span className="font-semibold text-amber-800 text-sm">
                          Soft Delete (Deactivate & Hide)
                        </span>
                        <span className="text-xs text-amber-700 mt-1">
                          Deactivates and hides the user from active search/lists. Their data remains in the database.
                        </span>
                      </button>
                      <button
                        onClick={() => setDeleteType("hard")}
                        className="flex flex-col items-start p-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition text-left"
                      >
                        <span className="font-semibold text-red-800 text-sm">
                          Hard Delete (Permanent)
                        </span>
                        <span className="text-xs text-red-700 mt-1">
                          Permanently deletes the user record and all associated donation data. Cannot be undone.
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {deleteType === "hard" && (
                  <>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm flex flex-col gap-1">
                      <span className="font-semibold text-red-800">Warning:</span>
                      <span>This action is permanent and cannot be undone.</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Are you sure you want to permanently delete user <span className="font-semibold text-slate-800">{viewUser?.name}</span>? All of their donation history and logs will be lost forever.
                    </p>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Type <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">8120</span> to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmInput}
                        onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        placeholder="Type 8120"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-slate-700 placeholder-slate-400 transition text-sm"
                      />
                    </div>
                  </>
                )}

                {deleteType === "soft" && (
                  <>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-700 text-sm flex flex-col gap-1">
                      <span className="font-semibold text-amber-800">Information:</span>
                      <span>This user will be deactivated and hidden from the lists.</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Are you sure you want to soft delete <span className="font-semibold text-slate-800">{viewUser?.name}</span>? You can access their record in the database, but they will be restricted from logging in.
                    </p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
                {deleteType !== "choice" && (
                  <button
                    type="button"
                    onClick={() => setDeleteType("choice")}
                    className="mr-auto text-slate-500 hover:text-slate-800 font-medium py-2 transition text-sm flex items-center gap-1"
                  >
                    ← Back to options
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setDeleteConfirmInput("");
                  }}
                  className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition text-sm"
                >
                  Cancel
                </button>
                {deleteType !== "choice" && (
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleteType === "hard" && deleteConfirmInput !== "8120"}
                    className={`font-medium px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 text-sm flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      deleteType === "hard"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {deleteType === "hard" ? "Confirm Permanent Delete" : "Deactivate & Hide"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PHOTO DELETE CONFIRMATION MODAL ================= */}
        {isPhotoDeleteOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-200 text-left">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <Trash2 size={20} /> Delete Profile Photo
                </h3>
                <button
                  onClick={() => setIsPhotoDeleteOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete the profile photo for <span className="font-semibold text-slate-800">{viewUser?.name}</span>? This will reset their avatar to the default image.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
                <button
                  type="button"
                  onClick={() => setIsPhotoDeleteOpen(false)}
                  className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPhotoDelete}
                  className="bg-red-600 hover:bg-red-700 font-medium px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 text-sm text-white"
                >
                  Delete Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ADD DONATION MODAL ================= */}
        {showDonationModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 text-left">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-200">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <PlusCircle size={20} className="text-emerald-500" />
                  Add Donation
                </h3>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none text-slate-700 placeholder-slate-400 transition text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Month
                  </label>
                  <select
                    value={donationMonth}
                    onChange={(e) => setDonationMonth(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition cursor-pointer"
                  >
                    {monthsList.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Year
                  </label>
                  <select
                    value={donationYear}
                    onChange={(e) => setDonationYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition cursor-pointer"
                  >
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDonation}
                  disabled={donationLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {donationLoading ? "Adding..." : "Add Donation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center text-center sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <h2 className="flex flex-col sm:flex-row items-center gap-2 text-xl sm:text-2xl font-semibold text-slate-800">
          <Users size={24} className="text-cyan-600" />
          User Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white text-slate-800
              border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm transition"
            />
          </div>

          {/* FILTER */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 px-4 py-2 rounded-xl bg-white text-slate-800
            border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm transition"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          {/* CREATE USER BUTTON */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-sm transition-all duration-150 active:scale-95 whitespace-nowrap"
          >
            <UserPlus size={18} />
            Create User
          </button>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20">
            <tr>
              <th className="p-4 text-left font-semibold">User Info</th>
              <th className="p-4 text-center font-semibold">Role</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={getAvatarUrl(u)}
                    className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      {u.name}
                      <svg className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.275C14.775 2.5 13.51 1.5 12 1.5c-1.51 0-2.775 1-3.422 2.285-.407-.175-.867-.275-1.348-.275-2.11 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.275.647 1.285 1.912 2.285 3.422 2.285 1.51 0 2.775-1 3.422-2.285.407.175.867.275 1.348.275 2.11 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.73-3.79-3.79 1.42-1.42 2.37 2.37 5.67-5.67 1.42 1.42-7.09 7.09z"/>
                      </svg>
                    </p>
                    <p className="text-xs text-slate-500">{u.mobile}</p>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>

                <td className="p-4 text-center">
                  {u.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${
                        u.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                          u.isActive ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => openUserModal(u._id)}
                    className="text-cyan-600 hover:text-cyan-800 hover:scale-110 transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((u) => (
          <div key={u._id} className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(u)}
                className="w-12 h-12 rounded-full border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  {u.name}
                  <svg className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.275C14.775 2.5 13.51 1.5 12 1.5c-1.51 0-2.775 1-3.422 2.285-.407-.175-.867-.275-1.348-.275-2.11 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.275.647 1.285 1.912 2.285 3.422 2.285 1.51 0 2.775-1 3.422-2.285.407.175.867.275 1.348.275 2.11 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.73-3.79-3.79 1.42-1.42 2.37 2.37 5.67-5.67 1.42 1.42-7.09 7.09z"/>
                  </svg>
                </p>
                <p className="text-xs text-slate-500">{u.mobile}</p>
              </div>
              <button onClick={() => openUserModal(u._id)} className="text-cyan-600 p-2 bg-cyan-50 rounded-lg">
                <Eye size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
                {u.role.replace("_", " ")}
              </span>

              {u.role !== "SUPER_ADMIN" && (
                <button
                  onClick={() => toggleStatus(u)}
                  className={`w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${
                    u.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                      u.isActive ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center sm:justify-end items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 rounded-xl bg-white border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="p-2 rounded-xl bg-white border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>



      {/* ================= CREATE USER MODAL ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full sm:max-w-2xl rounded-2xl shadow-xl overflow-hidden transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1e293b]">Create User</h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  resetCreateForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8 bg-white">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-700 placeholder-slate-400 transition"
                  />
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    Mobile Number <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    placeholder="10 digit mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-700 placeholder-slate-400 transition"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-700 placeholder-slate-400 transition"
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    Role <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-700 bg-white transition appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.25em'
                      }}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-4 px-8 py-5 border-t border-gray-100 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetCreateForm();
                  }}
                  className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition active:scale-95"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                {deleteType === "choice" && (
                  <span className="text-slate-800 flex items-center gap-2">
                    <Trash2 size={20} /> Delete User
                  </span>
                )}
                {deleteType === "hard" && (
                  <span className="text-red-600 flex items-center gap-2">
                    <Trash2 size={20} /> Permanently Delete
                  </span>
                )}
                {deleteType === "soft" && (
                  <span className="text-amber-600 flex items-center gap-2">
                    <Trash2 size={20} className="stroke-[2.5]" /> Soft Delete
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteConfirmInput("");
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              {deleteType === "choice" && (
                <>
                  <p className="text-sm text-slate-600">
                    Choose how you would like to delete user <span className="font-semibold text-slate-800">{viewUser?.name}</span>:
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setDeleteType("soft")}
                      className="flex flex-col items-start p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition text-left"
                    >
                      <span className="font-semibold text-amber-800 text-sm">
                        Soft Delete (Deactivate & Hide)
                      </span>
                      <span className="text-xs text-amber-700 mt-1">
                        Deactivates and hides the user from active search/lists. Their data remains in the database.
                      </span>
                    </button>
                    <button
                      onClick={() => setDeleteType("hard")}
                      className="flex flex-col items-start p-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition text-left"
                    >
                      <span className="font-semibold text-red-800 text-sm">
                        Hard Delete (Permanent)
                      </span>
                      <span className="text-xs text-red-700 mt-1">
                        Permanently deletes the user record and all associated donation data. Cannot be undone.
                      </span>
                    </button>
                  </div>
                </>
              )}

              {deleteType === "hard" && (
                <>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm flex flex-col gap-1">
                    <span className="font-semibold text-red-800">Warning:</span>
                    <span>This action is permanent and cannot be undone.</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to permanently delete user <span className="font-semibold text-slate-800">{viewUser?.name}</span>? All of their donation history and logs will be lost forever.
                  </p>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Type <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">8120</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmInput}
                      onChange={(e) => setDeleteConfirmInput(e.target.value)}
                      placeholder="Type 8120"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-slate-700 placeholder-slate-400 transition text-sm"
                    />
                  </div>
                </>
              )}

              {deleteType === "soft" && (
                <>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-700 text-sm flex flex-col gap-1">
                    <span className="font-semibold text-amber-800">Information:</span>
                    <span>This user will be deactivated and hidden from the lists.</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Are you sure you want to soft delete <span className="font-semibold text-slate-800">{viewUser?.name}</span>? You can access their record in the database, but they will be restricted from logging in.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              {deleteType !== "choice" && (
                <button
                  type="button"
                  onClick={() => setDeleteType("choice")}
                  className="mr-auto text-slate-500 hover:text-slate-800 font-medium py-2 transition text-sm flex items-center gap-1"
                >
                  ← Back to options
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteConfirmInput("");
                }}
                className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition text-sm"
              >
                Cancel
              </button>
              {deleteType !== "choice" && (
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteType === "hard" && deleteConfirmInput !== "8120"}
                  className={`font-medium px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 text-sm flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    deleteType === "hard"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {deleteType === "hard" ? "Confirm Permanent Delete" : "Deactivate & Hide"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PHOTO DELETE CONFIRMATION MODAL ================= */}
      {isPhotoDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <Trash2 size={20} /> Delete Profile Photo
              </h3>
              <button
                onClick={() => setIsPhotoDeleteOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete the profile photo for <span className="font-semibold text-slate-800">{viewUser?.name}</span>? This will reset their avatar to the default image.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={() => setIsPhotoDeleteOpen(false)}
                className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPhotoDelete}
                className="bg-red-600 hover:bg-red-700 font-medium px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 text-sm text-white"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
