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

import { useSidebarColor } from "../../../../hooks/useSidebarColor";

const MonthlyDonationTable = () => {
  const sidebarColor = useSidebarColor();
  const getAvatarUrl = (userObj) => {
    if (userObj?.profilePhoto?.url) {
      if (userObj.profilePhoto.url.includes("ui-avatars.com")) {
        return userObj.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`);
      }
      return userObj.profilePhoto.url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj?.name || "User")}&background=${sidebarColor}&color=fff`;
  };
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

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-1">
          <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-primary flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              Monthly Donation Table
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Consolidated view of monthly budgets allocations</p>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="rounded-xl p-4 sm:p-5 border border-slate-200/50 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">

            {/* SEARCH */}
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or mobile..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none placeholder:text-slate-400 font-medium text-xs transition-colors bg-white"
              />
            </div>

            {/* YEAR */}
            <div className="relative w-full md:w-auto flex-1">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={year}
                onChange={(e) => {
                  setPage(1);
                  setYear(Number(e.target.value));
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none cursor-pointer font-medium text-xs transition-colors bg-white"
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
              className="w-full md:w-auto flex-1 px-3 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none cursor-pointer font-medium text-xs transition-colors bg-white"
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
              className="w-full md:w-auto flex-1 px-3 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none cursor-pointer font-medium text-xs transition-colors bg-white"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="rounded-xl space-y-6 border border-slate-200/50 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto pb-1">
            <table className="min-w-full text-left text-slate-800 border-collapse">
              <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 sticky left-0 bg-[var(--sidebar-via)] text-white z-10 font-semibold border-b border-slate-200/10">Donor Details</th>
                  {visibleMonths.map((m) => (
                    <th key={m.key} className="py-3 px-3 text-center font-semibold border-b border-slate-200/10">
                      {m.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right bg-[var(--sidebar-to)] text-white font-semibold border-b border-slate-200/10">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleMonths.length + 2}
                      className="p-8 text-center text-slate-400 font-medium text-xs"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  rows.map((u, i) => {
                    const total = calculateTotal(u);

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* USER */}
                        <td className="py-3.5 px-4 sticky left-0 bg-white group-hover:bg-slate-50/60 z-10 transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={getAvatarUrl(u)}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200/60"
                            />
                            <div>
                              <div className="font-semibold text-slate-700 text-xs tracking-wide uppercase whitespace-nowrap">{u.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{u.mobile}</div>
                            </div>
                          </div>
                        </td>

                        {/* MONTHS */}
                        {visibleMonths.map((m) => (
                          <td
                            key={m.key}
                            className={`py-3.5 px-3 text-center text-xs ${
                              u[m.key] > 0
                                ? "text-emerald-600 font-semibold"
                                : "text-slate-400 font-medium"
                            }`}
                          >
                            {u[m.key] > 0 ? `₹${u[m.key].toLocaleString("en-IN")}` : "-"}
                          </td>
                        ))}

                        {/* TOTAL */}
                        <td className="py-3.5 px-4 font-semibold text-right text-xs text-primary bg-white group-hover:bg-slate-50/60 transition-colors">
                          ₹{total.toLocaleString("en-IN")}
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
            <div className="flex justify-end items-center gap-3 pb-5 px-5 sm:pb-6 sm:px-6">
              <PaginationButton
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                icon={<ChevronLeft size={14} />}
              />

              <span className="text-xs text-slate-500 font-medium px-1">
                Page {page} of {pages}
              </span>

              <PaginationButton
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                icon={<ChevronRight size={14} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* CLEAN PAGINATION BUTTON */
const PaginationButton = ({ icon, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="p-1.5 rounded-lg text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

export default MonthlyDonationTable;
