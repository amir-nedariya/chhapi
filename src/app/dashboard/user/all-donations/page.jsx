"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllDonationsAPI } from "../../../../api/donation.api";
import { FileText, ChevronLeft, ChevronRight, Search } from "lucide-react";

/* ================= STYLES ================= */
const statusStyles = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40",
  APPROVED: "bg-green-500/20 text-green-300 border border-green-400/40",
};

const amountStyles = {
  PENDING: "text-yellow-300",
  APPROVED: "text-green-400 font-semibold",
};

/* ================= MONTHS ================= */
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEMS_PER_PAGE = 10;

/* ================= LOADER ================= */
const TableLoader = ({ text = "Loading..." }) => (
  <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
    <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
    <p className="text-sm text-white/60">{text}</p>
  </div>
);

const AllDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await getAllDonationsAPI();
      setDonations(res.data.data || []);
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  /* ================= YEARS ================= */
  const years = useMemo(() => {
    return [...new Set(donations.map(d => d.year))].sort((a, b) => b - a);
  }, [donations]);

  /* ================= FILTER ================= */
  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchesMonthYear = d.month === filterMonth && d.year === filterYear;
      const matchesSearch = d.donor?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return matchesMonthYear && matchesSearch;
    });
  }, [donations, filterMonth, filterYear, search]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedData = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-1 sm:p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
        <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
          <FileText size={20} className="text-cyan-400" />
        </span>
        All Donations
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/5 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">

        {/* SEARCH */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-white/40" />
          <input
            type="text"
            placeholder="Search donor name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* MONTH + YEAR */}
        <div className="flex gap-3 flex-1">
          <select
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(Number(e.target.value));
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => {
              setFilterYear(Number(e.target.value));
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* CURRENT MONTH */}
        <button
          onClick={() => {
            setFilterMonth(now.getMonth() + 1);
            setFilterYear(now.getFullYear());
            setPage(1);
          }}
          className="px-5 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-600/30 transition"
        >
          Current Month
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-xl">
        <table className="w-full text-sm text-white">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="p-4 text-left">Donor</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Collected By</th>
              <th className="p-4 text-left">Approved By</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-left">Month</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <TableLoader text="Loading donations..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-white/50">
                  No donations found
                </td>
              </tr>
            ) : (
              paginatedData.map((d) => (
                <tr key={d._id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="p-4 font-medium">{d.donor?.name || "N/A"}</td>
                  <td className={`p-4 text-right ${amountStyles[d.status]}`}>₹{d.amount}</td>
                  <td className="p-4">{d.collectedBy?.name || "-"}</td>
                  <td className="p-4">
                    {d.approvedBy?.name ? (
                      <>
                        <p className="font-medium">{d.approvedBy.name}</p>
                        <p className="text-xs text-white/40">
                          {new Date(d.approvedAt).toLocaleString()}
                        </p>
                      </>
                    ) : <span className="text-white/40">—</span>}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {months[d.month - 1]} {d.year}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      {loading && (
        <div className="md:hidden">
          <TableLoader text="Loading donations..." />
        </div>
      )}

      <div className="md:hidden space-y-4">
        {paginatedData.map((d) => (
          <div key={d._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
            <div className="flex justify-between">
              <p className="font-semibold text-white">{d.donor?.name}</p>
              <p className={`font-bold ${amountStyles[d.status]}`}>₹{d.amount}</p>
            </div>
            <p className="text-sm text-white/50 mt-1">
              Collected by: {d.collectedBy?.name || "-"}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className={`px-2 py-1 rounded text-xs ${statusStyles[d.status]}`}>
                {d.status}
              </span>
              <span className="text-sm text-white/70">
                {months[d.month - 1]} {d.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>
          <span className="text-white/70 text-sm">
            {page} / {totalPages}
          </span>
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

export default AllDonations;
