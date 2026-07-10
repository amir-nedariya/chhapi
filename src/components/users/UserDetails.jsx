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
} from "lucide-react";

import { getUserByIdAPI } from "../../api/user.api";
import {
  createDonationAPI,
  getDonationsByDonorIdAPI,
  updateDonationAPI,
} from "../../api/donation.api";
import { useSidebarColor } from "../../hooks/useSidebarColor";

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

const UserDetails = ({ currentRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();

  const basePath = currentRole === "SUPER_ADMIN" ? "/dashboard/super-admin" :
                   currentRole === "ADMIN" ? "/dashboard/admin" : 
                   "/dashboard/user";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("50");

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
        remarks: "",
      });
      toast.success("Donation added");
      setAmount("50");
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
        remarks: "",
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
        onClick={() => navigate(`${basePath}/all-users`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition font-semibold cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Users
      </button>

      {/* ===== PROFILE HEADER ===== */}
      <div className="rounded-xl bg-white border border-slate-200/50 p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">

        <img
          src={user.profilePhoto?.url && user.profilePhoto.url !== "/avatar.png"
            ? (user.profilePhoto.url.includes("ui-avatars.com")
                ? user.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`)
                : user.profilePhoto.url)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=${sidebarColor}&color=fff`}
          alt="profile"
          className="w-24 h-24 rounded-full border border-slate-200 object-cover shadow-xs"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">{user.name}</h2>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${roleStyles[user.role]}`}>
              {user.role}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
              user.isActive ? statusStyles.ACTIVE : statusStyles.INACTIVE
            }`}>
              {user.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>

        {currentRole !== "USER" && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition font-semibold text-xs shadow-sm hover:shadow active:scale-98 cursor-pointer"
          >
            <PlusCircle size={14} />
            Add Donation
          </button>
        )}
      </div>

      {/* ===== DETAILS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={<Phone size={16} />} label="Mobile" value={user.mobile} />
        <InfoCard
          icon={<ShieldCheck size={16} />}
          label="Created By"
          value={`${user.createdByName || "SYSTEM"} ${
            user.createdByRole ? `(${user.createdByRole})` : ""
          }`}
        />
        <InfoCard
          icon={<Calendar size={16} />}
          label="Joined"
          value={new Date(user.createdAt).toLocaleDateString("en-GB")}
        />
      </div>

      {/* ===== DONATION HISTORY ===== */}
      <div className="rounded-xl bg-white border border-slate-200/50 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-slate-800 font-semibold text-xs uppercase tracking-wider">Donation History</h3>
            <p className="text-slate-400 text-[10px] mt-0.5 font-medium">Manage and view all recorded donation entries for this user</p>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
            No donations recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200/40">
            <table className="w-full text-xs text-slate-800 border-collapse">
              <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20 text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold border-b border-slate-200/10">Month & Year</th>
                  <th className="py-3 px-4 text-right font-semibold border-b border-slate-200/10">Amount</th>
                  <th className="py-3 px-4 text-left font-semibold border-b border-slate-200/10">Remarks</th>
                  <th className="py-3 px-4 text-center font-semibold border-b border-slate-200/10">Status</th>
                  {currentRole !== "USER" && (
                    <th className="py-3 px-4 text-center font-semibold border-b border-slate-200/10">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {months[d.month - 1]} {d.year}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">
                      {d.remarks || <span className="text-slate-350 italic">None</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${
                        d.status === "Success" || d.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : d.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {d.status || "Success"}
                      </span>
                    </td>
                    {currentRole !== "USER" && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition cursor-pointer"
                          title="Edit Donation"
                        >
                          <Edit size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ADD MODAL ===== */}
      {showModal && currentRole !== "USER" && (
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
      {showEditModal && currentRole !== "USER" && (
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
  <div className="rounded-xl bg-white border border-slate-200/50 shadow-xs p-5 flex items-center gap-3.5 hover:shadow-sm transition-shadow">
    <div className="p-2.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="font-semibold text-slate-800 mt-0.5 text-sm">{value}</p>
    </div>
  </div>
);

export default UserDetails;
