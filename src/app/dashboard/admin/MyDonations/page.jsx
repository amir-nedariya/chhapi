"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getMyDonationsAPI } from "../../../../api/donation.api";
import {
  Calendar,
  IndianRupee,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FilterBar from "../../../../components/common/FilterBar";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";

const ITEMS_PER_PAGE = 10;

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const amountStyles = {
  PENDING: "text-amber-600",
  APPROVED: "text-emerald-600",
  SUCCESS: "text-emerald-600",
  REJECTED: "text-rose-600",
  FAILED: "text-rose-600",
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

  const [params, setParams] = useState({
    search: "",
    status: "ALL",
    month: "ALL",
    year: "ALL"
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [years, setYears] = useState([]);

  /* ===== FETCH ===== */
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await getMyDonationsAPI({ ...params, page, limit: ITEMS_PER_PAGE });
      setDonations(res?.data?.data || []);
      setGrandTotal(res?.data?.grandTotal || 0);
      setYears(res?.data?.metadata?.years || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalItems(res?.data?.pagination?.totalItems || 0);
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search so we don't spam the API on every keystroke
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDonations();
    }, 500);
    return () => clearTimeout(delay);
  }, [params.search, params.status, params.month, params.year, page]);

  /* ===== GRAND TOTAL & PAGINATION ARE NOW FROM BACKEND ===== */

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("My Donations Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Donations: Rs. ${grandTotal.toLocaleString("en-IN")}`, 14, 22);

      const tableData = donations.map((d, index) => [
        (page - 1) * ITEMS_PER_PAGE + index + 1,
        d.donor?.name || "—",
        `Rs. ${Number(d.amount || 0).toLocaleString("en-IN")}`,
        d.year,
        monthNames[d.month - 1] || "—",
        d.status,
        renderDate(d)
      ]);

      autoTable(doc, {
        head: [["#", "Donor Name", "Amount", "Year", "Month", "Status", "Date"]],
        body: tableData,
        startY: 28,
        theme: "striped",
        headStyles: { fillColor: [0, 115, 128] }
      });

      doc.save(`donations-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search by donor name..." },
    {
      type: "select",
      name: "status",
      options: [
        { label: "All Status", value: "ALL" },
        { label: "Pending", value: "Pending" },
        { label: "Success", value: "Success" },
        { label: "Failed", value: "Failed" }
      ]
    },
    {
      type: "select",
      name: "month",
      options: [
        { label: "All Months", value: "ALL" },
        ...monthNames.map((m, i) => ({ label: m, value: i + 1 }))
      ]
    },
    {
      type: "select",
      name: "year",
      options: [
        { label: "All Years", value: "ALL" },
        ...years.map(y => ({ label: y.toString(), value: y }))
      ]
    }
  ];

  const columns = [
    {
      key: "donor",
      header: "Donor Details",
      render: (_, d) => {
        const initial = (d.donor?.name || "U").charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 flex-shrink-0">
              <span className="text-teal-700 font-bold text-sm">{initial}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">{d.donor?.name || "—"}</span>
              <span className="text-xs text-slate-500">{d.donor?.mobile || "—"}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (_, d) => (
        <span className={`font-extrabold tracking-tight ${amountStyles[(d.status || "").toUpperCase()] || "text-gray-800"}`}>
          ₹{(Number(d.amount) || 0).toLocaleString("en-IN")}
        </span>
      )
    },
    {
      key: "collectedBy",
      header: "Collected By",
      render: (_, d) => <span className="font-medium text-gray-700">{d.collectedBy?.name || d.collectedByName || "—"}</span>
    },
    {
      key: "year",
      header: "Year",
      align: "center",
      render: (_, d) => <span className="text-gray-600 font-medium">{d.year}</span>
    },
    {
      key: "month",
      header: "Month",
      align: "center",
      render: (_, d) => <span className="text-gray-600 font-medium">{monthNames[d.month - 1] || "—"}</span>
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (_, d) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${statusStyles[(d.status || "").toUpperCase()] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
          {d.status}
        </span>
      )
    },
    {
      key: "approvedBy",
      header: "Approved By",
      render: (_, d) => <span className="font-medium text-gray-700">{d.approvedBy?.name || d.approvedByName || "—"}</span>
    },
    {
      key: "date",
      header: "Date",
      render: (_, d) => <span className="text-xs text-slate-500 font-semibold">{renderDate(d)}</span>
    }
  ];

  const handleFilterChange = (e) => {
    const target = e.target;
    const name = target.name || target.id || target.getAttribute("name");
    const value = target.value;
    if (name) {
      setParams(prev => ({ ...prev, [name]: value }));
      setPage(1);
    } else {
      console.error("Filter change missing name property", target);
    }
  };

  return (
    <div className="py-3 md:py-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-teal-700" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Collections</h2>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">Verify your area collections ledger</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Total Collections Card */}
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-xs">
            <IndianRupee size={15} className="text-teal-600 stroke-[2.5]" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Collection</p>
              <h4 className="text-slate-800 font-extrabold text-sm">₹{grandTotal.toLocaleString("en-IN")}</h4>
            </div>
          </div>

          <Button onClick={downloadPDF} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold">
            <FileDown size={14} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <FilterBar 
        filters={filterConfig} 
        params={params} 
        onChange={handleFilterChange} 
      />

      <Table 
        columns={columns}
        data={donations}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Donations",
          entityIcon: "Calendar",
          search: params.search
        }}
      />
    </div>
  );
};

export default MyDonations;
