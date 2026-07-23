"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllDonationsAPI } from "../../../../api/donation.api";
import { FileText, Landmark, TrendingUp, Users, Clock } from "lucide-react";
import { useSidebarColor } from "../../../../hooks/useSidebarColor";
import StatsCards from "../../../../components/common/StatsCards";
import FilterBar from "../../../../components/common/FilterBar";
import Table from "../../../../components/common/Table";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const amountStyles = {
  PENDING: "text-amber-600",
  APPROVED: "text-emerald-600",
  SUCCESS: "text-emerald-600",
  FAILED: "text-rose-600",
};

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEMS_PER_PAGE = 10;

const AllDonations = () => {
  const sidebarColor = useSidebarColor();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const now = new Date();
  const [params, setParams] = useState({ 
    month: now.getMonth() + 1, 
    year: now.getFullYear(), 
    search: "" 
  });

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

  const years = useMemo(() => {
    return [...new Set(donations.map(d => d.year))].sort((a, b) => b - a);
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchesMonthYear = d.month === Number(params.month) && d.year === Number(params.year);
      const matchesSearch = d.donor?.name?.toLowerCase().includes(params.search.toLowerCase());
      return matchesMonthYear && matchesSearch;
    });
  }, [donations, params.month, params.year, params.search]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedData = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

  const statsCardsData = [
    {
      title: "Total Approved",
      value: `₹${metrics.totalAmount.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-100"><TrendingUp size={20} /></div>,
      valueColor: "text-gray-800"
    },
    {
      title: "Transactions",
      value: donations.length,
      change: "records",
      icon: <div className="p-2.5 rounded-sm bg-cyan-50 text-cyan-600 border border-cyan-100"><Landmark size={20} /></div>,
      valueColor: "text-gray-800"
    },
    {
      title: "Pending Audit",
      value: metrics.pendingCount,
      change: "pending",
      icon: <div className="p-2.5 rounded-sm bg-amber-50 text-amber-600 border border-amber-100"><Clock size={20} /></div>,
      valueColor: "text-gray-800"
    },
    {
      title: "Unique Donors",
      value: metrics.uniqueDonors,
      change: "donors",
      icon: <div className="p-2.5 rounded-sm bg-purple-50 text-purple-600 border border-purple-100"><Users size={20} /></div>,
      valueColor: "text-gray-800"
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search donor name..." },
    {
      type: "select",
      name: "month",
      options: months.map((m, i) => ({ label: m, value: i + 1 }))
    },
    {
      type: "select",
      name: "year",
      options: years.length === 0 
        ? [{ label: now.getFullYear().toString(), value: now.getFullYear() }]
        : years.map(y => ({ label: y.toString(), value: y }))
    }
  ];

  const columns = [
    {
      key: "donor",
      header: "Donor Details",
      render: (_, d) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.donor?.name || "N/A")}&background=${sidebarColor}&color=fff&rounded=true`}
            alt={d.donor?.name || "User"}
            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <div className="font-semibold text-gray-800 text-sm">
              {d.donor?.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {d.donor?.mobile || "No Mobile"}
            </div>
          </div>
        </div>
      )
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
      render: (_, d) => <span className="font-medium text-gray-700">{d.collectedBy?.name || "—"}</span>
    },
    {
      key: "approvedBy",
      header: "Approved By",
      render: (_, d) => d.approvedBy?.name ? (
        <div>
          <p className="font-medium text-gray-700">{d.approvedBy.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(d.approvedAt).toLocaleDateString()}
          </p>
        </div>
      ) : <span className="text-gray-400">—</span>
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
      key: "month",
      header: "Month",
      render: (_, d) => <span className="text-gray-600 font-medium">{months[d.month - 1]} {d.year}</span>
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="text-teal-700" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Donations</h2>
          <p className="text-sm text-gray-500">Verify and track user donations ledger</p>
        </div>
      </div>

      <StatsCards cards={statsCardsData} />

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table
        columns={columns}
        data={paginatedData}
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
          entityIcon: "FileText",
          search: params.search
        }}
      />
    </div>
  );
};

export default AllDonations;
