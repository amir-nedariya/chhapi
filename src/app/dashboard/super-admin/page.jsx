"use client";
import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Users,
  Clock,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { superAdminDashboardAPI } from "../../../api/dashboard.api";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import StatsCards from "../../../components/common/StatsCards";
import Table from "../../../components/common/Table";
import DashboardBanners from "../../../components/common/DashboardBanners";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeAdmins: 0,
    pendingDonations: 0,
    recentDonations: [
      { id: "TX1001", name: "Rahul Sharma", email: "rahul@gmail.com", amount: 5000, date: "2026-06-18", status: "Success", fund: "Medical Relief" },
      { id: "TX1002", name: "Priya Singh", email: "priya@yahoo.com", amount: 1200, date: "2026-06-17", status: "Success", fund: "Education Fund" },
      { id: "TX1003", name: "Amit Kumar", email: "amit.k@outlook.com", amount: 10000, date: "2026-06-16", status: "Pending", fund: "Disaster Relief" },
      { id: "TX1004", name: "Sneha Patel", email: "sneha@gmail.com", amount: 8000, date: "2026-06-15", status: "Success", fund: "Animal Welfare" }
    ],
    recentUsers: [
      { id: "u1", name: "Rohan Das", email: "rohan@gmail.com", role: "USER", date: "2026-08-01" },
      { id: "u2", name: "Sneha Patel", email: "sneha@yahoo.com", role: "ADMIN", date: "2026-08-02" },
      { id: "u3", name: "Vikas Verma", email: "vikas@outlook.com", role: "USER", date: "2026-08-03" }
    ],
    monthlyTrends: [
      { month: "Jan", amount: 1000 },
      { month: "Feb", amount: 2000 },
      { month: "Mar", amount: 1500 },
      { month: "Apr", amount: 3000 },
      { month: "May", amount: 5000 },
      { month: "Jun", amount: 4000 }
    ]
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await superAdminDashboardAPI({ year: chartYear });
      if (res.data.success) {
        const apiData = res.data.data;

        const parsedDonations = typeof apiData.totalDonations === 'string'
          ? parseInt(apiData.totalDonations.replace(/[^\d]/g, ''), 10) || 500000
          : apiData.totalDonations || 500000;

        setDashboardData(prev => ({
          ...prev,
          totalUsers: apiData.totalUsers || prev.totalUsers,
          totalDonations: parsedDonations || prev.totalDonations,
          activeAdmins: apiData.activeUsers || prev.activeAdmins,
          recentDonations: apiData.recentDonations?.map(d => ({
            id: d._id,
            name: d.name,
            email: d.email || `${d.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            amount: d.amount,
            date: d.date,
            status: d.status,
            fund: d.fund || "General Campaign"
          })) || prev.recentDonations,
          recentUsers: apiData.recentUsers?.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email || `${u.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            role: u.role || "USER",
            date: u.date || new Date().toISOString().split('T')[0]
          })) || prev.recentUsers,
          monthlyTrends: apiData.chartData?.map((amt, idx) => ({
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx] || `M${idx + 1}`,
            amount: amt
          })) || prev.monthlyTrends
        }));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
  }, [chartYear]);

  const handleYearChange = (delta) => {
    setChartYear(prev => prev + delta);
  };

  const statsCardsData = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString("en-IN"),
      icon: <div className="p-2.5 rounded-sm bg-cyan-50 text-cyan-600 border border-cyan-100"><User size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Total Donations",
      value: `₹${dashboardData.totalDonations.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-sm bg-green-50 text-green-600 border border-green-100"><CreditCard size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Active Admins",
      value: dashboardData.activeAdmins,
      icon: <div className="p-2.5 rounded-sm bg-purple-50 text-purple-600 border border-purple-100"><Users size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Pending Approvals",
      value: dashboardData.pendingDonations,
      icon: <div className="p-2.5 rounded-sm bg-amber-50 text-amber-600 border border-amber-100"><Clock size={20} /></div>,
      valueColor: "text-slate-800"
    }
  ];

  const transactionColumns = [
    {
      key: "donor",
      header: "Donor",
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-800">{row.name}</p>
          <p className="text-gray-400 text-xs">{row.email}</p>
        </div>
      )
    },
    { key: "fund", header: "Campaign" },
    {
      key: "amount",
      header: "Amount",
      render: (val) => <span className="font-semibold text-gray-800">₹{val.toLocaleString("en-IN")}</span>
    },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (val) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${val === "Success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
          val === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
            "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
          {val}
        </span>
      )
    }
  ];

  const userColumns = [
    {
      key: "user",
      header: "User",
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-800">{row.name}</p>
          <p className="text-gray-400 text-xs">{row.email}</p>
        </div>
      )
    },
    {
      key: "role",
      header: "Role",
      align: "center",
      render: (val) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${val === "SUPER_ADMIN" ? "bg-purple-50 text-purple-700 border border-purple-200" :
          val === "ADMIN" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
            "bg-sky-50 text-sky-700 border border-sky-200"
          }`}>
          {val.replace('_', ' ')}
        </span>
      )
    },
    { key: "date", header: "Joined" }
  ];

  return (
    <div className="py-3 md:py-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col items-center text-center sm:flex-row justify-between sm:items-center sm:text-left gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Full system overview of users, donations, and reports.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Festival & Event Banners */}
      <DashboardBanners />

      {/* Metrics Grid */}
      <StatsCards cards={statsCardsData} />

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-semibold text-base">Monthly Donations Overview</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-sm transition text-gray-500 cursor-pointer active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-700 select-none min-w-[36px] text-center">
              {chartYear}
            </span>
            <button
              onClick={() => handleYearChange(1)}
              className="p-1.5 hover:bg-gray-100 rounded-sm transition text-gray-500 cursor-pointer active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={dashboardData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} fill="#e0f2fe" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading Chart...</div>
          )}
        </div>
      </div>



    </div>
  );
};

export default SuperAdminDashboard;
