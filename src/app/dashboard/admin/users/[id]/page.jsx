"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  PlusCircle,
  ArrowLeft,
  Phone,
  Calendar,
  ShieldCheck,
  Edit,
  Trash2,
} from "lucide-react";

import { getUserByIdAPI } from "../../../../../api/user.api";
import {
  createDonationAPI,
  getDonationsByDonorIdAPI,
  updateDonationAPI,
  deleteDonationAPI,
} from "../../../../../api/donation.api";
import { useSidebarColor } from "../../../../../hooks/useSidebarColor";

/* ===== BADGE STYLES ===== */
const roleStyles = {
  USER: "bg-blue-50 text-blue-700 border-blue-150",
  ADMIN: "bg-emerald-50 text-emerald-700 border-emerald-155",
  SUPER_ADMIN: "bg-purple-50 text-purple-700 border-purple-150",
};

const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-155",
  INACTIVE: "bg-rose-50 text-rose-700 border-rose-155",
};

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  //50 is default amount
  const [amount, setAmount] = useState("50");
  const [remarks, setRemarks] = useState("");

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [donationLoading, setDonationLoading] = useState(false);

  // Donation history & edit states
  const [donations, setDonations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editMonth, setEditMonth] = useState(1);
  const [editYear, setEditYear] = useState(now.getFullYear());
  const [editStatus, setEditStatus] = useState("Success");
  const [editRemarks, setEditRemarks] = useState("");
  const [editDonationLoading, setEditDonationLoading] = useState(false);

  const fetchDonations = async () => {
    try {
      const res = await getDonationsByDonorIdAPI(id);
      setDonations(res.data.data || []);
    } catch {
      toast.error("Failed to load donations");
    }
  };

  /* ===== FETCH USER & DONATIONS ===== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserByIdAPI(id);
        setUser(res.data.data);
      } catch {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchDonations();
  }, [id]);

  /* ===== CREATE DONATION ===== */
  const handleCreateDonation = async () => {
    if (!amount || amount <= 0) {
      return toast.error("Enter valid amount");
    }

    try {
      setDonationLoading(true);
      await createDonationAPI({
        donorId: id,
        amount: Number(amount),
        month,
        year,
        remarks,
      });
      toast.success("Donation added");
      setAmount("50");
      setRemarks("");
      setShowModal(false);
      fetchDonations();
    } catch {
      toast.error("Failed to add donation");
    } finally {
      setDonationLoading(false);
    }
  };

  /* ===== OPEN EDIT MODAL ===== */
  const handleOpenEdit = (donation) => {
    setEditingDonation(donation);
    setEditAmount(String(donation.amount));
    setEditMonth(donation.month);
    setEditYear(donation.year);
    setEditStatus(donation.status || "Success");
    setEditRemarks(donation.remarks || "");
    setShowEditModal(true);
  };

  /* ===== UPDATE DONATION ===== */
  const handleUpdateDonation = async () => {
    if (!editAmount || editAmount <= 0) {
      return toast.error("Enter valid amount");
    }

    try {
      setEditDonationLoading(true);
      await updateDonationAPI(editingDonation._id, {
        amount: Number(editAmount),
        month: editMonth,
        year: editYear,
        status: editStatus,
        remarks: editRemarks,
      });
      toast.success("Donation updated successfully");
      setShowEditModal(false);
      fetchDonations();
    } catch {
      toast.error("Failed to update donation");
    } finally {
      setEditDonationLoading(false);
    }
  };

  /* ===== DELETE DONATION ===== */
  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) {
      return;
    }

    try {
      await deleteDonationAPI(donationId);
      toast.success("Donation deleted successfully");
      fetchDonations();
    } catch {
      toast.error("Failed to delete donation");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-bold">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-800">

      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={() => navigate("/dashboard/admin/GetAllUser")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition font-semibold cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Users
      </button>

      {/* ===== PROFILE HEADER ===== */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">

        <img
          src={user.profilePhoto?.url && user.profilePhoto.url !== "/avatar.png"
            ? (user.profilePhoto.url.includes("ui-avatars.com")
                ? user.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`)
                : user.profilePhoto.url)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=${sidebarColor}&color=fff`}
          alt="profile"
          className="w-28 h-28 rounded-full border border-slate-200 object-cover shadow-xs"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{user.name}</h2>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleStyles[user.role]}`}>
              {user.role}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              user.isActive ? statusStyles.ACTIVE : statusStyles.INACTIVE
            }`}>
              {user.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-100 transition font-bold shadow-xs cursor-pointer"
        >
          <PlusCircle size={18} />
          Add Donation
        </button>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={<Phone size={18} />} label="Mobile" value={user.mobile} />
        <InfoCard
          icon={<ShieldCheck size={18} />}
          label="Created By"
          value={`${user.createdByName || "SYSTEM"} ${
            user.createdByRole ? `(${user.createdByRole})` : ""
          }`}
        />
        <InfoCard
          icon={<Calendar size={18} />}
          label="Joined"
          value={new Date(user.createdAt).toLocaleDateString("en-GB")}
        />
      </div>

      {/* ===== DONATION HISTORY ===== */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Donation History</h3>
            <p className="text-slate-400 text-xs mt-0.5">Manage and view all recorded donation entries for this user</p>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No donations recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm text-slate-800 border-collapse">
              <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20 text-xs font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-left font-semibold">Month & Year</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Amount</th>
                  <th className="py-3.5 px-4 text-left font-semibold">Remarks</th>
                  <th className="py-3.5 px-4 text-center font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {months[d.month - 1]} {d.year}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate">
                      {d.remarks || <span className="text-slate-300 italic">None</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        d.status === "Success" || d.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                          : d.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-150"
                          : "bg-rose-50 text-rose-700 border-rose-150"
                      }`}>
                        {d.status || "Success"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition cursor-pointer"
                          title="Edit Donation"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDonation(d._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Donation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ADD MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
          <div className="w-[90%] max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">Add Donation</h3>

            {/* AMOUNT */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold"
              />
            </div>

            {/* MONTH */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1} className="bg-white text-slate-800">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* YEAR */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
              >
                {[year - 2, year - 1, year, year + 1, year + 2].map((y) => (
                  <option key={y} value={y} className="bg-white text-slate-800">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* REMARKS */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remarks</label>
              <textarea
                placeholder="Remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold resize-none h-20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDonation}
                disabled={donationLoading}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition active:scale-95 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {donationLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
          <div className="w-[90%] max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">Edit Donation</h3>

            {/* AMOUNT */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold"
              />
            </div>

            {/* MONTH */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Month</label>
              <select
                value={editMonth}
                onChange={(e) => setEditMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1} className="bg-white text-slate-800">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* YEAR */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Year</label>
              <select
                value={editYear}
                onChange={(e) => setEditYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
              >
                {[year - 2, year - 1, year, year + 1, year + 2].map((y) => (
                  <option key={y} value={y} className="bg-white text-slate-800">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
              >
                <option value="Success" className="bg-white text-slate-800">Success</option>
                <option value="Pending" className="bg-white text-slate-800">Pending</option>
                <option value="Failed" className="bg-white text-slate-800">Failed</option>
              </select>
            </div>

            {/* REMARKS */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remarks</label>
              <textarea
                placeholder="Remarks (optional)"
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold resize-none h-20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDonation}
                disabled={editDonationLoading}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition active:scale-95 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {editDonationLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== INFO CARD ===== */
const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex items-center gap-3.5">
    <div className="p-2.5 rounded-xl bg-slate-100 text-cyan-600 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export default ViewUser;
