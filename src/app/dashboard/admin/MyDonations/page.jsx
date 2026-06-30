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
  PENDING: "bg-yellow-500/20 text-yellow-300",
  APPROVED: "bg-green-500/20 text-green-300",
  REJECTED: "bg-red-500/20 text-red-300",
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

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
      const text = `${d?.donor?.name || ""} ${d?.collectedByName || ""} ${d?.amount || ""}`.toLowerCase();
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
      d?.collectedByName || "-",
      d.year || "-",
      monthNames[d.month - 1] || "-",
      d.status || "-",
      d?.approvedByName || "-",
      new Date(d.createdAt).toLocaleDateString("en-GB")
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

  return (
    <div className="p-1 md:p-6 max-w-7xl mx-auto space-y-6 text-white">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="flex flex-col sm:flex-row items-center gap-2 text-2xl font-bold text-white">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <IndianRupee size={20} className="text-cyan-400" onClick={handleDownloadPDF}/>
            </span>
            My Donations
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Track donations with month & year filters
          </p>
        </div>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white/5 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">

        {/* SEARCH */}
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-3 text-white/40" />
          <input
            type="text"
            placeholder="Search donor, collector or amount..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* STATUS */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-3 text-white/40" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* MONTH */}
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-3 text-white/40" />
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20"
          >
            <option value="ALL">All Months</option>
            {monthNames.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-3 text-white/40" />
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1224] text-white border border-white/20"
          >
            <option value="ALL">All Years</option>
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white">
            <tr>
              <th className="p-4 text-left">Donor</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4">Collected By</th>
              <th className="p-4">Year</th>
              <th className="p-4">Month</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Approved By</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-white/50">Loading...</td>
              </tr>
            ) : paginatedDonations.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-white/50">No donations found</td>
              </tr>
            ) : (
              paginatedDonations.map((d) => (
                <tr key={d._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4 font-medium">{d?.donor?.name || "—"}</td>
                  <td className="p-4 text-right font-semibold text-green-400">₹{d.amount}</td>
                  <td className="p-4">{d.collectedByName || "—"}</td>
                  <td className="p-4">{d.year}</td>
                  <td className="p-4">{monthNames[d.month - 1] || "—"}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4">{d.approvedByName || "—"}</td>
                  <td className="p-4 text-xs text-white/60">
                    {new Date(d.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-3">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg bg-white/10 disabled:opacity-40">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-white/70">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg bg-white/10 disabled:opacity-40">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
