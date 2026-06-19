"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { jsonReportAPI } from "../../../../api/report";
import { 
  FileDown, Search, LayoutDashboard, TrendingUp, CheckCircle 
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        setDonations(res.data.data || []);
      } catch (err) {
        toast.error("Error al obtener datos");
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

    doc.save(`Report_Chhapi_${filterYear}_${filterMonth}.pdf`);
    toast.success("Reporte generado con éxito");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 bg-[#0b0f1a] min-h-screen text-slate-200">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black">Financial <span className="text-[#00ccff]">Reports</span></h1>
          <p className="text-slate-500 text-sm">Consolidated donor activity tracking</p>
        </div>
        <button onClick={handlePDF} className="bg-[#00ccff] text-[#0f172a] font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <FileDown size={20} /> DOWNLOAD PDF
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" placeholder="Search donor name or mobile..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl outline-none focus:border-[#00ccff]/50"
          />
        </div>

        <select 
          value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-[#0f172a] border border-white/10 rounded-xl p-3 text-[#00ccff] font-bold outline-none cursor-pointer"
        >
          <option value="All">All Months</option>
          {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select 
          value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
          className="bg-[#0f172a] border border-white/10 rounded-xl p-3 text-[#00ccff] font-bold outline-none cursor-pointer"
        >
          <option value="All">All Years</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-32 text-[#00ccff]/5" />
          <p className="text-[#00ccff] font-bold text-xs uppercase tracking-widest">Grand Total</p>
          <h2 className="text-4xl font-black text-white mt-2">RS. {grandTotal.toLocaleString()}</h2>
        </div>
        <div className="bg-[#1e293b]/40 p-6 rounded-[2rem] border border-white/5">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Active Donors</p>
          <h3 className="text-4xl font-black text-white mt-2">{processedData.length}</h3>
        </div>
        <div className="bg-[#1e293b]/40 p-6 rounded-[2rem] border border-white/5 flex items-center justify-center">
            <CheckCircle size={24} className="text-emerald-500 mr-2" />
            <span className="text-sm font-bold text-slate-400">System Verified Report</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1e293b]/80 text-[#00ccff] text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-4 py-5 sticky left-0 bg-[#1e293b]">#</th>
                <th className="px-6 py-5 sticky left-0 bg-[#1e293b]">Donor Details</th>
                {(filterMonth === "All" ? months : [filterMonth.slice(0,3)]).map(m => (
                  <th key={m} className="px-2 py-5 text-center">{m}</th>
                ))}
                <th className="px-6 py-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedData.map((d, i) => {
                const tableMonths = filterMonth === "All" ? months : [filterMonth.slice(0,3)];
                const total = tableMonths.reduce((sum, m) => sum + (d[m] || 0), 0);
                return (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-4 sticky left-0 bg-[#111827] group-hover:bg-[#1a2233] font-bold text-slate-400">{i + 1}</td>
                    <td className="px-6 py-4 sticky left-0 bg-[#111827] group-hover:bg-[#1a2233]">
                      <div className="font-bold text-white text-sm uppercase">{d.donor}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{d.mobile}</div>
                    </td>
                    {tableMonths.map(m => (
                      <td key={m} className={`px-2 py-4 text-center text-xs ${d[m] === 50 ? 'text-emerald-400 font-bold' : 'text-slate-600 font-medium'}`}>
                        {d[m] > 0 ? d[m] : "-"}
                      </td>
                    ))}
                    <td className={`px-6 py-4 font-black text-right ${filterMonth === "All" ? 'text-emerald-400' : 'text-[#00ccff]'} bg-[#00ccff]/5`}>
                      RS. {total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {processedData.length === 0 && (
            <div className="py-24 text-center text-slate-600 flex flex-col items-center">
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
