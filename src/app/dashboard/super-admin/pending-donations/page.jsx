"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  getPendingDonationsAPI,
  approveDonationAPI,
  rejectDonationAPI,
} from "../../../../api/donation.api";
import {
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
} from "lucide-react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEMS_PER_PAGE = 10;

const PendingDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [selectedCollector, setSelectedCollector] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [page, setPage] = useState(1);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalState, setModalState] = useState("idle"); // "idle" | "processing" | "success" | "error"

  /* ================= FETCH DATA ================= */
  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingDonationsAPI();
      setDonations(res?.data?.data || []);
    } catch {
      toast.error("❌ Failed to load pending donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  /* ================= APPROVE / REJECT ================= */
  const approveDonation = async (id) => {
    try {
      setLoadingId(id);
      await approveDonationAPI(id);

      // Find approved donation details from list
      const donation = donations.find(d => d._id === id);
      if (donation) {
        const phone = donation.donorMobile || donation.donor?.mobile || "";
        const donorName = donation.donor?.name || donation.donorName || "Donor";
        const amount = donation.amount;
        const campaign = donation.remarks || "our campaigns";

        // Construct pre-filled message text
        const messageText = `Hello *${donorName}*,\n\nWe are pleased to inform you that your donation of *₹${amount}* for *${campaign}* has been verified and approved successfully.\n\nThank you for your generous contribution and support! 🙏\n\n— *Chhapi Donation Portal*`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone.replace(/[^\d]/g, '')}&text=${encodeURIComponent(messageText)}`;

        // Open WhatsApp Web/App in a new tab (100% Free click-to-chat api)
        window.open(whatsappUrl, "_blank");
      }

      toast.success("✅ Donation approved & WhatsApp chat opened");
      fetchPending();
    } catch {
      toast.error("❌ Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  const rejectDonation = async (id) => {
    try {
      setLoadingId(id);
      await rejectDonationAPI(id);
      toast.success("❌ Donation rejected");
      fetchPending();
    } catch {
      toast.error("❌ Rejection failed");
    } finally {
      setLoadingId(null);
    }
  };

  const confirmRejection = async (id) => {
    try {
      setModalState("processing");
      await rejectDonationAPI(id);
      setModalState("success");
      toast.success("❌ Donation rejected");
      fetchPending();
      setTimeout(() => {
        setRejectModalOpen(false);
        setSelectedDonation(null);
        setModalState("idle");
      }, 1500);
    } catch {
      setModalState("error");
      toast.error("❌ Rejection failed");
      setTimeout(() => {
        setRejectModalOpen(false);
        setSelectedDonation(null);
        setModalState("idle");
      }, 1500);
    }
  };

  /* ================= FILTER OPTIONS ================= */
  const collectors = useMemo(() => [
    "ALL",
    ...new Set(donations.map((d) => d.collectedBy?.name).filter(Boolean))
  ], [donations]);

  const years = useMemo(() => [
    "ALL",
    ...new Set(donations.map(d => d.year))
  ], [donations]);

  const months = useMemo(() => [
    "ALL",
    ...new Set(donations.map(d => d.month))
  ], [donations]);

  /* ================= FILTERED DATA ================= */
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const collectorMatch = selectedCollector === "ALL" || d.collectedBy?.name === selectedCollector;
      const yearMatch = selectedYear === "ALL" || d.year === Number(selectedYear);
      const monthMatch = selectedMonth === "ALL" || d.month === Number(selectedMonth);
      return collectorMatch && yearMatch && monthMatch;
    });
  }, [donations, selectedCollector, selectedYear, selectedMonth]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedData = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-1 sm:p-6 space-y-5">
      {/* ================= HEADER ================= */}
      <h2 className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 text-xl sm:text-2xl font-bold text-slate-800">
        <Clock size={24} className="text-cyan-600" />
        Pending Donations
      </h2>

      {/* ================= FILTERS ================= */}
      <div className="space-y-3">
        {/* Collector filter - top */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div className="flex items-center gap-2 flex-1">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedCollector}
              onChange={(e) => { setSelectedCollector(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm outline-none transition"
            >
              {collectors.map(name => (
                <option key={name} value={name}>{name === "ALL" ? "All Collectors" : name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Year & Month filters - second row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-2 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm outline-none transition"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y === "ALL" ? "All Years" : y}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-2 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm outline-none transition"
          >
            {months.map(m => (
              <option key={m} value={m}>
                {m === "ALL" ? "All Months" : monthNames[m - 1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20">
            <tr>
              <th className="p-4 text-left font-semibold">Donor</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Collected By</th>
              <th className="p-4 text-center font-semibold">Year</th>
              <th className="p-4 text-center font-semibold">Month</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-500">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-500">No pending donations</td>
              </tr>
            ) : (
              paginatedData.map(d => (
                <tr key={d._id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-800">{d.donor?.name || "N/A"}</td>
                  <td className="p-4 font-bold text-green-600">₹{d.amount}</td>
                  <td className="p-4 text-slate-700">
                    {d.collectedBy?.name} <span className="text-xs text-slate-500">({d.collectedBy?.role})</span>
                  </td>
                  <td className="p-4 text-center text-slate-700">{d.year}</td>
                  <td className="p-4 text-center text-slate-700">{monthNames[d.month - 1]}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        disabled={loadingId !== null}
                        onClick={() => approveDonation(d._id)}
                        title="Approve Donation"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white active:bg-emerald-700 border border-emerald-200 hover:border-emerald-600 rounded-lg disabled:opacity-40 transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                      >
                        <CheckCircle size={14} className="stroke-[2.5]" />
                        {loadingId === d._id ? "..." : "Approve"}
                      </button>
                      <button
                        disabled={loadingId !== null}
                        onClick={() => { setSelectedDonation(d); setRejectModalOpen(true); }}
                        title="Reject Donation"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white active:bg-rose-700 border border-rose-200 hover:border-rose-600 rounded-lg disabled:opacity-40 transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                      >
                        <XCircle size={14} className="stroke-[2.5]" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {paginatedData.map(d => (
          <div key={d._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-slate-800">{d.donor?.name || "N/A"}</p>
              <span className="text-green-600 font-bold text-lg">₹{d.amount}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Collected by: <span className="font-medium text-slate-700">{d.collectedBy?.name}</span> ({d.collectedBy?.role})
            </p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-sm text-slate-600">
              <span className="font-medium">{monthNames[d.month - 1]} {d.year}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Pending
              </span>
            </div>
            <div className="flex gap-2.5 mt-4">
              <button
                disabled={loadingId !== null}
                onClick={() => approveDonation(d._id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl disabled:opacity-50 transition-all duration-200 shadow active:scale-95 cursor-pointer"
              >
                <CheckCircle size={16} className="stroke-[2.5]" />
                {loadingId === d._id ? "Approve..." : "Approve"}
              </button>
              <button
                disabled={loadingId !== null}
                onClick={() => { setSelectedDonation(d); setRejectModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl disabled:opacity-50 transition-all duration-200 shadow active:scale-95 cursor-pointer"
              >
                <XCircle size={16} className="stroke-[2.5]" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages >= 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-3 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-3 rounded-2xl bg-white border border-gray-150 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ChevronLeft size={18} className="stroke-[2.5]" />
          </button>
          
          <div className="px-5 py-2 rounded-full border border-slate-100/80 bg-slate-50/40 text-sky-700/90 font-bold text-xs tracking-wider uppercase shadow-sm">
            PAGE {page} OF {totalPages || 1}
          </div>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="p-3 rounded-2xl bg-white border border-gray-150 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ChevronRight size={18} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* ================= REJECT CONFIRMATION MODAL ================= */}
      {rejectModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-lg rounded-[2rem] p-8 shadow-2xl max-w-sm w-full mx-4 border border-white/20 flex flex-col items-center text-center transform scale-100 transition-all duration-300 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top color stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 to-red-600"></div>

            {modalState === "idle" && (
              <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-200">
                {/* Warning Icon */}
                <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                  <AlertTriangle size={32} className="stroke-[2.25]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight mb-2">Reject Donation?</h3>

                {/* Description */}
                <p className="text-sm text-slate-505 leading-relaxed mb-6">
                  Are you sure you want to reject the donation of <span className="font-extrabold text-slate-700">₹{selectedDonation.amount}</span> from <span className="font-extrabold text-slate-700">{selectedDonation.donor?.name || "N/A"}</span>? This action cannot be undone.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => { setRejectModalOpen(false); setSelectedDonation(null); }}
                    className="flex-1 py-3 text-sm font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmRejection(selectedDonation._id)}
                    className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 shadow-lg shadow-rose-600/25 hover:shadow-rose-600/35 rounded-2xl transition-all duration-200 cursor-pointer"
                  >
                    Yes, Reject
                  </button>
                </div>
              </div>
            )}

            {modalState === "processing" && (
              <div className="flex flex-col items-center justify-center py-6 w-full animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-rose-600 animate-spin mb-4"></div>
                <p className="text-sm font-bold text-slate-700">Rejecting Donation...</p>
                <p className="text-xs text-slate-400 mt-1">Updating records...</p>
              </div>
            )}

            {modalState === "success" && (
              <div className="flex flex-col items-center justify-center py-6 w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-rose-100 border border-rose-200 rounded-full flex items-center justify-center text-rose-600 mb-4 scale-110 duration-500">
                  <XCircle size={36} className="stroke-[2.25]" />
                </div>
                <p className="text-lg font-extrabold text-slate-800">Donation Rejected</p>
                <p className="text-xs text-slate-500 mt-1">The transaction has been cancelled.</p>
              </div>
            )}

            {modalState === "error" && (
              <div className="flex flex-col items-center justify-center py-6 w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 mb-4">
                  <AlertTriangle size={36} className="stroke-[2.25]" />
                </div>
                <p className="text-lg font-bold text-slate-800">Operation Failed</p>
                <p className="text-xs text-slate-505 mt-1">Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDonations;
