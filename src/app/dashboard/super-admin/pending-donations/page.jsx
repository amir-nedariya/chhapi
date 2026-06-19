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
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800">
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
          <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
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
                    <span className="px-2 py-1 text-xs font-semibold rounded border bg-yellow-50 text-yellow-700 border-yellow-200">
                      PENDING
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      disabled={loadingId === d._id}
                      onClick={() => approveDonation(d._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
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
          <div key={d._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-slate-800">{d.donor?.name || "N/A"}</p>
              <span className="text-green-600 font-bold text-lg">₹{d.amount}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Collected by: <span className="font-medium text-slate-700">{d.collectedBy?.name}</span> ({d.collectedBy?.role})
            </p>
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 text-sm text-slate-600">
              <span className="font-medium">{monthNames[d.month - 1]} {d.year}</span>
              <span className="px-2 py-1 rounded border bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold text-xs flex items-center">
                PENDING
              </span>
            </div>
            <button
              disabled={loadingId === d._id}
              onClick={() => approveDonation(d._id)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
            >
              <CheckCircle size={18} />
              {loadingId === d._id ? "Approving..." : "Approve Donation"}
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
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-slate-600 text-sm font-medium">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingDonations;
