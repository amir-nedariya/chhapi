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
  USER: "bg-blue-500/20 text-blue-300",
  ADMIN: "bg-green-500/20 text-green-300",
  SUPER_ADMIN: "bg-purple-500/20 text-purple-300",
};

const statusStyles = {
  ACTIVE: "bg-emerald-500/20 text-emerald-300",
  INACTIVE: "bg-red-500/20 text-red-300",
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
      <div className="text-center py-20 text-white/60">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-red-400">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-white">

      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={() => navigate("/dashboard/admin/GetAllUser")}
        className="flex items-center gap-2 text-sm text-white/70 hover:text-cyan-400 transition"
      >
        <ArrowLeft size={18} />
        Back to Users
      </button>

      {/* ===== PROFILE HEADER ===== */}
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 flex flex-col md:flex-row items-center gap-6">

        <img
          src={user.profilePhoto?.url || "/avatar.png"}
          alt="profile"
          className="w-28 h-28 rounded-full border border-white/30 object-cover"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold">{user.name}</h2>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[user.role]}`}>
              {user.role}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.isActive ? statusStyles.ACTIVE : statusStyles.INACTIVE
            }`}>
              {user.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/30 hover:bg-cyan-500/50 transition font-semibold"
        >
          <PlusCircle size={18} />
          Add Donation
        </button>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={<Phone />} label="Mobile" value={user.mobile} />
        <InfoCard
          icon={<ShieldCheck />}
          label="Created By"
          value={`${user.createdByName || "SYSTEM"} ${
            user.createdByRole ? `(${user.createdByRole})` : ""
          }`}
        />
        <InfoCard
          icon={<Calendar />}
          label="Joined"
          value={new Date(user.createdAt).toLocaleDateString("en-GB")}
        />
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="w-[90%] max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 space-y-4">

            <h3 className="text-lg font-semibold">Add Donation</h3>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none"
            />

            {/* MONTH */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
            >
              {months.map((m, i) => (
                <option
                  key={i}
                  value={i + 1}
                  className="bg-white text-black"
                >
                  {m}
                </option>
              ))}
            </select>

            {/* YEAR */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
            >
              {[year, year + 1, year + 2].map((y) => (
                <option
                  key={y}
                  value={y}
                  className="bg-white text-black"
                >
                  {y}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDonation}
                disabled={donationLoading}
                className="px-4 py-2 rounded-lg bg-cyan-500/40 hover:bg-cyan-500/60 font-semibold"
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
  <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 flex items-center gap-3">
    <div className="p-2 rounded-xl bg-white/10">{icon}</div>
    <div>
      <p className="text-xs text-white/60">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default ViewUser;
