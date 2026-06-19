"use client";
import { useEffect, useState, useMemo } from "react";
import { getFundSummaryAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import {
  Wallet,
  TrendingDown,
  Coins,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* MONTH NAMES */
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEMS_PER_PAGE = 6;

const FundSummary = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATE */
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");

  /* PAGINATION */
  const [page, setPage] = useState(1);

  /* FETCH DATA */
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await getFundSummaryAPI();
        if (res.data?.success && Array.isArray(res.data.data)) {
          setFunds(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load fund summary");
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, []);

  /* FILTERED + SORTED */
  const filteredFunds = useMemo(() => {
    return funds
      .filter((f) => {
        if (selectedYear !== "ALL" && f.year !== Number(selectedYear)) return false;
        if (selectedMonth !== "ALL" && f.month !== Number(selectedMonth)) return false;
        return true;
      })
      .sort((a, b) =>
        a.year !== b.year ? b.year - a.year : b.month - a.month
      );
  }, [funds, selectedYear, selectedMonth]);

  /* RESET PAGE ON FILTER */
  useEffect(() => {
    setPage(1);
  }, [selectedYear, selectedMonth]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredFunds.length / ITEMS_PER_PAGE);
  const paginatedFunds = filteredFunds.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* GRAND TOTAL */
  const grandTotal = useMemo(() => {
    return filteredFunds.reduce(
      (acc, f) => {
        acc.total += f.totalAmount || 0;
        acc.used += f.usedAmount || 0;
        acc.remaining += f.remainingAmount || 0;
        return acc;
      },
      { total: 0, used: 0, remaining: 0 }
    );
  }, [filteredFunds]);

  /* LOADING */
  if (loading) {
    return <div className="p-6 text-gray-400">Loading fund summary...</div>;
  }

  if (!funds.length) {
    return <div className="p-6 text-red-400">No fund data available</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER + FILTER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          Fund Summary
        </h2>

        <div className="flex gap-3">
          <FilterSelect value={selectedYear} onChange={setSelectedYear}>
            <option value="ALL">All Years</option>
            {[...new Set(funds.map(f => f.year))].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </FilterSelect>

          <FilterSelect value={selectedMonth} onChange={setSelectedMonth}>
            <option value="ALL">All Months</option>
            {monthNames.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </FilterSelect>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={<Wallet size={18} />}
          label="Total Amount"
          value={grandTotal.total}
          color="text-cyan-400"
        />
        <SummaryCard
          icon={<TrendingDown size={18} />}
          label="Used Amount"
          value={grandTotal.used}
          color="text-red-400"
        />
        <SummaryCard
          icon={<Coins size={18} />}
          label="Remaining Amount"
          value={grandTotal.remaining}
          color={
            grandTotal.remaining > 0
              ? "text-green-400"
              : "text-gray-400"
          }
        />
      </div>

      {/* FUND DETAILS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-medium mb-4">Fund Details</h3>

        <div className="space-y-4 text-sm">
          {paginatedFunds.map((fund) => (
            <div
              key={fund._id}
              className="flex justify-between items-center p-5 rounded-2xl
                bg-gradient-to-br from-white/5 to-white/0
                border border-white/10
                hover:border-cyan-400/30 transition"
            >
              <div>
                <p className="text-white font-semibold">{fund.title}</p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  {monthNames[fund.month - 1]} {fund.year}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-cyan-400 font-semibold">
                  ₹{fund.totalAmount.toLocaleString()}
                </p>
                <p className="text-red-400 text-xs">
                  Used ₹{fund.usedAmount.toLocaleString()}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      fund.remainingAmount > 0
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                >
                  Remaining ₹{fund.remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-3 mt-5">
            <PaginationButton
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              icon={<ChevronLeft size={16} />}
            />
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <PaginationButton
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              icon={<ChevronRight size={16} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* COMPONENTS */

const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      bg-[#020617] border border-white/10 rounded-xl
      px-4 py-2 text-sm text-gray-200
      focus:outline-none focus:ring-2 focus:ring-cyan-500/40
      hover:border-cyan-400/40 transition"
  >
    {children}
  </select>
);

const SummaryCard = ({ icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5
    hover:border-cyan-400/30 transition">
    <div className="flex items-center gap-3 text-gray-400 mb-2">
      {icon}
      {label}
    </div>
    <p className={`text-2xl font-bold ${color}`}>
      ₹{Number(value).toLocaleString()}
    </p>
  </div>
);

const PaginationButton = ({ icon, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="p-2 rounded-lg bg-white/5 border border-white/10
      disabled:opacity-40 hover:border-cyan-400/40 transition"
  >
    {icon}
  </button>
);

export default FundSummary;
