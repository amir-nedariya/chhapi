"use client";
import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Users,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  PieChart,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Layers,
  Filter
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
  ResponsiveContainer,
  Legend
} from "recharts";
import StatsCards from "../../../components/common/StatsCards";
import Table from "../../../components/common/Table";
import DashboardBanners from "../../../components/common/DashboardBanners";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDonations: 0,
    pendingApprovals: 0,
    fundUses: 0,
    roleBreakdown: {
      superAdminCount: 0,
      adminCount: 0,
      userCount: 0,
      totalUsers: 0
    },
    recentDonations: [],
    recentUsers: [],
    monthlyTrends: [
      { month: "Jan", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Feb", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Mar", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Apr", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "May", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Jun", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Jul", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Aug", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Sep", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Oct", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Nov", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } },
      { month: "Dec", amount: 0, fundUses: 0, superAdminDonation: 0, adminDonation: 0, userDonation: 0, userBreakdown: { superAdminCount: 0, adminCount: 0, userCount: 0, total: 0 } }
    ]
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await superAdminDashboardAPI({ year: chartYear });
      if (res?.data?.success) {
        const apiData = res.data.data;

        const parsedDonations = typeof apiData.totalDonations === 'string'
          ? parseInt(apiData.totalDonations.replace(/[^\d]/g, ''), 10) || 0
          : apiData.totalDonations || 0;

        const parsedFundUses = typeof apiData.fundUses === 'string'
          ? parseInt(apiData.fundUses.replace(/[^\d]/g, ''), 10) || 0
          : apiData.fundUses || 0;

        setDashboardData(prev => ({
          ...prev,
          totalUsers: apiData.totalUsers || prev.totalUsers,
          totalDonations: parsedDonations || prev.totalDonations,
          pendingApprovals: apiData.pendingApprovals ?? prev.pendingApprovals,
          fundUses: parsedFundUses || prev.fundUses,
          roleBreakdown: apiData.roleBreakdown || prev.roleBreakdown,
          recentDonations: apiData.recentDonations?.map(d => ({
            id: d._id || d.id,
            name: d.name || d.donorName || "Unknown",
            email: d.email || `${(d.name || "donor").toLowerCase().replace(/\s+/g, '')}@example.com`,
            amount: d.amount,
            date: d.date,
            status: d.status,
            fund: d.fund || "General Campaign"
          })) || prev.recentDonations,
          recentUsers: apiData.recentUsers?.map(u => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email || `${u.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            role: u.role || "USER",
            date: u.date || new Date().toISOString().split('T')[0]
          })) || prev.recentUsers,
          monthlyTrends: apiData.monthlyTrends || prev.monthlyTrends
        }));
      }
    } catch (err) {
      console.error("Failed to fetch super admin dashboard metrics:", err);
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

  // 4 KPI Cards
  const statsCardsData = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString("en-IN"),
      icon: <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100"><Users size={22} /></div>,
      valueColor: "text-slate-800",
      change: `Super: ${dashboardData.roleBreakdown.superAdminCount || 0} | Admin: ${dashboardData.roleBreakdown.adminCount || 0} | User: ${dashboardData.roleBreakdown.userCount || 0}`,
      changeColor: "text-cyan-700 font-medium"
    },
    {
      title: "Total Donations",
      value: `₹${dashboardData.totalDonations.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"><CreditCard size={22} /></div>,
      valueColor: "text-slate-800",
      change: "Verified System Collections",
      changeColor: "text-emerald-600 font-medium"
    },
    {
      title: "Pending Approvals",
      value: dashboardData.pendingApprovals.toLocaleString("en-IN"),
      icon: <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100"><Clock size={22} /></div>,
      valueColor: "text-slate-800",
      change: "Donations & Fund Requests",
      changeColor: "text-amber-600 font-medium"
    },
    {
      title: "Fund Uses",
      value: `₹${dashboardData.fundUses.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100"><PieChart size={22} /></div>,
      valueColor: "text-slate-800",
      change: "Utilized System Funds",
      changeColor: "text-purple-600 font-medium"
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
      render: (val) => <span className="font-semibold text-gray-800">₹{val ? val.toLocaleString("en-IN") : 0}</span>
    },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (val) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
          val === "Success" || val === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
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
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
          val === "SUPER_ADMIN" ? "bg-purple-50 text-purple-700 border border-purple-200" :
          val === "ADMIN" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
          "bg-sky-50 text-sky-700 border border-sky-200"
        }`}>
          {val ? val.replace('_', ' ') : 'USER'}
        </span>
      )
    },
    { key: "date", header: "Joined" }
  ];

  const activeMonthData = selectedMonth 
    ? dashboardData.monthlyTrends.find(m => m.month === selectedMonth)
    : null;

  return (
    <div className="py-3 md:py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
              System Control
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Full system overview of users, donations, fund usages, and reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md p-1">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition active:scale-95 cursor-pointer"
              title="Previous Year"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-sm font-semibold text-gray-800 select-none min-w-[50px] text-center">
              {chartYear}
            </span>
            <button
              onClick={() => handleYearChange(1)}
              className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition active:scale-95 cursor-pointer"
              title="Next Year"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-teal-600 bg-teal-600 hover:bg-teal-700 text-white transition active:scale-95 cursor-pointer shadow-sm"
          >
            <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Festival & Event Banners */}
      <DashboardBanners />

      {/* 4 KPI Grid Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Key System Metrics</h3>
        <StatsCards cards={statsCardsData} />
      </div>

      {/* Monthly Donations Overview Chart (Jan to Dec) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h3 className="text-gray-800 font-bold text-base">Monthly Donations & Fund Uses Overview ({chartYear})</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Yearly overview from Jan to Dec comparing collections & fund utilization.</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="text-gray-600">Donations Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-gray-600">Fund Uses</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={dashboardData.monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="donationColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="fundUseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  formatter={(val, name) => [
                    `₹${Number(val).toLocaleString('en-IN')}`, 
                    name === 'amount' ? 'Donations Collected' : 'Fund Used'
                  ]}
                  labelFormatter={(label) => `Month: ${label} ${chartYear}`}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="amount" name="Donations Collected" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#donationColor)" />
                <Area type="monotone" dataKey="fundUses" name="Fund Uses" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#fundUseColor)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading Chart Data...</div>
          )}
        </div>
      </div>





      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-gray-800 font-bold text-base">Recent Donations</h3>
            <button
              onClick={() => navigate("/dashboard/super-admin/all-donations")}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <Table columns={transactionColumns} data={dashboardData.recentDonations} />
        </div>

        {/* Recent Registered Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-gray-800 font-bold text-base">Recent User List</h3>
            <button
              onClick={() => navigate("/dashboard/super-admin/usersList")}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              View All Users
            </button>
          </div>
          <Table columns={userColumns} data={dashboardData.recentUsers} />
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;

