"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getMyDonationsAPI } from "../../../../api/donation.api";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  FileDown,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ITEMS_PER_PAGE = 10;

const statusStyles = {
  PENDING: "bg-[#fff9db] text-[#f59e0b] border border-[#ffe066] font-semibold px-3 py-1 rounded-full text-xs shadow-xs",
  APPROVED: "bg-[#ebfbee] text-[#09c372] border border-[#b2f2bb] font-semibold px-3 py-1 rounded-full text-xs shadow-xs",
  SUCCESS: "bg-[#ebfbee] text-[#09c372] border border-[#b2f2bb] font-semibold px-3 py-1 rounded-full text-xs shadow-xs",
  REJECTED: "bg-[#fff5f5] text-[#fa5252] border border-[#ffc9c9] font-semibold px-3 py-1 rounded-full text-xs shadow-xs",
  FAILED: "bg-[#fff5f5] text-[#fa5252] border border-[#ffc9c9] font-semibold px-3 py-1 rounded-full text-xs shadow-xs",
};

const amountStyles = {
  PENDING: "text-[#f59e0b] font-bold text-[15px]",
  APPROVED: "text-[#09c372] font-bold text-[15px]",
  SUCCESS: "text-[#09c372] font-bold text-[15px]",
  REJECTED: "text-[#fa5252] font-bold text-[15px]",
  FAILED: "text-[#fa5252] font-bold text-[15px]",
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const renderDate = (d) => {
  const rawDate = d.createdAt || d.date;
  if (!rawDate) return "—";
  const parsed = new Date(rawDate);
  return isNaN(parsed.getTime()) ? rawDate : parsed.toLocaleDateString("en-GB");
};

const currentYear = new Date().getFullYear();

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [month, setMonth] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [page, setPage] = useState(1);

  /* ===== FETCH ===== */
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await getMyDonationsAPI();
      setDonations(res?.data?.data || []);
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  /* ===== FILTER LOGIC ===== */
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const text = `${d?.donor?.name || ""} ${d?.collectedBy?.name || d?.collectedByName || ""} ${d?.amount || ""}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;

      if (status !== "ALL" && d.status !== status) return false;
      if (month !== "ALL" && d.month !== Number(month)) return false;
      if (year !== "ALL" && d.year !== Number(year)) return false;

      return true;
    });
  }, [donations, search, status, month, year]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE) || 1;

  const paginatedDonations = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ===== GRAND TOTAL ===== */
  const grandTotal = filteredDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  /* ===== PDF DOWNLOAD ===== */
  const handleDownloadPDF = () => {
    if (!filteredDonations.length) {
      return toast.error("No donations available for PDF");
    }

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // HEADER BAR
    doc.setFillColor(11, 18, 36);
    doc.rect(0, 0, pageWidth, 32, "F");

    doc.setTextColor(0, 204, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MY DONATIONS REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Filters: ${month === "ALL" ? "All Months" : monthNames[month - 1]} | ${year}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 95, 28);

    const headers = [[
      "#", "DONOR", "AMOUNT", "COLLECTED BY", "YEAR", "MONTH", "STATUS", "APPROVED BY", "DATE"
    ]];

    const body = filteredDonations.map((d, i) => [
      i + 1,
      d?.donor?.name || "-",
      `₹${d.amount}`,
      d?.collectedBy?.name || d?.collectedByName || "-",
      d.year || "-",
      monthNames[d.month - 1] || "-",
      d.status || "-",
      d?.approvedBy?.name || d?.approvedByName || "-",
      renderDate(d)
    ]);

    autoTable(doc, {
      startY: 38,
      head: headers,
      body,
      theme: "grid",
      headStyles: {
        fillColor: [11, 18, 36],
        textColor: [0, 204, 255],
        fontSize: 9,
      },
      styles: {
        fontSize: 8,
        halign: "center",
      },
      columnStyles: {
        1: { halign: "left" },
        2: { fontStyle: "bold", textColor: [16, 185, 129] },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 204, 255);
    doc.text(`GRAND TOTAL: ₹${grandTotal.toLocaleString()}`, 14, finalY);

    doc.save(`MyDonations_${year}_${month}.pdf`);
    toast.success("PDF downloaded successfully");
  };

  const cardShadow = {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const inputShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
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

      {/* ===== HEADER ===== */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-center gap-4 px-2">
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="flex flex-col sm:flex-row items-center gap-2 text-2xl font-extrabold text-slate-800 tracking-tight">
            <span className="p-3.5 rounded-full flex items-center justify-center bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm flex-shrink-0">
              <IndianRupee size={22} />
            </span>
            My Donations
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Track donations with month & year filters
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition active:scale-95 cursor-pointer w-full sm:w-auto border border-cyan-100 shadow-xs"
        >
          <FileDown size={15} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div 
        className="grid grid-cols-1 md:grid-cols-5 gap-3 rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        {/* SEARCH */}
        <div className="relative md:col-span-2 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search donor, collector or amount..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-3 rounded-2xl text-slate-800 outline-none placeholder:text-gray-400 font-semibold text-sm transition-all"
            style={inputShadow}
          />
        </div>

        {/* STATUS */}
        <div className="relative w-full">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-3 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* MONTH */}
        <div className="relative w-full">
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-3 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
          >
            <option value="ALL">All Months</option>
            {monthNames.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="relative w-full">
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-3 rounded-2xl text-slate-800 outline-none cursor-pointer font-semibold text-sm transition-all"
            style={inputShadow}
          >
            <option value="ALL">All Years</option>
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div 
        className="overflow-hidden rounded-3xl p-6 transition-all duration-300"
        style={cardShadow}
      >
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-slate-800 border-collapse">
            <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white">
              <tr className="font-bold uppercase tracking-wider text-xs border-b border-teal-950/20">
                <th className="py-4 px-4 text-left">Donor</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-4 text-left">Collected By</th>
                <th className="py-4 px-4 text-center">Year</th>
                <th className="py-4 px-4 text-center">Month</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-left">Approved By</th>
                <th className="py-4 px-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 font-bold">Loading...</td>
                </tr>
              ) : paginatedDonations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 font-bold">No donations found</td>
                </tr>
              ) : (
                paginatedDonations.map((d) => {
                  const statusKey = (d.status || "").toUpperCase();
                  const currentStatusStyle = statusStyles[statusKey] || "bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-3 py-1 rounded-full text-xs shadow-xs";
                  return (
                    <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-800 text-[14px]">{d?.donor?.name || "—"}</td>
                      <td className={`py-4 px-4 text-right ${amountStyles[statusKey] || "text-slate-850 font-bold text-[15px]"}`}>
                        ₹{d.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-semibold">{d.collectedBy?.name || d.collectedByName || "—"}</td>
                      <td className="py-4 px-4 text-center text-slate-500 font-semibold">{d.year}</td>
                      <td className="py-4 px-4 text-center text-slate-500 font-semibold">{monthNames[d.month - 1] || "—"}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={currentStatusStyle}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-semibold">{d.approvedBy?.name || d.approvedByName || "—"}</td>
                      <td className="py-4 px-4 text-xs text-slate-400 font-semibold">
                        {renderDate(d)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-4 py-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage((p) => p - 1)} 
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
            onClick={() => setPage((p) => p + 1)} 
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

export default MyDonations;
