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
  Filter,
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
    return <div className="min-h-screen bg-white p-6 text-slate-500 font-bold">Loading fund summary...</div>;
  }

  if (!funds.length) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div 
          className="p-8 text-center text-rose-600 font-extrabold rounded-3xl w-full max-w-md border border-slate-200 shadow-md bg-white"
        >
          No fund data available
        </div>
      </div>
    );
  }

  // Clean Modern Styles
  const cardShadow = {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const innerSunken = {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-8 space-y-8 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER + FILTER */}
        <div className="flex flex-col items-center text-center sm:flex-row justify-between sm:items-center sm:text-left gap-4 px-2">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl font-extrabold text-slate-800 flex flex-col sm:flex-row items-center gap-2">
              <Coins className="text-cyan-600" />
              Fund Summary
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-semibold">Overview of budget allocations and remaining balance</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto justify-center">
            <div 
              className="p-2.5 rounded-full flex items-center justify-center border border-slate-200 shadow-sm bg-white"
            >
              <Filter size={18} className="text-slate-500" />
            </div>
            
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

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard
            icon={<Wallet size={22} className="text-cyan-600" />}
            label="Total Amount"
            value={grandTotal.total}
            color="text-cyan-600"
          />
          <SummaryCard
            icon={<TrendingDown size={22} className="text-rose-600" />}
            label="Used Amount"
            value={grandTotal.used}
            color="text-rose-600"
          />
          <SummaryCard
            icon={<Coins size={22} className="text-emerald-600" />}
            label="Remaining Amount"
            value={grandTotal.remaining}
            color={grandTotal.remaining > 0 ? "text-emerald-600" : "text-slate-500"}
          />
        </div>

        {/* FUND DETAILS */}
        <div className="rounded-3xl p-8 space-y-6" style={cardShadow}>
          <h3 className="text-slate-700 font-extrabold text-lg mb-2">Fund Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {paginatedFunds.map((fund) => (
              <div
                key={fund._id}
                className="flex justify-between items-center p-6 rounded-2xl transition duration-300 border border-slate-255/15 shadow-sm bg-white"
              >
                <div>
                  <p className="text-slate-800 font-extrabold text-base">{fund.title}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-2 font-bold">
                    <Calendar size={13} className="text-slate-400" />
                    {monthNames[fund.month - 1]} {fund.year}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-cyan-600 font-black text-lg">
                    ₹{fund.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-rose-500 text-xs font-bold">
                    Used ₹{fund.usedAmount.toLocaleString()}
                  </p>
                  <div className="pt-1.5">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-black border transition duration-300`}
                      style={
                        fund.remainingAmount > 0
                          ? {
                              boxShadow: "inset 2px 2px 4px #b0c9bb, inset -2px -2px 4px #ffffff",
                              backgroundColor: "#e6f4ea",
                              color: "#137333",
                              borderColor: "#ceead6"
                            }
                          : {
                              boxShadow: "inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff",
                              backgroundColor: "#f1f3f4",
                              color: "#5f6368",
                              borderColor: "#e8eaed"
                            }
                      }
                    >
                      Remaining ₹{fund.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-4 mt-8 pt-2">
              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                icon={<ChevronLeft size={18} />}
              />
              <span className="text-sm text-slate-600 font-bold px-1">
                Page {page} of {totalPages}
              </span>
              <PaginationButton
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                icon={<ChevronRight size={18} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* NEUMORPHIC SELECT COMPONENT */
const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      rounded-2xl px-4 py-3 text-sm text-slate-700 font-bold outline-none
      cursor-pointer transition duration-300 border border-slate-300 bg-white w-36 sm:w-40"
  >
    {children}
  </select>
);

/* NEUMORPHIC SUMMARY CARD */
const SummaryCard = ({ icon, label, value, color }) => (
  <div 
    className="rounded-3xl p-6 transition duration-300 flex items-center gap-5 border border-slate-200 shadow-sm bg-white"
  >
    <div 
      className="p-4 rounded-full border border-slate-100 bg-slate-50"
    >
      {icon}
    </div>
    <div>
      <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</span>
      <p className={`text-2xl font-black ${color} mt-0.5`}>
        ₹{Number(value).toLocaleString()}
      </p>
    </div>
  </div>
);

/* NEUMORPHIC PAGINATION BUTTON */
const PaginationButton = ({ icon, disabled, onClick }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="p-3 rounded-2xl text-slate-700 transition duration-300 disabled:opacity-40"
      style={
        pressed
          ? { backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }
          : { backgroundColor: "#ffffff", border: "1px solid #cbd5e1" }
      }
    >
      {icon}
    </button>
  );
};

export default FundSummary;
