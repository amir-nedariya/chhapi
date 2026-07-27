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
      if (!text.includes(params.search.toLowerCase())) return false;

      if (params.status !== "ALL" && d.status !== params.status) return false;
      if (params.month !== "ALL" && d.month !== Number(params.month)) return false;
      if (params.year !== "ALL" && d.year !== Number(params.year)) return false;

      return true;
    });
  }, [donations, params.search, params.status, params.month, params.year]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE) || 1;

  const paginatedDonations = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ===== GRAND TOTAL ===== */
  const grandTotal = filteredDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("My Donations Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Donations: Rs. ${grandTotal.toLocaleString("en-IN")}`, 14, 22);

      const tableData = filteredDonations.map((d, index) => [
        index + 1,
        d?.donor?.name || "—",
        `Rs. ${Number(d.amount).toLocaleString("en-IN")}`,
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search by donor name..." },
    {
      type: "select",
      name: "status",
      options: [
        { label: "All Status", value: "ALL" },
        { label: "Success", value: "SUCCESS" },
        { label: "Pending", value: "PENDING" },
        { label: "Failed", value: "FAILED" }
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
        { label: String(currentYear), value: currentYear },
        { label: String(currentYear - 1), value: currentYear - 1 }
      ]
    }
  ];

  const columns = [
    {
      key: "donor",
      header: "Donor Details",
      render: (_, d) => <span className="font-semibold text-gray-800 text-sm">{d?.donor?.name || "—"}</span>
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (_, d) => (
        <span className={`font-bold ${amountStyles[(d.status || "").toUpperCase()] || "text-gray-800"}`}>
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
      render: (_, d) => <span className="text-xs text-gray-500 font-medium">{renderDate(d)}</span>
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table 
        columns={columns}
        data={paginatedDonations}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: filteredDonations.length,
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
