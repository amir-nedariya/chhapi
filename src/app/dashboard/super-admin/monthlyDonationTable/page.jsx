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

  // Neumorphic button states
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);

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

  // Neumorphic Shadows styles
  const cardShadow = {
    boxShadow: "9px 9px 16px #b8c4d9, -9px -9px 16px #ffffff",
    backgroundColor: "#ecf0f3",
  };

  const inputShadow = {
    boxShadow: "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
    backgroundColor: "#ecf0f3",
    border: "none",
  };

  const headerIconShadow = {
    boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff",
    backgroundColor: "#ecf0f3",
  };

  const prevButtonShadow = prevPressed
    ? { boxShadow: "inset 3px 3px 6px #b8c4d9, inset -3px -3px 6px #ffffff", backgroundColor: "#ecf0f3" }
    : { boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff", backgroundColor: "#ecf0f3" };

  const nextButtonShadow = nextPressed
    ? { boxShadow: "inset 3px 3px 6px #b8c4d9, inset -3px -3px 6px #ffffff", backgroundColor: "#ecf0f3" }
    : { boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff", backgroundColor: "#ecf0f3" };

  /* ================= LOADER ================= */
  if (loading && rows.length === 0) {
    return <FullScreenLoader text="Loading monthly donations..." />;
  }

  return (
    <div className="min-h-screen w-full bg-[#ecf0f3] p-1 sm:p-8 space-y-8 flex flex-col justify-start font-sans text-slate-800">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 px-2">
        <div 
          className="p-3.5 rounded-full flex items-center justify-center transition-all duration-300"
          style={headerIconShadow}
        >
          <BarChart3 className="text-cyan-600 animate-pulse" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Monthly Donation Table
          </h2>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Consolidated view of monthly budgets allocations</p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div 
        className="rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">

          {/* SEARCH */}
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or mobile..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none placeholder:text-gray-400 font-semibold text-sm transition-all"
              style={inputShadow}
            />
          </div>

          {/* YEAR */}
          <div className="relative w-full md:w-auto flex-1">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={year}
              onChange={(e) => {
                setPage(1);
                setYear(Number(e.target.value));
              }}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
              style={inputShadow}
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
            className="w-full md:w-auto flex-1 px-4 py-3.5 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
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
            className="w-full md:w-auto flex-1 px-4 py-3.5 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div 
        className="rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="min-w-full text-left text-slate-800 border-collapse">
            <thead>
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-300/40">
                <th className="pb-4 px-4 sticky left-0 bg-[#ecf0f3] z-10 w-16 text-center">#</th>
                <th className="pb-4 px-4 sticky left-0 bg-[#ecf0f3] z-10">Donor Details</th>
                {visibleMonths.map((m) => (
                  <th key={m.key} className="pb-4 px-3 text-center">
                    {m.label}
                  </th>
                ))}
                <th className="pb-4 px-4 text-right bg-[#ecf0f3]">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-350/20">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleMonths.length + 3}
                    className="p-8 text-center text-slate-500 font-bold"
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
                      className="hover:bg-[#e4ebf0] transition-colors group"
                    >
                      {/* INDEX */}
                      <td className="py-4 px-4 sticky left-0 bg-[#ecf0f3] group-hover:bg-[#e4ebf0] font-bold text-slate-500 text-sm text-center z-10">
                        {i + 1 + (page - 1) * 10}
                      </td>

                      {/* USER */}
                      <td className="py-4 px-4 sticky left-0 bg-[#ecf0f3] group-hover:bg-[#e4ebf0] z-10">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.profilePhoto?.url ||
                              "https://via.placeholder.com/40?text=User"
                            }
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-300/40"
                          />
                          <div>
                            <div className="font-bold text-slate-800 text-sm tracking-wide uppercase">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{u.mobile}</div>
                          </div>
                        </div>
                      </td>

                      {/* MONTHS */}
                      {visibleMonths.map((m) => (
                        <td
                          key={m.key}
                          className={`py-4 px-3 text-center text-[13px] ${
                            u[m.key] > 0
                              ? "text-emerald-500 font-bold"
                              : "text-slate-500 font-medium"
                          }`}
                        >
                          {u[m.key] > 0 ? `₹${u[m.key].toLocaleString("en-IN")}` : "-"}
                        </td>
                      ))}

                      {/* TOTAL */}
                      <td className="py-4 px-4 font-extrabold text-right text-base text-cyan-600 bg-[#ecf0f3] group-hover:bg-[#e4ebf0]">
                        ₹{total.toLocaleString("en-IN")}
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
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            onMouseDown={() => setPrevPressed(true)}
            onMouseUp={() => setPrevPressed(false)}
            onMouseLeave={() => setPrevPressed(false)}
            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-850 active:scale-95 disabled:opacity-40 disabled:hover:text-slate-600 disabled:active:scale-100 transition-all cursor-pointer"
            style={prevButtonShadow}
          >
            <ChevronLeft size={20} />
          </button>

          <span 
            className="text-slate-750 text-sm font-bold px-4 py-2.5 rounded-2xl flex items-center"
            style={inputShadow}
          >
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            onMouseDown={() => setNextPressed(true)}
            onMouseUp={() => setNextPressed(false)}
            onMouseLeave={() => setNextPressed(false)}
            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-850 active:scale-95 disabled:opacity-40 disabled:hover:text-slate-600 disabled:active:scale-100 transition-all cursor-pointer"
            style={nextButtonShadow}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyDonationTable;
