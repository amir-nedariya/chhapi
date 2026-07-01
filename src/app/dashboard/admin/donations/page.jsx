"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllDonationsAPI } from "../../../../api/donation.api";
import { FileText, ChevronLeft, ChevronRight, Search, Landmark, TrendingUp, Users, Clock } from "lucide-react";

/* ================= STYLES ================= */
const statusStyles = {
  PENDING: "bg-[#fff9db] text-[#f59e0b] border border-[#ffe066] font-semibold px-3.5 py-1 rounded-full text-xs shadow-xs",
  APPROVED: "bg-[#ebfbee] text-[#09c372] border border-[#b2f2bb] font-semibold px-3.5 py-1 rounded-full text-xs shadow-xs",
  SUCCESS: "bg-[#ebfbee] text-[#09c372] border border-[#b2f2bb] font-semibold px-3.5 py-1 rounded-full text-xs shadow-xs",
  FAILED: "bg-[#fff5f5] text-[#fa5252] border border-[#ffc9c9] font-semibold px-3.5 py-1 rounded-full text-xs shadow-xs",
};

const amountStyles = {
  PENDING: "text-[#f59e0b] font-bold text-[15px]",
  APPROVED: "text-[#09c372] font-bold text-[15px]",
  SUCCESS: "text-[#09c372] font-bold text-[15px]",
  FAILED: "text-[#fa5252] font-bold text-[15px]",
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
    <div className="w-10 h-10 border-4 border-slate-300 border-t-cyan-600 rounded-full animate-spin" />
    <p className="text-sm text-slate-500 font-semibold">{text}</p>
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

  // Neumorphic button press states
  const [currentMonthPressed, setCurrentMonthPressed] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);

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

  /* ================= METRICS CALCULATIONS ================= */
  const metrics = useMemo(() => {
    const approved = donations.filter(d => (d.status || "").toUpperCase() === "SUCCESS" || (d.status || "").toUpperCase() === "APPROVED");
    const pending = donations.filter(d => (d.status || "").toUpperCase() === "PENDING");
    
    const totalAmount = approved.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const uniqueDonors = new Set(donations.map(d => d.donor?.name?.toLowerCase() || d.donorName?.toLowerCase())).size;

    return {
      totalAmount,
      approvedCount: approved.length,
      pendingCount: pending.length,
      uniqueDonors
    };
  }, [donations]);

  // Clean Modern Styles
  const cardShadow = {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const inputShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
  };

  const headerIconShadow = {
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const currentMonthButtonShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const prevButtonShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const nextButtonShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  return (
    <div className="min-h-screen w-full bg-white p-1 sm:p-8 space-y-8 flex flex-col justify-start font-sans text-slate-800">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-2">
        <div 
          className="p-3.5 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
          style={headerIconShadow}
        >
          <FileText className="text-cyan-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            All Donations
          </h2>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Verify and track user donations ledger</p>
        </div>
      </div>

      {/* ================= METRICS CARDS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
        
        {/* TOTAL COLLECTED */}
        <div 
          style={cardShadow}
          className="rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
        >
          <div style={headerIconShadow} className="p-3.5 rounded-full flex items-center justify-center text-emerald-600">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Total Approved</p>
            <h4 className="text-slate-800 font-extrabold text-xl mt-0.5">
              ₹{metrics.totalAmount.toLocaleString("en-IN")}
            </h4>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div 
          style={cardShadow}
          className="rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
        >
          <div style={headerIconShadow} className="p-3.5 rounded-full flex items-center justify-center text-cyan-600">
            <Landmark size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Transactions</p>
            <h4 className="text-slate-800 font-extrabold text-xl mt-0.5">
              {donations.length} <span className="text-[11px] text-slate-400 font-medium">records</span>
            </h4>
          </div>
        </div>

        {/* PENDING APPROVALS */}
        <div 
          style={cardShadow}
          className="rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
        >
          <div style={headerIconShadow} className="p-3.5 rounded-full flex items-center justify-center text-amber-600">
            <Clock size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Pending Audit</p>
            <h4 className="text-slate-800 font-extrabold text-xl mt-0.5">
              {metrics.pendingCount} <span className="text-[11px] text-slate-400 font-medium">pending</span>
            </h4>
          </div>
        </div>

        {/* UNIQUE DONORS */}
        <div 
          style={cardShadow}
          className="rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
        >
          <div style={headerIconShadow} className="p-3.5 rounded-full flex items-center justify-center text-purple-600">
            <Users size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Unique Donors</p>
            <h4 className="text-slate-800 font-extrabold text-xl mt-0.5">
              {metrics.uniqueDonors} <span className="text-[11px] text-slate-400 font-medium">donors</span>
            </h4>
          </div>
        </div>

      </div>

      {/* ================= FILTER BAR ================= */}
      <div 
        className="flex flex-col md:flex-row md:items-center gap-4 rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        {/* SEARCH */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search donor name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-800 outline-none placeholder:text-gray-400 font-semibold text-sm transition-all"
            style={inputShadow}
          />
        </div>

        {/* MONTH + YEAR */}
        <div className="flex gap-4 flex-1 w-full">
          <select
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(Number(e.target.value));
              setPage(1);
            }}
            className="flex-1 px-4 py-3.5 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
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
            className="flex-1 px-4 py-3.5 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
          >
            {years.length === 0 ? (
              <option value={now.getFullYear()}>{now.getFullYear()}</option>
            ) : (
              years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))
            )}
          </select>
        </div>

        {/* CURRENT MONTH */}
        <button
          onClick={() => {
            setFilterMonth(now.getMonth() + 1);
            setFilterYear(now.getFullYear());
            setPage(1);
          }}
          onMouseDown={() => setCurrentMonthPressed(true)}
          onMouseUp={() => setCurrentMonthPressed(false)}
          onMouseLeave={() => setCurrentMonthPressed(false)}
          className="px-6 py-3.5 rounded-2xl font-bold text-cyan-600 transition-all active:scale-[0.99] whitespace-nowrap text-sm cursor-pointer"
          style={currentMonthButtonShadow}
        >
          Current Month
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div 
        className="hidden md:block overflow-hidden rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        <table className="w-full text-sm text-slate-800 border-collapse">
          <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white">
            <tr className="font-bold uppercase tracking-wider text-xs border-b border-teal-950/20">
              <th className="py-4 px-4 text-left">Donor</th>
              <th className="py-4 px-4 text-right">Amount</th>
              <th className="py-4 px-4 text-left">Collected By</th>
              <th className="py-4 px-4 text-left">Approved By</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-left">Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-350/20">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <TableLoader text="Loading donations database..." />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 font-bold">
                  No donations found
                </td>
              </tr>
            ) : (
              paginatedData.map((d) => (
                <tr key={d._id} className="hover:bg-[#e4ebf0] transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-800 text-[14px]">{d.donor?.name || "N/A"}</td>
                  <td className={`py-4 px-4 text-right ${amountStyles[(d.status || "").toUpperCase()] || "text-slate-800"}`}>
                    ₹{(Number(d.amount) || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-semibold">{d.collectedBy?.name || "-"}</td>
                  <td className="py-4 px-4">
                    {d.approvedBy?.name ? (
                      <>
                        <p className="font-bold text-slate-700">{d.approvedBy.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {new Date(d.approvedAt).toLocaleString()}
                        </p>
                      </>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[(d.status || "").toUpperCase()] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-semibold">
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

      <div className="md:hidden space-y-5">
        {paginatedData.map((d) => (
          <div 
            key={d._id} 
            className="rounded-3xl p-5 space-y-4"
            style={cardShadow}
          >
            <div className="flex justify-between items-center border-b border-slate-350/20 pb-3">
              <p className="font-bold text-slate-800 text-[14px]">{d.donor?.name}</p>
              <p className={`text-base ${amountStyles[(d.status || "").toUpperCase()] || "text-slate-800"}`}>
                ₹{(Number(d.amount) || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <p className="text-sm text-slate-600 flex justify-between">
              <span className="text-slate-400 font-semibold">Collected by:</span>
              <span className="font-bold text-slate-700">{d.collectedBy?.name || "-"}</span>
            </p>
            <div className="flex justify-between items-center pt-3 border-t border-slate-350/20">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[(d.status || "").toUpperCase()] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                {d.status}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {months[d.month - 1]} {d.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-4 py-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            onMouseDown={() => setPrevPressed(true)}
            onMouseUp={() => setPrevPressed(false)}
            onMouseLeave={() => setPrevPressed(false)}
            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-850 active:scale-95 disabled:opacity-40 disabled:hover:text-slate-600 disabled:active:scale-100 transition-all cursor-pointer"
            style={prevButtonShadow}
          >
            <ChevronLeft size={20} />
          </button>
          <span 
            className="text-slate-700 text-sm font-bold px-4 py-2.5 rounded-2xl"
            style={inputShadow}
          >
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
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

export default AllDonations;
