"use client";
import { useEffect, useState, useMemo } from "react";
import { getFundSummaryAPI, createFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import {
  Wallet,
  TrendingDown,
  Coins,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
  Landmark,
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

  /* MODAL STATE */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalAmount: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  /* FETCH DATA */
  const fetchFunds = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateFund = async (e) => {
    e.preventDefault();
    if (!form.title || !form.year || !form.month || !form.totalAmount) {
      toast.error("All fields are required");
      return;
    }

    try {
      setCreateLoading(true);
      const res = await createFundAPI({
        title: form.title,
        year: Number(form.year),
        month: Number(form.month),
        totalAmount: Number(form.totalAmount),
      });

      if (res.data?.success) {
        toast.success("🎉 Fund created successfully!");
        setShowCreateModal(false);
        setForm({
          title: "",
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          totalAmount: "",
        });
        await fetchFunds();
      } else {
        toast.error(res.data?.message || "Failed to create fund");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create fund");
    } finally {
      setCreateLoading(false);
    }
  };

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
  if (loading && !funds.length) {
    return <div className="min-h-screen bg-white p-6 text-slate-500 font-bold">Loading fund summary...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER + FILTER + CREATE BUTTON */}
        <div className="flex flex-col items-center text-center sm:flex-row justify-between sm:items-center sm:text-left gap-4 px-1">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Coins className="text-teal-600" size={22} />
              Fund Summary
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Overview of budget allocations and remaining balance</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Filter size={13} />
              <span className="font-medium">Filter</span>
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

            {/* CREATE FUND BUTTON */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Fund</span>
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SummaryCard
            icon={<Wallet size={20} />}
            label="Total Amount"
            value={grandTotal.total}
            accentColor="primary"
          />
          <SummaryCard
            icon={<TrendingDown size={20} />}
            label="Used Amount"
            value={grandTotal.used}
            accentColor="rose"
          />
          <SummaryCard
            icon={<Coins size={20} />}
            label="Remaining Amount"
            value={grandTotal.remaining}
            accentColor="emerald"
          />
        </div>

        {/* FUND DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 px-1">
            <h3 className="text-slate-850 font-bold text-base">Fund Details</h3>
            <span className="text-xs font-medium text-slate-400">
              Showing {paginatedFunds.length} of {filteredFunds.length} entries
            </span>
          </div>

          {paginatedFunds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginatedFunds.map((fund) => {
                const percentUsed = fund.totalAmount > 0 
                  ? Math.min(100, Math.round((fund.usedAmount / fund.totalAmount) * 100)) 
                  : 0;
                
                return (
                  <div
                    key={fund._id || fund.id}
                    className="p-5 rounded-xl border border-slate-200/50 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-slate-800 font-medium text-sm tracking-tight">{fund.title}</h4>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-1.5 font-medium">
                          <Calendar size={12} />
                          {monthNames[fund.month - 1]} {fund.year}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
                        fund.remainingAmount > 0 
                          ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100/80' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          fund.remainingAmount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`} />
                        {fund.remainingAmount > 0 ? 'Active' : 'Depleted'}
                      </span>
                    </div>

                    {/* Sleek Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Usage</span>
                        <span className="font-medium text-slate-600">{percentUsed}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            percentUsed > 90 
                              ? 'bg-gradient-to-r from-rose-500 to-red-500' 
                              : percentUsed > 75 
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                              : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                          }`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget breakdown grid */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <p className="text-slate-400 font-medium">Budget</p>
                        <p className="text-slate-700 font-medium mt-0.5">₹{fund.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Used</p>
                        <p className="text-slate-700 font-medium mt-0.5">₹{fund.usedAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 font-medium">Remaining</p>
                        <p className={`font-semibold mt-0.5 ${
                          fund.remainingAmount > 0 ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                          ₹{fund.remainingAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-xl bg-white space-y-3">
              <Coins size={36} className="text-slate-300" />
              <p className="text-slate-500 font-bold text-sm">No fund data available</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 bg-cyan-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-700 transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Create New Fund</span>
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-3 mt-6 pt-2">
              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                icon={<ChevronLeft size={14} />}
              />
              <span className="text-xs text-slate-500 font-medium px-1">
                Page {page} of {totalPages}
              </span>
              <PaginationButton
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                icon={<ChevronRight size={14} />}
              />
            </div>
          )}
        </div>
      </div>

      {/* SLEEK CREATE FUND MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Create New Fund</h3>
                  <p className="text-xs text-slate-400 font-medium">Initialize a new monthly budget allocation</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateFund} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Fund Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Medical Relief Fund"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 outline-none text-xs font-semibold text-slate-800 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none text-xs font-semibold text-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Month <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none text-xs font-semibold text-slate-800 transition cursor-pointer"
                  >
                    {monthNames.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Total Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleFormChange}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none text-xs font-semibold text-slate-800 transition"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {createLoading ? "Creating..." : "Create Fund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* CLEAN SELECT COMPONENT */
const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium outline-none
      cursor-pointer border border-slate-200 bg-white hover:bg-slate-50/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-150 w-full sm:w-36"
  >
    {children}
  </select>
);

/* CLEAN SUMMARY CARD */
const SummaryCard = ({ icon, label, value, accentColor }) => {
  const colorMap = {
    primary: {
      bg: "bg-gradient-to-br from-teal-50 to-cyan-50/30",
      text: "text-teal-600 border-teal-100/70",
      valText: "text-slate-800"
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-50 to-orange-50/30",
      text: "text-rose-600 border-rose-100/70",
      valText: "text-rose-600"
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/30",
      text: "text-emerald-600 border-emerald-100/70",
      valText: "text-emerald-600"
    }
  };

  const style = colorMap[accentColor] || colorMap.primary;

  return (
    <div className="group rounded-xl p-5 flex items-center gap-4 border border-slate-200/50 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className={`p-3 rounded-lg border ${style.bg} ${style.text} group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{label}</span>
        <p className={`text-xl font-semibold mt-1 tracking-tight ${style.valText}`}>
          ₹{Number(value).toLocaleString()}
        </p>
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

export default FundSummary;
