"use client";
import { useEffect, useState } from "react";
import { getFundSummaryAPI, useFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { Landmark, IndianRupee, FileText, Folder } from "lucide-react";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";
import { useSidebarColor } from "../../../../hooks/useSidebarColor";

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
  const sidebarColor = useSidebarColor();

  const loadFunds = async () => {
    try {
      const res = await getFundSummaryAPI();
      setFunds(res?.data?.data || []);
      setPage(1);
    } catch (err) {
      toast.error("Failed to load funds");
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const toggleFund = (fund) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f._id === fund._id)
        ? prev.filter((f) => f._id !== fund._id)
        : [...prev, fund]
    );
  };

  const availableFunds = funds.filter(f => f.remainingAmount > 0);
  const totalPages = Math.ceil(availableFunds.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedFunds = availableFunds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const isAllSelected = paginatedFunds.length > 0 && paginatedFunds.every(f => selectedFunds.some(sf => sf._id === f._id));
  
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedFunds(prev => prev.filter(sf => !paginatedFunds.some(pf => pf._id === sf._id)));
    } else {
      setSelectedFunds(prev => {
        const newSelected = [...prev];
        paginatedFunds.forEach(pf => {
          if (!newSelected.some(sf => sf._id === pf._id)) {
            newSelected.push(pf);
          }
        });
        return newSelected;
      });
    }
  };

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

  const totalSelectedBalance = selectedFunds.reduce((sum, f) => sum + f.remainingAmount, 0);
  const amountExceeds = Number(amount) > totalSelectedBalance;

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleAll}
          disabled={loading}
          className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer accent-cyan-600"
        />
      ),
      align: "center",
      render: (_, fund) => (
        <input
          type="checkbox"
          checked={selectedFunds.some(f => f._id === fund._id)}
          onChange={() => toggleFund(fund)}
          disabled={loading}
          className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer accent-cyan-600"
        />
      )
    },
    {
      key: "title",
      header: "Fund Title",
      render: (_, fund) => {
        const isSelected = selectedFunds.some(f => f._id === fund._id);
        return (
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border transition ${
              isSelected 
                ? "bg-cyan-50 border-cyan-100 text-cyan-700" 
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              <Folder size={14} />
            </div>
            <span className={`font-bold text-xs uppercase tracking-wide transition ${
              isSelected ? "text-cyan-800" : "text-slate-750"
            }`}>{fund.title}</span>
          </div>
        );
      }
    },
    {
      key: "month",
      header: "Month",
      align: "center",
      render: (_, fund) => {
        const isSelected = selectedFunds.some(f => f._id === fund._id);
        return (
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border transition ${
            isSelected 
              ? "bg-cyan-50 border-cyan-100 text-cyan-600" 
              : "bg-slate-50 border-slate-100 text-slate-500"
          }`}>
            {monthNames[fund.month - 1]} {fund.year}
          </span>
        );
      }
    },
    {
      key: "remainingAmount",
      header: "Available Balance",
      align: "right",
      render: (_, fund) => {
        const isSelected = selectedFunds.some(f => f._id === fund._id);
        return (
          <span className={`font-extrabold text-xs transition ${
            isSelected ? "text-emerald-700 text-sm font-black" : "text-emerald-600"
          }`}>
            ₹{fund.remainingAmount.toLocaleString("en-IN")}
          </span>
        );
      }
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ '--theme-color': `#${sidebarColor}`, '--theme-color-light': `#${sidebarColor}20` }}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center" style={{ color: `#${sidebarColor}` }}>
            <Landmark size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Use Budget Fund
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Record an expense transaction from allocated funds</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Transaction Panel */}
        <div className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-slate-800 font-extrabold text-lg pb-3 border-b border-slate-100">
            Transaction Details
          </h3>
          
          {/* Selected Funds Summary Widget */}
          {selectedFunds.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-500 text-center text-xs space-y-1.5">
              <p className="font-bold text-slate-700">No funds selected</p>
              <p className="text-[10px] text-slate-400">Select one or more active funds from the table to distribute this transaction.</p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-slate-200/85 bg-slate-50/40 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Selected Funds Summary</span>
                <button 
                  type="button"
                  onClick={() => setSelectedFunds([])}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-bold uppercase transition hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-800">
                  ₹{totalSelectedBalance.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Available</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                {selectedFunds.map((fund) => (
                  <div 
                    key={fund._id} 
                    onClick={() => toggleFund(fund)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 shadow-3xs cursor-pointer hover:bg-rose-50 hover:text-rose-750 hover:border-rose-200 transition duration-150 group shrink-0"
                    title="Click to deselect"
                  >
                    <span className="max-w-[110px] truncate uppercase">{fund.title}</span>
                    <span className="text-slate-300 group-hover:text-rose-350">|</span>
                    <span className="text-slate-500 group-hover:text-rose-700">₹{fund.remainingAmount.toLocaleString("en-IN")}</span>
                    <span className="text-slate-450 group-hover:text-rose-600 font-black">×</span>
                  </div>
                ))}
              </div>
              
              {/* Limit feedback */}
              {amount && (
                <div className={`flex items-start gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 ${
                  amountExceeds 
                    ? "bg-rose-50/50 border-rose-200/50 text-rose-700" 
                    : "bg-emerald-50/50 border-emerald-200/50 text-emerald-700"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1 animate-pulse" style={{ backgroundColor: amountExceeds ? '#ef4444' : '#10b981' }}></span>
                  <span className="leading-normal">
                    {amountExceeds 
                      ? "Limit exceeded! Please select additional funds from the list to cover this transaction."
                      : `Fits budget (Remaining: ₹${(totalSelectedBalance - Number(amount)).toLocaleString("en-IN")})`
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none">
                  <IndianRupee size={15} />
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[var(--theme-color)] focus:ring-4 focus:ring-[var(--theme-color-light)] outline-none bg-slate-50/40 focus:bg-white hover:bg-slate-50/80 font-bold text-slate-800 transition"
                  placeholder="e.g., 500"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Usage Note / Remarks <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center pointer-events-none">
                  <FileText size={15} />
                </span>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[var(--theme-color)] focus:ring-4 focus:ring-[var(--theme-color-light)] outline-none bg-slate-50/40 focus:bg-white hover:bg-slate-50/80 font-semibold text-slate-800 transition placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="e.g., Medicine Purchase"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button
                variant="solid"
                type="submit"
                loading={loading}
                className="w-full justify-center py-3.5 font-bold uppercase tracking-wider text-xs rounded-xl shadow-xs transition duration-300"
              >
                {loading ? "Processing..." : "Submit Transaction"}
              </Button>
            </div>
          </form>
        </div>

        {/* Table Column */}
        <div className="lg:col-span-2">
          <Table 
            columns={columns}
            data={paginatedFunds}
            isLoading={loading}
            pagination={{
              currentPage: page,
              totalPages: totalPages,
              totalItems: availableFunds.length,
              itemsPerPage: ITEMS_PER_PAGE,
              onPageChange: setPage
            }}
            emptyStateProps={{
              entityName: "Active Funds",
              entityIcon: "Landmark"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UseFund;
