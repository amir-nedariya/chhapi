"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { jsonReportAPI } from "../../../../api/report";
import { 
  FileDown, Search, LayoutDashboard, TrendingUp, CheckCircle 
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// DUMMY DATA for demonstration
const DUMMY_DONATIONS = [
  { donor: "Aarav Sharma", mobile: "9876543210", year: 2026, month: "January", amount: 1500 },
  { donor: "Aarav Sharma", mobile: "9876543210", year: 2026, month: "February", amount: 1500 },
  { donor: "Vihaan Patel", mobile: "9876543211", year: 2026, month: "January", amount: 500 },
  { donor: "Vivaan Singh", mobile: "9876543212", year: 2026, month: "January", amount: 50 },
  { donor: "Ananya Gupta", mobile: "9876543213", year: 2026, month: "February", amount: 50 },
  { donor: "Ananya Gupta", mobile: "9876543213", year: 2026, month: "March", amount: 50 },
  { donor: "Riya Verma", mobile: "9876543214", year: 2026, month: "April", amount: 1000 },
  { donor: "Arjun Reddy", mobile: "9876543215", year: 2026, month: "May", amount: 2500 },
];

const SuperAdminReports = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState("All");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await jsonReportAPI();
        if (res.data?.data?.length > 0) {
          setDonations(res.data.data);
        } else {
          // Add dummy data if backend has no data
          setDonations(DUMMY_DONATIONS);
        }
      } catch (err) {
        // Fallback to dummy data on error
        setDonations(DUMMY_DONATIONS);
        toast.success("Loaded dummy data for preview");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Process donations per donor
  const processedData = useMemo(() => {
    const donorMap = {};

    donations.forEach((d) => {
      const matchesSearch = d.donor.toLowerCase().includes(searchTerm.toLowerCase()) || d.mobile.includes(searchTerm);
      const matchesYear = filterYear === "All" || d.year.toString() === filterYear;
      const matchesMonth = filterMonth === "All" || d.month === filterMonth || d.month.startsWith(filterMonth);

      if (matchesSearch && matchesYear && matchesMonth) {
        if (!donorMap[d.donor]) {
          donorMap[d.donor] = { donor: d.donor, mobile: d.mobile, total: 0 };
          months.forEach((m) => (donorMap[d.donor][m] = 0));
        }
        const mKey = d.month.slice(0, 3);
        donorMap[d.donor][mKey] += d.amount;
        donorMap[d.donor].total += d.amount;
      }
    });

    return Object.values(donorMap).sort((a, b) => b.total - a.total);
  }, [donations, searchTerm, filterYear, filterMonth]);

  // Grand total for UI
  const grandTotal = processedData.reduce((sum, row) => sum + row.total, 0);

  // PDF Export
  const handlePDF = () => {
    if (!processedData.length) return toast.error("No hay datos para exportar");

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, "F");
    doc.setTextColor(0, 204, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CHHAPI DONATION - ANNUAL STATEMENT", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Year: ${filterYear} | Filter: ${filterMonth === "All" ? "Full Year" : filterMonth}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

    // Columns dynamically based on filter
    const tableMonths = filterMonth === "All" ? months : [filterMonth.slice(0, 3)];

    // Grand total based on filtered months
    const grand = processedData.reduce((sum, d) => {
      if (filterMonth === "All") return sum + d.total;
      return sum + (d[tableMonths[0]] || 0);
    }, 0);

    // Grand total box
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth - 80, 15, 65, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("GRAND TOTAL COLLECTION", pageWidth - 75, 21);
    doc.setTextColor(0, 204, 255);
    doc.setFontSize(14);
    doc.text(`RS. ${grand.toLocaleString()}`, pageWidth - 75, 30);

    // Table
    const headers = [["#", "DONOR NAME", "MOBILE", ...tableMonths, "TOTAL"]];
    const body = processedData.map((d, i) => {
      const total = tableMonths.reduce((sum, m) => sum + (d[m] || 0), 0);
      return [
        i + 1, // Serial #
        d.donor.toUpperCase(),
        d.mobile,
        ...tableMonths.map((m) => (d[m] > 0 ? `${d[m]}` : "-")),
        total.toLocaleString()
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: headers,
      body: body,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], textColor: [0, 204, 255], fontSize: 8 },
      styles: { fontSize: 7, halign: "center" },
      columnStyles: { 
        1: { halign: "left", fontStyle: "bold" }, // Donor name
        [headers[0].length - 1]: { 
          fontStyle: "bold",
          textColor: filterMonth === "All" ? [16, 185, 129] : [0, 204, 255] // green if all months
        } 
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.cell.text[0] === "50") {
          data.cell.styles.textColor = [16, 185, 129]; // Monthly 50 highlight
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    toast.success("Report opened in a new tab!");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 bg-transparent min-h-screen text-slate-800">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Financial <span className="text-cyan-600">Reports</span></h1>
          <p className="text-slate-500 text-sm mt-1">Consolidated donor activity tracking</p>
        </div>
        <button onClick={handlePDF} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all">
          <FileDown size={20} /> DOWNLOAD PDF
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search donor name or mobile..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 text-slate-800 rounded-xl outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <select 
          value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-white border border-gray-300 text-slate-800 rounded-xl p-3 font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-all"
        >
          <option value="All">All Months</option>
          {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select 
          value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
          className="bg-white border border-gray-300 text-slate-800 rounded-xl p-3 font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-all"
        >
          <option value="All">All Years</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden group">
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-32 text-cyan-600/5" />
          <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest">Grand Total</p>
          <h2 className="text-4xl font-black text-slate-800 mt-2">RS. {grandTotal.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Active Donors</p>
          <h3 className="text-4xl font-black text-slate-800 mt-2">{processedData.length}</h3>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-gray-200 shadow-sm flex items-center justify-center">
            <CheckCircle size={24} className="text-emerald-500 mr-2" />
            <span className="text-sm font-bold text-slate-600">System Verified Report</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-200">
              <tr>
                <th className="px-6 py-6 sticky left-0 bg-slate-50 z-10 text-center w-16">#</th>
                <th className="px-6 py-6 sticky left-0 bg-slate-50 z-10">Donor Details</th>
                {(filterMonth === "All" ? months : [filterMonth.slice(0,3)]).map(m => (
                  <th key={m} className="px-3 py-6 text-center">{m}</th>
                ))}
                <th className="px-8 py-6 text-right bg-slate-50/50">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedData.map((d, i) => {
                const tableMonths = filterMonth === "All" ? months : [filterMonth.slice(0,3)];
                const total = tableMonths.reduce((sum, m) => sum + (d[m] || 0), 0);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5 sticky left-0 bg-white group-hover:bg-slate-50 font-black text-slate-600 text-lg text-center z-10">{i + 1}</td>
                    <td className="px-6 py-5 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                      <div className="font-black text-slate-700 text-sm tracking-wide uppercase">{d.donor}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{d.mobile}</div>
                    </td>
                    {tableMonths.map(m => (
                      <td key={m} className={`px-3 py-5 text-center text-[13px] ${d[m] === 50 ? 'text-emerald-500 font-bold' : 'text-slate-500 font-medium'}`}>
                        {d[m] > 0 ? d[m] : "-"}
                      </td>
                    ))}
                    <td className={`px-8 py-5 font-black text-right text-lg ${filterMonth === "All" ? 'text-emerald-600' : 'text-cyan-600'} bg-slate-50/30 group-hover:bg-slate-50`}>
                      RS. {total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {processedData.length === 0 && (
            <div className="py-24 text-center text-slate-500 flex flex-col items-center">
              <LayoutDashboard size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No records match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;
