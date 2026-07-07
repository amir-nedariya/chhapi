"use client";
import { useEffect, useState } from "react";
import { getFundSummaryAPI, useFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Coins, Landmark } from "lucide-react";

const ITEMS_PER_PAGE = 12;

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const UseFund = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [buttonPressed, setButtonPressed] = useState(false);

  /* ================= LOAD FUNDS ================= */
  const loadFunds = async () => {
    try {
      const res = await getFundSummaryAPI();
      setFunds(res?.data?.data || []);
      setPage(1); // ✅ reset pagination
    } catch (err) {
      toast.error("Failed to load funds");
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  /* ================= TOGGLE FUND ================= */
  const toggleFund = (fund) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f._id === fund._id)
        ? prev.filter((f) => f._id !== fund._id)
        : [...prev, fund]
    );
  };

  /* ================= PAGINATION ================= */
  const availableFunds = funds.filter(f => f.remainingAmount > 0);
  const totalPages = Math.ceil(availableFunds.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const paginatedFunds = availableFunds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!selectedFunds.length) {
      toast.error("Select at least one fund");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    const totalAvailable = selectedFunds.reduce(
      (sum, f) => sum + f.remainingAmount,
      0
    );

    if (Number(amount) > totalAvailable) {
      toast.error("Selected funds balance insufficient");
      return;
    }

    let remaining = Number(amount);

    const usageList = [...selectedFunds]
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      )
      .map((fund) => {
        const used = Math.min(fund.remainingAmount, remaining);
        remaining -= used;
        return { fundId: fund._id, amount: used };
      })
      .filter(item => item.amount > 0);

    try {
      setLoading(true);

      const responses = await Promise.all(
        usageList.map(item =>
          useFundAPI({
            fundId: item.fundId,
            amount: item.amount,
            note: note.trim() || "—",
          })
        )
      );

      const allSuccess = responses.every(r => r.data?.success);

      if (allSuccess) {
        toast.success("Fund used successfully");
        setSelectedFunds([]);
        setAmount("");
        setNote("");
        await loadFunds();
      } else {
        toast.error("Some fund allocations failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Fund usage failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean Modern Styles
  const cardShadow = {
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03), 0 8px 10px -6px rgba(0,0,0,0.03)",
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
  };

  const inputShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
  };

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-2">
          <div 
            className="p-3.5 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm bg-white"
          >
            <Landmark className="text-cyan-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Use Budget Fund
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-semibold">Record an expense transaction from allocated funds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ================= USE FUND FORM ================= */}
          <div className="rounded-3xl p-6 lg:col-span-1 space-y-5" style={cardShadow}>
            <h3 className="text-slate-800 font-extrabold text-lg mb-2 border-b border-slate-100 pb-3">
              Transaction Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2 px-1">
                  Total Amount (₹) <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-gray-400 font-semibold"
                  style={inputShadow}
                  placeholder="e.g., 500"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2 px-1">
                  Usage Note / Remarks <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-gray-400 font-semibold"
                  style={inputShadow}
                  placeholder="e.g., Medicine Purchase"
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] hover:brightness-105 active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-md shadow-slate-900/10 cursor-pointer"
                >
                  {loading ? "Processing..." : "Submit Transaction"}
                </button>
              </div>
            </form>
          </div>

          {/* ================= SELECT FUNDS ================= */}
          <div className="rounded-3xl p-6 lg:col-span-2 space-y-5" style={cardShadow}>
            <h3 className="text-slate-800 font-extrabold text-lg mb-2 border-b border-slate-100 pb-3">
              Select Active Funds to Draw From
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/50 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-5 py-4 text-center w-20 rounded-l-2xl">Select</th>
                    <th className="px-5 py-4 text-left">Fund Title</th>
                    <th className="px-5 py-4 text-center">Month</th>
                    <th className="px-5 py-4 text-right rounded-r-2xl">Available Balance</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {paginatedFunds.map((fund) => {
                    const isSelected = selectedFunds.some(f => f._id === fund._id);
                    return (
                      <tr
                        key={fund._id}
                        className={`transition-colors hover:bg-slate-50/60 ${
                          isSelected ? "bg-slate-50/90 font-medium" : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFund(fund)}
                            disabled={loading}
                            className="w-4 h-4 rounded text-cyan-600 border-slate-300 focus:ring-cyan-500 cursor-pointer"
                          />
                        </td>

                        <td className="px-5 py-4 text-slate-700 font-bold uppercase text-xs">
                          {fund.title}
                        </td>

                        <td className="px-5 py-4 text-slate-500 text-center font-semibold text-xs">
                          {monthNames[fund.month - 1]} {fund.year}
                        </td>

                        <td className="px-5 py-4 text-right text-emerald-600 font-bold text-xs">
                          ₹{fund.remainingAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!paginatedFunds.length && (
                <div className="p-16 text-center text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  No active funds available. Please create a new fund first.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-3 mt-4">
                <PaginationButton
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  icon={<ChevronLeft size={15} />}
                />

                <span className="text-xs text-slate-500 font-bold px-2 py-1 bg-slate-50 rounded-lg border border-slate-200/50">
                  Page {page} of {totalPages}
                </span>

                <PaginationButton
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  icon={<ChevronRight size={15} />}
                />
              </div>
            )}
          </div>
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
    className="p-2 rounded-xl text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

export default UseFund;
