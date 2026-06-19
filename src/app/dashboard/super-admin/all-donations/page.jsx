"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllDonationsAPI } from "../../../../api/donation.api";
import { FileText, ChevronLeft, ChevronRight, Search } from "lucide-react";

/* ================= STYLES ================= */
const statusStyles = {
  PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium",
  APPROVED: "bg-green-50 text-green-700 border border-green-200 font-medium",
};

const amountStyles = {
  PENDING: "text-yellow-600 font-bold",
  APPROVED: "text-green-600 font-bold",
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
    <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
    <p className="text-sm text-slate-500">{text}</p>
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
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800">
        <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 shadow-sm">
          <FileText size={20} className="text-cyan-600" />
        </span>
        All Donations
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

        {/* SEARCH */}
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search donor name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm transition"
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none cursor-pointer"
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none cursor-pointer"
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
          className="px-5 py-2.5 rounded-xl font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition shadow-sm whitespace-nowrap"
        >
          Current Month
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm custom-scrollbar pb-2">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-slate-50 text-slate-600 border-b border-gray-200 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4 text-left">Donor</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Collected By</th>
              <th className="p-4 text-left">Approved By</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-left">Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <TableLoader text="Loading donations..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500">
                  No donations found
                </td>
              </tr>
            ) : (
              paginatedData.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 uppercase text-xs tracking-wide">{d.donor?.name || "N/A"}</td>
                  <td className={`p-4 text-right text-base ${amountStyles[d.status]}`}>₹{d.amount}</td>
                  <td className="p-4 font-medium text-slate-600">{d.collectedBy?.name || "-"}</td>
                  <td className="p-4">
                    {d.approvedBy?.name ? (
                      <>
                        <p className="font-medium text-slate-600">{d.approvedBy.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(d.approvedAt).toLocaleString()}
                        </p>
                      </>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
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
          <div key={d._id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
              <p className="font-bold text-slate-800 uppercase tracking-wide text-sm">{d.donor?.name}</p>
              <p className={`text-lg ${amountStyles[d.status]}`}>₹{d.amount}</p>
            </div>
            <p className="text-sm text-slate-600 mt-1 flex justify-between">
              <span className="text-slate-500">Collected by:</span>
              <span className="font-medium">{d.collectedBy?.name || "-"}</span>
            </p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className={`px-2.5 py-1 rounded-md text-xs ${statusStyles[d.status]}`}>
                {d.status}
              </span>
              <span className="text-sm font-medium text-slate-600">
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
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-slate-600 text-sm font-medium">
            Page {page} of {totalPages}
          </span>
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

export default AllDonations;
