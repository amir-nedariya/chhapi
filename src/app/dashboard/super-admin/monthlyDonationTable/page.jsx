"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { BarChart3 } from "lucide-react";
import { getMonthlyDonationTableAPI } from "../../../../api/donation.api";
import { useSidebarColor } from "../../../../hooks/useSidebarColor";
import FilterBar from "../../../../components/common/FilterBar";
import Table from "../../../../components/common/Table";

const months = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

const currentMonthKey = months[new Date().getMonth()].key;
const currentYear = new Date().getFullYear();

const MonthlyDonationTable = () => {
  const sidebarColor = useSidebarColor();
  const getAvatarUrl = (userObj) => {
    if (userObj?.profilePhoto?.url) {
      if (userObj.profilePhoto.url.includes("ui-avatars.com")) {
        return userObj.profilePhoto.url.replace(/background=[0-9a-fA-F]+/g, `background=${sidebarColor}`);
      }
      return userObj.profilePhoto.url;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj?.name || "User")}&background=${sidebarColor}&color=fff`;
  };
  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useState({ search: "", year: currentYear, month: currentMonthKey, paymentStatus: "ALL" });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(params.search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [params.search]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getMonthlyDonationTableAPI({
        page,
        limit: 10,
        year: params.year,
        month: params.month,
        search: debouncedSearch,
        paymentStatus: params.paymentStatus,
      });

      setRows(res?.data || []);
      setAvailableYears(res?.availableYears || []);
      setPages(res?.pagination?.pages || 1);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, params.year, params.month, debouncedSearch, params.paymentStatus]);

  const visibleMonths = useMemo(() => {
    if (params.month === "ALL") return months;
    return months.filter((m) => m.key === params.month);
  }, [params.month]);

  const calculateTotal = (user) => {
    return visibleMonths.reduce((sum, m) => {
      return sum + (user[m.key] || 0);
    }, 0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search name or mobile..." },
    {
      type: "select",
      name: "year",
      options: availableYears.map(y => ({ label: y.toString(), value: y }))
    },
    {
      type: "select",
      name: "month",
      options: [{ label: "All Months", value: "ALL" }, ...months.map(m => ({ label: m.label, value: m.key }))]
    },
    {
      type: "select",
      name: "paymentStatus",
      options: [
        { label: "All Payments", value: "ALL" },
        { label: "Paid", value: "PAID" },
        { label: "Unpaid", value: "UNPAID" }
      ]
    }
  ];

  const columns = [
    {
      key: "donor",
      header: "Donor Details",
      render: (_, u) => (
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(u)}
            alt={u.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <div>
            <div className="font-semibold text-gray-700 text-xs tracking-wide uppercase">{u.name}</div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">{u.mobile}</div>
          </div>
        </div>
      )
    },
    ...visibleMonths.map(m => ({
      key: m.key,
      header: m.label,
      align: "center",
      render: (_, u) => (
        <span className={`text-xs ${u[m.key] > 0 ? "text-emerald-600 font-semibold" : "text-gray-400 font-medium"}`}>
          {u[m.key] > 0 ? `₹${u[m.key].toLocaleString("en-IN")}` : "-"}
        </span>
      )
    })),
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (_, u) => (
        <span className="font-semibold text-teal-700 text-xs">
          ₹{calculateTotal(u).toLocaleString("en-IN")}
        </span>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="text-teal-700" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Monthly Donation Table
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">Consolidated view of monthly budget allocations</p>
        </div>
      </div>

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table 
        columns={columns}
        data={rows}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: pages,
          totalItems: pages * 10, // Assuming 10 per page
          itemsPerPage: 10,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Monthly Records",
          entityIcon: "BarChart3"
        }}
      />
    </div>
  );
};

export default MonthlyDonationTable;
