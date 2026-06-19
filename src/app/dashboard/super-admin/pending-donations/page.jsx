"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  getPendingDonationsAPI,
  approveDonationAPI,
} from "../../../../api/donation.api";
import {
  CheckCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
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

  /* ================= APPROVE ================= */
  const approveDonation = async (id) => {
    try {
      setLoadingId(id);
      await approveDonationAPI(id);
      toast.success("✅ Donation approved");
      fetchPending();
    } catch {
      toast.error("❌ Approval failed");
    } finally {
      setLoadingId(null);
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
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
     <Clock size={22} className="text-cyan-400" />
      Pending Donations
     </h2>
      {/* <h2 className="text-xl sm:text-2xl font-semibold text-white">
        🕒 Pending Donations
      </h2> */}

      {/* ================= FILTERS ================= */}
      <div className="space-y-3">
        {/* Collector filter - top */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div className="flex items-center gap-2 flex-1">
            <Filter size={18} className="text-white/70" />
            <select
              value={selectedCollector}
              onChange={(e) => { setSelectedCollector(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400"
            >
              {collectors.map(name => (
                <option key={name} value={name} className="bg-[#0b1224]">{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Year & Month filters - second row */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400"
          >
            {years.map(y => (
              <option key={y} value={y} className="bg-[#0b1224]">
                {y === "ALL" ? "All Years" : y}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400"
          >
            {months.map(m => (
              <option key={m} value={m} className="bg-[#0b1224]">
                {m === "ALL" ? "All Months" : monthNames[m - 1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="p-4 text-left">Donor</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Collected By</th>
              <th className="p-4 text-center">Year</th>
              <th className="p-4 text-center">Month</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-white/50">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-white/50">No pending donations</td>
              </tr>
            ) : (
              paginatedData.map(d => (
                <tr key={d._id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="p-4 font-medium">{d.donor?.name || "N/A"}</td>
                  <td className="p-4 font-semibold text-green-400">₹{d.amount}</td>
                  <td className="p-4">{d.collectedBy?.name} <span className="text-xs text-white/50">({d.collectedBy?.role})</span></td>
                  <td className="p-4 text-center">{d.year}</td>
                  <td className="p-4 text-center">{monthNames[d.month - 1]}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">
                      PENDING
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      disabled={loadingId === d._id}
                      onClick={() => approveDonation(d._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      <CheckCircle size={16} />
                      {loadingId === d._id ? "Approving..." : "Approve"}
                    </button>
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
          <div key={d._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white">{d.donor?.name}</p>
              <span className="text-green-400 font-bold">₹{d.amount}</span>
            </div>
            <p className="text-sm text-white/50 mt-1">
              Collected by: {d.collectedBy?.name} ({d.collectedBy?.role})
            </p>
            <div className="flex justify-between mt-2 text-sm text-white/70">
              <span>{monthNames[d.month - 1]} {d.year}</span>
              <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                PENDING
              </span>
            </div>
            <button
              disabled={loadingId === d._id}
              onClick={() => approveDonation(d._id)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
              <CheckCircle size={16} />
              {loadingId === d._id ? "Approving..." : "Approve"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-3 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>
          <span className="text-white/70 text-sm">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingDonations;
