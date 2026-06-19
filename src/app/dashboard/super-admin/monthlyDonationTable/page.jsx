"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { getMonthlyDonationTableAPI } from "../../../../api/donation.api";
import FullScreenLoader from "../../../../components/common/FullScreenLoader";

/* ================= MONTHS ================= */
const months = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

const currentMonthKey = months[new Date().getMonth()].key;
const currentYear = new Date().getFullYear();

const MonthlyDonationTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTERS ================= */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // ✅ debounce
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthKey);
  const [paymentStatus, setPaymentStatus] = useState("ALL");
  const [availableYears, setAvailableYears] = useState([]);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500); // 500ms wait after typing stops

    return () => clearTimeout(handler);
  }, [search]);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getMonthlyDonationTableAPI({
        page,
        limit: 10,
        year,
        month,
        search: debouncedSearch,
        paymentStatus,
      });

      setRows(res?.data || []);
      setAvailableYears(res?.availableYears || []);
      setPages(res?.pagination?.pages || 1);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, year, month, debouncedSearch, paymentStatus]);

  /* ================= MONTHS TO SHOW ================= */
  const visibleMonths = useMemo(() => {
    if (month === "ALL") return months;
    return months.filter((m) => m.key === month);
  }, [month]);

  /* ================= TOTAL CALC ================= */
  const calculateTotal = (user) => {
    return visibleMonths.reduce((sum, m) => {
      return sum + (user[m.key] || 0);
    }, 0);
  };

  /* ================= LOADER ================= */
  if (loading && rows.length === 0) {
    return <FullScreenLoader text="Loading monthly donations..." />;
  }

  return (
    <div className="p-0 sm:p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800">
        <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 shadow-sm">
          <BarChart3 size={20} className="text-cyan-600" />
        </span>
        Monthly Donation Table
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center">

          {/* SEARCH */}
          <div className="relative flex-1 w-full">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or mobile..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none"
            />
          </div>

          {/* YEAR */}
          <div className="relative w-full sm:w-auto">
            <Calendar
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={year}
              onChange={(e) => {
                setPage(1);
                setYear(Number(e.target.value));
              }}
              className="w-full sm:w-auto pl-12 pr-4 py-3 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none cursor-pointer"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH */}
          <select
            value={month}
            onChange={(e) => {
              setPage(1);
              setMonth(e.target.value);
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none cursor-pointer"
          >
            <option value="ALL">All Months</option>
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>

          {/* PAYMENT STATUS */}
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPage(1);
              setPaymentStatus(e.target.value);
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white text-slate-800 border border-gray-300 focus:ring-2 focus:ring-cyan-500 shadow-sm transition outline-none cursor-pointer"
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="min-w-full text-left text-slate-800">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-200">
              <tr>
                <th className="px-6 py-6 sticky left-0 bg-slate-50 z-10 w-16 text-center">#</th>
                <th className="px-6 py-6 sticky left-0 bg-slate-50 z-10">Donor Details</th>
                {visibleMonths.map((m) => (
                  <th key={m.key} className="px-3 py-6 text-center">
                    {m.label}
                  </th>
                ))}
                <th className="px-8 py-6 text-right bg-slate-50/50">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleMonths.length + 3}
                    className="p-8 text-center text-slate-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                rows.map((u, i) => {
                  const total = calculateTotal(u);

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* INDEX */}
                      <td className="px-6 py-5 sticky left-0 bg-white group-hover:bg-slate-50 font-black text-slate-600 text-lg text-center z-10">
                        {i + 1 + (page - 1) * 10}
                      </td>

                      {/* USER */}
                      <td className="px-6 py-5 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.profilePhoto?.url ||
                              "https://via.placeholder.com/40?text=User"
                            }
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-black text-slate-700 text-sm tracking-wide uppercase">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{u.mobile}</div>
                          </div>
                        </div>
                      </td>

                      {/* MONTHS */}
                      {visibleMonths.map((m) => (
                        <td
                          key={m.key}
                          className={`px-3 py-5 text-center text-[13px] ${
                            u[m.key] > 0
                              ? "text-emerald-500 font-bold"
                              : "text-slate-500 font-medium"
                          }`}
                        >
                          {u[m.key] > 0 ? `₹${u[m.key]}` : "-"}
                        </td>
                      ))}

                      {/* TOTAL */}
                      <td className={`px-8 py-5 font-black text-right text-lg text-emerald-600 bg-slate-50/30 group-hover:bg-slate-50`}>
                        RS. {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {pages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-slate-600 text-sm font-medium flex items-center">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyDonationTable;
