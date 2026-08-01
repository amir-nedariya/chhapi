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
  updateUserStatsAPI,
  getCreatorsAPI,
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
  Edit,
  Check,
} from "lucide-react";

import { useSidebarColor } from "../../../../hooks/useSidebarColor";
import CreateUserModal from "../../../../components/common/CreateUserModal";
import Table from "../../../../components/common/Table";
import PasswordCell from "../../../../components/common/PasswordCell";
import DeleteConfirmModal from "../../../../components/common/DeleteConfirmModal";
import FilterBar from "../../../../components/common/FilterBar";
import Modal from "../../../../components/common/Modal";
import Button from "../../../../components/common/Button";
import TicketBackground from "../../../../components/common/TicketBackground";

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

const AdminAllUsersPage = () => {
  const sidebarColor = useSidebarColor();
  const getAvatarUrl = (userObj) => {
    if (typeof userObj?.profilePhoto === 'string' && userObj.profilePhoto.startsWith('http')) {
      return userObj.profilePhoto.includes("ui-avatars.com")
        ? userObj.profilePhoto.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`)
        : userObj.profilePhoto;
    }
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
  const [creatorFilter, setCreatorFilter] = useState("ALL");
  const [creatorsList, setCreatorsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("USER");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPhotoDeleteOpen, setIsPhotoDeleteOpen] = useState(false);

  // Donation creation states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMonth, setDonationMonth] = useState(new Date().getMonth() + 1);
  const [donationYear, setDonationYear] = useState(new Date().getFullYear());
  const [donationLoading, setDonationLoading] = useState(false);

  // Monthly edit states
  const [showEditMonthlyModal, setShowEditMonthlyModal] = useState(false);
  const [editMonthlyMonth, setEditMonthlyMonth] = useState("");
  const [editMonthlyAmount, setEditMonthlyAmount] = useState("");
  const [editMonthlyLoading, setEditMonthlyLoading] = useState(false);
  const [selectedInsightYear, setSelectedInsightYear] = useState(new Date().getFullYear());

  // Bulk edit states for super admin
  const [selectedMonthsForBulk, setSelectedMonthsForBulk] = useState([]);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditAmount, setBulkEditAmount] = useState("");
  const [bulkEditLoading, setBulkEditLoading] = useState(false);

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
  const fetchUsers = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await getAllUsersAPI({ page, limit: ITEMS_PER_PAGE, search, role: roleFilter, creator: creatorFilter });
      setUsers(res.data.data || []);
      setTotalItems(res.data.total || 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await getCreatorsAPI();
      setCreatorsList(res.data.data || []);
    } catch {
      toast.error("Failed to load creators");
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, creatorFilter]);

  /* ================= ACTIONS ================= */
  const toggleStatus = async (u) => {
    try {
      setLoadingId(u._id);
      u.isActive
        ? await deactivateUserAPI(u._id)
        : await activateUserAPI(u._id);
      fetchUsers(false);
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
      setSelectedMonthsForBulk([]); // Reset selection when viewing a new user
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

  const handleSaveMonthlyStats = async () => {
    if (editMonthlyAmount === "" || Number(editMonthlyAmount) < 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setEditMonthlyLoading(true);
      const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = shortMonths.indexOf(editMonthlyMonth) + 1;
      await createDonationAPI({
        donorId: viewUser._id,
        amount: Number(editMonthlyAmount),
        month: monthIndex,
        year: selectedInsightYear
      });
      toast.success("Donation recorded for the selected month!");
      setShowEditMonthlyModal(false);
      // Refresh user details
      openUserModal(viewUser._id);
    } catch {
      toast.error("Failed to update monthly insights");
    } finally {
      setEditMonthlyLoading(false);
    }
  };

  const handleBulkSaveMonthlyStats = async () => {
    if (bulkEditAmount === "" || Number(bulkEditAmount) < 0) {
      return toast.error("Please enter a valid amount");
    }

    try {
      setBulkEditLoading(true);
      const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const promises = selectedMonthsForBulk.map(m => {
        const monthIndex = shortMonths.indexOf(m) + 1;
        return createDonationAPI({
          donorId: viewUser._id,
          amount: Number(bulkEditAmount),
          month: monthIndex,
          year: selectedInsightYear
        });
      });
      await Promise.all(promises);

      toast.success("Donations recorded for selected months!");
      setShowBulkEditModal(false);
      setBulkEditAmount("");
      setSelectedMonthsForBulk([]);
      // Refresh user details
      openUserModal(viewUser._id);
    } catch {
      toast.error("Failed to update monthly insights");
    } finally {
      setBulkEditLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!viewUser) return;
    try {
      setDeleteLoading(true);
      await softDeleteUserAPI(viewUser._id);
      toast.success("User deleted successfully!");
      setIsDeleteOpen(false);
      setViewUser(null);
      fetchUsers();
    } catch {
      toast.error("Deletion failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (viewUser) {
    return (
      <div className="animate-in fade-in duration-200 py-3 md:py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-sm shadow-blue-500/20">
                <Users size={20} />
              </div>
              User Profile & Insights
            </h2>
          </div>
          <button
            onClick={() => {
              setViewUser(null);
              setSelectedMonthsForBulk([]);
            }}
            className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 hover:bg-slate-100 rounded-xl transition text-sm flex items-center gap-2 self-start sm:self-auto group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Users List
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
            {/* Avatar & Profile actions */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col items-center text-center">
              {/* Cover Photo Area */}
              <div className="w-full h-24 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <img
                      src={getAvatarUrl(viewUser)}
                      className="w-24 h-24 rounded-2xl border-4 border-white shadow-sm object-cover bg-white group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6 w-full flex flex-col items-center">
                <h4 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 justify-center tracking-tight">
                  {viewUser.name}
                  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.275C14.775 2.5 13.51 1.5 12 1.5c-1.51 0-2.775 1-3.422 2.285-.407-.175-.867-.275-1.348-.275-2.11 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.275.647 1.285 1.912 2.285 3.422 2.285 1.51 0 2.775-1 3.422-2.285.407 1.75.867.275 1.348.275 2.11 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.73-3.79-3.79 1.42-1.42 2.37 2.37 5.67-5.67 1.42 1.42-7.09 7.09z" />
                  </svg>
                </h4>
                <p className="text-sm font-medium text-slate-500 mt-1 mb-4">{viewUser.mobile}</p>

                <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase ${roleStyles[viewUser.role]}`}>
                  {viewUser.role.replace("_", " ")}
                </span>

                <div className="w-full border-t border-slate-100 my-6" />

                {/* Profile Actions */}
                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={() => {
                      setDonationMonth(new Date().getMonth() + 1);
                      setDonationYear(new Date().getFullYear());
                      setShowDonationModal(true);
                    }}
                    className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-slate-900/10 active:scale-[0.98] cursor-pointer"
                  >
                    <PlusCircle size={18} className="text-slate-300" /> Add New Donation
                  </button>

                  {!viewUser.profilePhoto && (
                    <label className="cursor-pointer text-center text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.98]">
                      <Upload size={18} className="text-slate-400" /> Upload Photo
                      <input hidden type="file" accept="image/*"
                        onChange={(e) =>
                          handlePhotoUpload(viewUser._id, e.target.files[0])
                        }
                      />
                    </label>
                  )}

                  {(viewUser.profilePhoto || viewUser.role !== "SUPER_ADMIN") && (
                    <div className="grid grid-cols-2 gap-2.5 mt-2">
                      {viewUser.profilePhoto && (
                        <button
                          onClick={handlePhotoDelete}
                          className="text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                        >
                          <Trash2 size={14} /> Remove Photo
                        </button>
                      )}

                      {viewUser.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={handleOpenDeleteModal}
                          className={`text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer ${!viewUser.profilePhoto ? 'col-span-2' : ''}`}
                        >
                          <Trash2 size={14} /> Delete User
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Metadata Details */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-5">
              <h5 className="font-bold text-slate-800 text-xs tracking-wider uppercase mb-1">System Information</h5>

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
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${viewUser.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${viewUser.isActive ? "bg-green-500" : "bg-slate-400"}`} />
                    {viewUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Change Role Section */}
              {viewUser.role !== "SUPER_ADMIN" && (
                <div className="border-t border-slate-100 pt-5 mt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">User Role</label>
                  <select
                    value={viewUser.role}
                    onChange={(e) => changeRole(viewUser._id, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all shadow-sm cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Donation Insights */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {/* KPI 1 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3.5 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl shadow-sm shadow-emerald-500/10">
                  <IndianRupee size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Total Donated</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ₹{(viewUser.totalDonations || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3.5 bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 rounded-2xl shadow-sm shadow-sky-500/10">
                  <CreditCard size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Donation Count</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {viewUser.donationCount || 0} <span className="text-sm font-medium text-slate-500 normal-case tracking-normal">times</span>
                  </p>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3.5 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-2xl shadow-sm shadow-purple-500/10">
                  <TrendingUp size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Avg. Donation</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ₹{Math.round(viewUser.avgDonation || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Yearly Stats Breakdown */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h5 className="font-bold text-slate-800 text-xs tracking-wider uppercase mb-5 flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-500" />
                Yearly Distribution
              </h5>

              <div className="space-y-5">
                {Object.entries(viewUser.yearlyStats || { "2025": 0, "2026": 0 }).map(([year, amount]) => {
                  const expectedYearly = viewUser.avgDonation ? viewUser.avgDonation * 12 : Math.max(amount, 1);
                  const target = expectedYearly;
                  const percentage = Math.min(Math.round((amount / target) * 100), 100);
                  return (
                    <div key={year} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-700">{year}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">₹{amount.toLocaleString("en-IN")}</span>
                          <span className="text-xs font-medium text-slate-400 w-10 text-right">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Stats Breakdown */}
            <div className="mt-8 flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                  <h5 className="font-bold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-2 whitespace-nowrap">
                    <Calendar size={18} className="text-cyan-500 flex-shrink-0" />
                    Monthly Insights
                  </h5>
                  <select
                    value={selectedInsightYear}
                    onChange={(e) => setSelectedInsightYear(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 outline-none font-medium cursor-pointer focus:border-cyan-400 transition-colors"
                  >
                    {[...Array(10)].map((_, i) => {
                      const yr = new Date().getFullYear() - 2 + i;
                      return <option key={yr} value={yr}>{yr}</option>;
                    })}
                  </select>
                </div>
                {selectedMonthsForBulk.length > 0 && (
                  <button
                    onClick={() => setShowBulkEditModal(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition font-semibold text-xs shadow-sm cursor-pointer active:scale-95 animate-in fade-in zoom-in duration-200 whitespace-nowrap w-full sm:w-auto"
                  >
                    Bulk Edit ({selectedMonthsForBulk.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                  const defaultMonths = {
                    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
                    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
                  };

                  // Safely extract stats for selected year (handling both nested and old flat structure)
                  const ms = viewUser.monthlyStats || {};
                  const isOldStructure = ms["Jan"] !== undefined || ms["Feb"] !== undefined || (Object.keys(ms).length > 0 && typeof ms[Object.keys(ms)[0]] !== 'object');
                  let yearStats = {};

                  if (isOldStructure) {
                    yearStats = String(selectedInsightYear) === String(new Date().getFullYear()) ? ms : {};
                  } else {
                    yearStats = ms[String(selectedInsightYear)] || {};
                  }

                  const fullMonthlyStats = {
                    ...defaultMonths,
                    ...yearStats
                  };
                  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const currentMonth = monthNames[new Date().getMonth()];
                  const currentMonthIndex = new Date().getMonth();

                  return Object.entries(fullMonthlyStats).map(([month, amount]) => {
                    const currentYear = new Date().getFullYear();
                    const isCurrent = month === currentMonth && selectedInsightYear === currentYear;
                    const isPaid = amount > 0;
                    const monthIndex = monthNames.indexOf(month);
                    const isFuture = selectedInsightYear > currentYear || (selectedInsightYear === currentYear && monthIndex > currentMonthIndex);

                    const pendingDonationForMonth = viewUser?.pendingDonations?.find(
                      d => d.month === monthIndex + 1 && d.year === Number(selectedInsightYear)
                    );
                    const isPending = !!pendingDonationForMonth;
                    const displayAmount = isPending ? pendingDonationForMonth.amount : (amount > 0 ? amount : (viewUser?.avgDonation || 50));

                    const isSelected = selectedMonthsForBulk.includes(month);

                    let statusLabel = 'default';
                    if (isPaid) statusLabel = 'paid';
                    else if (isPending) statusLabel = 'pending';
                    else if (isCurrent) statusLabel = 'current';
                    else if (isFuture) statusLabel = 'default';
                    else statusLabel = 'missed';

                    return (
                      <div
                        key={month}
                        onClick={() => {
                          if (selectedMonthsForBulk.includes(month)) {
                            setSelectedMonthsForBulk(prev => prev.filter(m => m !== month));
                          } else {
                            setSelectedMonthsForBulk(prev => [...prev, month]);
                          }
                        }}
                        className={`group relative flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 cursor-pointer select-none h-[90px] w-full`}
                      >
                        {/* SVG BACKGROUND */}
                        <TicketBackground status={statusLabel} />

                        {/* CONTENT */}
                        <div className="flex items-center justify-between relative z-10 w-full px-1 sm:px-3 pointer-events-none">
                          {/* Empty Circle Indicator */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 bg-white ${isSelected
                              ? "border-cyan-500 text-cyan-500 shadow-sm"
                              : statusLabel === 'paid' ? 'border-[#22c55e]' : statusLabel === 'missed' ? 'border-[#ef4444]' : statusLabel === 'current' ? 'border-[#0ea5e9]' : statusLabel === 'pending' ? 'border-[#f59e0b]' : 'border-[#cbd5e1]'
                              }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={4} />}
                          </div>

                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${statusLabel === 'paid' ? 'text-[#166534]' : statusLabel === 'missed' ? 'text-[#991b1b]' : statusLabel === 'current' ? 'text-[#075985]' : statusLabel === 'pending' ? 'text-[#92400e]' : 'text-[#475569]'}`}>
                              {month}
                            </span>
                            <span className={`text-2xl font-bold tracking-tight leading-none ${statusLabel === 'paid' ? 'text-[#166534]' : statusLabel === 'missed' ? 'text-[#991b1b]' : statusLabel === 'current' ? 'text-[#075985]' : statusLabel === 'pending' ? 'text-[#92400e]' : 'text-[#475569]'}`}>₹{displayAmount.toLocaleString("en-IN")}</span>
                          </div>

                          {/* EDIT ICON */}
                          <div className="pointer-events-auto relative z-20" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setEditMonthlyMonth(month);
                                setEditMonthlyAmount(String(amount));
                                setShowEditMonthlyModal(true);
                              }}
                              className={`p-2 rounded-full transition-transform hover:scale-110 cursor-pointer ${statusLabel === 'paid' ? 'bg-[#dcfce7]' : statusLabel === 'current' ? 'bg-[#e0f2fe]' : statusLabel === 'pending' ? 'bg-[#fef3c7]' : statusLabel === 'missed' ? 'bg-[#fee2e2]' : 'bg-black/5'}`}
                            >
                              <Edit size={16} className={statusLabel === 'paid' ? 'text-[#166534]' : statusLabel === 'current' ? 'text-[#0369a1]' : statusLabel === 'pending' ? 'text-[#92400e]' : statusLabel === 'missed' ? 'text-[#991b1b]' : 'text-current opacity-70'} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>



        {/* ================= EDIT MONTHLY STATS MODAL ================= */}
        {showEditMonthlyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200">
            <div className="w-[90%] max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-200 text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">Edit Monthly Insight</h3>
                <button
                  onClick={() => setShowEditMonthlyModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* MONTH DISPLAY */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Month</label>
                <div className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  {editMonthlyMonth}
                </div>
              </div>

              {/* AMOUNT INPUT */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Donation Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount (0 to clear)"
                  value={editMonthlyAmount}
                  onChange={(e) => setEditMonthlyAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowEditMonthlyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition active:scale-95 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMonthlyStats}
                  disabled={editMonthlyLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition active:scale-95 shadow-md disabled:opacity-50 cursor-pointer text-xs"
                >
                  {editMonthlyLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= BULK EDIT MONTHLY STATS MODAL ================= */}
        {showBulkEditModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200">
            <div className="w-[90%] max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-200 text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">Bulk Edit Monthly Insights</h3>
                <button
                  onClick={() => setShowBulkEditModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* MONTHS DISPLAY */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Selected Months</label>
                <div className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs flex flex-wrap gap-1.5">
                  {selectedMonthsForBulk.join(", ")}
                </div>
              </div>

              {/* AMOUNT INPUT */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Donation Amount (₹) for Selected Months</label>
                <input
                  type="number"
                  placeholder="Enter amount (0 to clear)"
                  value={bulkEditAmount}
                  onChange={(e) => setBulkEditAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-850 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowBulkEditModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition active:scale-95 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSaveMonthlyStats}
                  disabled={bulkEditLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition active:scale-95 shadow-md disabled:opacity-50 cursor-pointer text-xs"
                >
                  {bulkEditLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        <DeleteConfirmModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          message={<>Are you sure you want to delete <strong>{viewUser?.name}</strong>? This action will restrict their access.</>}
          loading={deleteLoading}
        />

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") setSearch(value);
    if (name === "roleFilter") setRoleFilter(value);
    if (name === "creatorFilter") setCreatorFilter(value);
    setPage(1);
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search user..." },
    {
      type: "select", name: "roleFilter", options: [
        { label: "All Roles", value: "ALL" },
        { label: "User", value: "USER" },
        { label: "Admin", value: "ADMIN" }
      ]
    },
    {
      type: "select", name: "creatorFilter", options: [
        { label: "All Creators", value: "ALL" },
        ...creatorsList.map(c => ({ label: c, value: c }))
      ]
    }
  ];

  const columns = [
    {
      key: "user",
      header: "User Info",
      render: (_, u) => (
        <div className="flex items-center gap-4">
          <img src={getAvatarUrl(u)} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
          <div>
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              {u.name}
              {u.role === "SUPER_ADMIN" && (
                <svg className="w-3.5 h-3.5 text-blue-500 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.275C14.775 2.5 13.51 1.5 12 1.5c-1.51 0-2.775 1-3.422 2.285-.407-.175-.867-.275-1.348-.275-2.11 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.275.647 1.285 1.912 2.285 3.422 2.285 1.51 0 2.775-1 3.422-2.285.407.175.867.275 1.348.275 2.11 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.72 3.73-3.79-3.79 1.42-1.42 2.37 2.37 5.67-5.67 1.42 1.42-7.09 7.09z" />
                </svg>
              )}
            </p>
            <p className="text-xs text-slate-500">{u.mobile}</p>
          </div>
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      align: "center",
      render: (_, u) => (
        <span className={`px-3 py-1 rounded-full text-xs ${roleStyles[u.role]}`}>
          {u.role.replace("_", " ")}
        </span>
      )
    },
    {
      key: "creator",
      header: "Creator",
      align: "center",
      render: (_, u) => (
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-slate-700">{u.createdBy || 'System'}</span>
          <span className="text-xs text-slate-500">
            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (_, u) => (
        u.role !== "SUPER_ADMIN" ? (
          <button
            onClick={() => toggleStatus(u)}
            className={`w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${u.isActive ? "bg-green-500" : "bg-gray-300"
              }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${u.isActive ? "translate-x-5" : ""
                }`}
            />
          </button>
        ) : null
      )
    },
    {
      key: "view",
      header: "View",
      align: "center",
      render: (_, u) => (
        <button
          onClick={() => openUserModal(u._id)}
          className="text-cyan-600 hover:text-cyan-800 hover:scale-110 transition"
        >
          <Eye size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="py-3 md:py-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Users className="text-teal-700" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              User Management
            </h2>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} iconLeft={UserPlus} variant="solid">
          Create User
        </Button>
      </div>

      <FilterBar filters={filterConfig} params={{ search, roleFilter, creatorFilter }} onChange={handleFilterChange} />

      <Table
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{ entityName: "Users", entityIcon: "Users" }}
      />


      {/* ================= CREATE USER MODAL ================= */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetCreateForm(); }} maxWidth="max-w-2xl">
        <Modal.Header onClose={() => { setIsCreateOpen(false); resetCreateForm(); }}>
          Create User
        </Modal.Header>

        <Modal.Body>
          <form id="pageCreateUserForm" onSubmit={handleCreateUser} className="space-y-6" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter full name"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="10 digit mobile number"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[15px] font-bold text-[#1C2434] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gray-300 transition-all bg-white"
                />
              </div>

            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={() => {
              setIsCreateOpen(false);
              resetCreateForm();
            }}
            className="px-5 py-2.5 text-[15px] font-medium text-slate-500 hover:text-slate-700 transition-colors bg-transparent border-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="pageCreateUserForm"
            style={{ backgroundColor: `#${sidebarColor}` }}
            className="px-6 py-2.5 text-[15px] font-medium text-white hover:opacity-90 rounded-md shadow-sm transition-all"
          >
            Save User
          </button>
        </Modal.Footer>
      </Modal>

      {/* Removed duplicate delete modal from end of file */}

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

export default AdminAllUsersPage;
