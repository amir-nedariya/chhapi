"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { jsonReportAPI } from "../../../../api/report";
import {
  FileDown, LayoutDashboard, TrendingUp, CheckCircle, FileText
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FilterBar from "../../../../components/common/FilterBar";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";

const SuperAdminReports = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    search: "",
    year: new Date().getFullYear().toString(),
    month: "All"
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await jsonReportAPI();
        setDonations(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to fetch report data");
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const processedData = useMemo(() => {
    const donorMap = {};

    donations.forEach((d) => {
      const matchesSearch = d.donor.toLowerCase().includes(params.search.toLowerCase()) || d.mobile.includes(params.search);
      const matchesYear = params.year === "All" || d.year.toString() === params.year;
      const matchesMonth = params.month === "All" || d.month === params.month || d.month.startsWith(params.month);

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
  }, [donations, params.search, params.year, params.month]);

  const grandTotal = processedData.reduce((sum, row) => sum + row.total, 0);

  const handlePDF = () => {
    if (!processedData.length) return toast.error("No hay datos para exportar");

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, "F");
    doc.setTextColor(0, 204, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CHHAPI DONATION - ANNUAL STATEMENT", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Year: ${params.year} | Filter: ${params.month === "All" ? "Full Year" : params.month}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

    const tableMonths = params.month === "All" ? months : [params.month.slice(0, 3)];

    const grand = processedData.reduce((sum, d) => {
      if (params.month === "All") return sum + d.total;
      return sum + (d[tableMonths[0]] || 0);
    }, 0);

    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth - 80, 15, 65, 20, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("GRAND TOTAL COLLECTION", pageWidth - 75, 21);
    doc.setTextColor(0, 204, 255);
    doc.setFontSize(14);
    doc.text(`RS. ${grand.toLocaleString()}`, pageWidth - 75, 30);

    const headers = [["DONOR NAME", "MOBILE", ...tableMonths, "TOTAL"]];
    const body = processedData.map((d, i) => {
      const total = tableMonths.reduce((sum, m) => sum + (d[m] || 0), 0);
      return [
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
        0: { halign: "left", fontStyle: "bold" },
        [headers[0].length - 1]: {
          fontStyle: "bold",
          textColor: params.month === "All" ? [16, 185, 129] : [0, 204, 255]
        }
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.cell.text[0] === "50") {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    toast.success("Report opened in a new tab!");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search donor name or mobile..." },
    {
      type: "select",
      name: "month",
      options: [{ label: "All Months", value: "All" }, ...fullMonths.map(m => ({ label: m, value: m }))]
    },
    {
      type: "select",
      name: "year",
      options: [{ label: "All Years", value: "All" }, { label: "2025", value: "2025" }, { label: "2026", value: "2026" }]
    }
  ];

  const tableMonths = params.month === "All" ? months : [params.month.slice(0, 3)];

  const columns = [
    {
      key: "donor",
      header: "Donor Details",
      render: (_, d) => (
        <div className="whitespace-nowrap">
          <div className="font-black text-gray-700 text-sm tracking-wide uppercase">{d.donor}</div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">{d.mobile}</div>
        </div>
      )
    },
    ...tableMonths.map(m => ({
      key: m,
      header: m,
      align: "center",
      render: (_, d) => (
        <span className={`text-[13px] ${d[m] === 50 ? 'text-emerald-500 font-bold' : 'text-gray-500 font-medium'}`}>
          {d[m] > 0 ? d[m] : "-"}
        </span>
      )
    })),
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (_, d) => {
        const total = tableMonths.reduce((sum, m) => sum + (d[m] || 0), 0);
        return (
          <span className={`font-black text-lg ${params.month === "All" ? 'text-emerald-600' : 'text-teal-600'}`}>
            RS. {total.toLocaleString()}
          </span>
        );
      }
    }
  ];

  return (
    <div className="py-3 md:py-6 space-y-5">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <FileText className="text-teal-700" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Reports
            </h2>
          </div>
        </div>
        <Button onClick={handlePDF} iconLeft={FileDown} size="lg" variant="solid">
          DOWNLOAD PDF
        </Button>
      </div>

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-32 text-teal-600/5" />
          <p className="text-teal-600 font-bold text-xs uppercase tracking-widest">Grand Total</p>
          <h2 className="text-4xl font-black text-gray-800 mt-2">RS. {grandTotal.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Active Donors</p>
          <h3 className="text-4xl font-black text-gray-800 mt-2">{processedData.length}</h3>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-center">
          <CheckCircle size={24} className="text-emerald-500 mr-2" />
          <span className="text-sm font-bold text-emerald-700">System Verified Report</span>
        </div>
      </div>

      <Table
        columns={columns}
        data={processedData}
        isLoading={loading}
        emptyStateProps={{
          entityName: "Records",
          entityIcon: "LayoutDashboard"
        }}
      />
    </div>
  );
};

export default SuperAdminReports;
