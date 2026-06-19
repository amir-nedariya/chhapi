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
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
        <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
          <BarChart3 size={20} className="text-cyan-400" />
        </span>
        Monthly Donation Table
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white/5 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center">

          {/* SEARCH */}
          <div className="relative flex-1 w-full">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or mobile..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:outline-none"
            />
          </div>

          {/* YEAR */}
          <div className="relative w-full sm:w-auto">
            <Calendar
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <select
              value={year}
              onChange={(e) => {
                setPage(1);
                setYear(Number(e.target.value));
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:outline-none"
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
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:outline-none"
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
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/5">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="p-4 text-left">User</th>
              {visibleMonths.map((m) => (
                <th key={m.key} className="p-4 text-right">
                  {m.label}
                </th>
              ))}
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleMonths.length + 2}
                  className="p-8 text-center text-white/50"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const total = calculateTotal(u);

                return (
                  <tr
                    key={u._id}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    {/* USER */}
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={
                          u.profilePhoto?.url ||
                          "https://via.placeholder.com/40?text=User"
                        }
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-white/50">{u.mobile}</p>
                      </div>
                    </td>

                    {/* MONTHS */}
                    {visibleMonths.map((m) => (
                      <td
                        key={m.key}
                        className={`p-4 text-right ${
                          u[m.key] > 0
                            ? "text-green-400 font-semibold"
                            : "text-white/60"
                        }`}
                      >
                        ₹{u[m.key] || 0}
                      </td>
                    ))}

                    {/* TOTAL */}
                    <td className="p-4 text-right font-bold text-cyan-400">
                      ₹{total}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {pages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-white/70 text-sm">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyDonationTable;
