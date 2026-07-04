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
} from "lucide-react";

import { getUserByIdAPI } from "../../../../../api/user.api";
import { createDonationAPI } from "../../../../../api/donation.api";

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

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  //50 is default amount
  const [amount, setAmount] = useState("50");

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [donationLoading, setDonationLoading] = useState(false);

  /* ===== FETCH USER ===== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserByIdAPI(id);
        setUser(res.data.data);
      } catch {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
      });
      toast.success("Donation added");
      setAmount("");
      setShowModal(false);
    } catch {
      toast.error("Failed to add donation");
    } finally {
      setDonationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-bold">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-red-550 font-bold">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 font-sans">

      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={() => navigate("/dashboard/super-admin/usersList")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition font-semibold cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Users List
      </button>

      {/* ===== PROFILE HEADER ===== */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">

        <img
          src={user.profilePhoto?.url && user.profilePhoto.url !== "/avatar.png"
            ? user.profilePhoto.url
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0e7490&color=fff`}
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
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-55/70 hover:bg-cyan-100 text-cyan-700 border border-cyan-100 transition font-bold shadow-xs cursor-pointer"
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

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
          <div className="w-[90%] max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">

            <h3 className="text-lg font-bold text-slate-800">Add Donation</h3>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-55/40 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 transition font-semibold"
            />

            {/* MONTH */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-55/40 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
            >
              {months.map((m, i) => (
                <option
                  key={i}
                  value={i + 1}
                  className="bg-white text-slate-800"
                >
                  {m}
                </option>
              ))}
            </select>

            {/* YEAR */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-55/40 border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition cursor-pointer font-semibold"
            >
              {[year, year + 1, year + 2].map((y) => (
                <option
                  key={y}
                  value={y}
                  className="bg-white text-slate-800"
                >
                  {y}
                </option>
              ))}
            </select>

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
    </div>
  );
};

/* ===== INFO CARD ===== */
const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex items-center gap-3.5">
    <div className="p-2.5 rounded-xl bg-slate-100 text-cyan-605/90 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export default ViewUser;
