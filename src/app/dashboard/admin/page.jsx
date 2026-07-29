"use client";
import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Clock,
  RefreshCw,
  FolderHeart
} from "lucide-react";
import { adminDashboardAPI } from "../../../api/dashboard.api";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 840,
    totalCollection: 540000,
    activeCampaigns: 8,
    pendingVerifications: 12,
    recentDonations: [
      { id: "TX5001", name: "Ramesh Patel", email: "ramesh@gmail.com", amount: 10000, date: "2026-06-28", status: "Success", fund: "Medical Relief" },
      { id: "TX5002", name: "Sunita Devi", email: "sunita@yahoo.com", amount: 2000, date: "2026-06-27", status: "Success", fund: "Education Fund" },
      { id: "TX5003", name: "Vijay Singh", email: "vijay@outlook.com", amount: 15000, date: "2026-06-26", status: "Pending", fund: "Disaster Relief" },
      { id: "TX5004", name: "Karan Johar", email: "karan@gmail.com", amount: 5000, date: "2026-06-25", status: "Success", fund: "Animal Welfare" }
    ],
    monthlyTrends: [
      { month: "Jan", amount: 80000 },
      { month: "Feb", amount: 120000 },
      { month: "Mar", amount: 95000 },
      { month: "Apr", amount: 190000 },
      { month: "May", amount: 240000 },
      { month: "Jun", amount: 310000 }
    ]
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminDashboardAPI();
      if (res.data.success) {
        const apiData = res.data.data;
        
        const parsedCollection = typeof apiData.totalDonations === 'string'
          ? parseInt(apiData.totalDonations.replace(/[^\d]/g, ''), 10) || 500000
          : apiData.totalDonations || 500000;

        setDashboardData(prev => ({
          ...prev,
          totalUsers: apiData.totalUsers || prev.totalUsers,
          totalCollection: parsedCollection || prev.totalCollection,
          recentDonations: apiData.recentDonations?.map(d => ({
            id: d._id,
            name: d.name,
            email: d.email || `${d.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            amount: d.amount,
            date: d.date,
            status: d.status,
            fund: d.fund || "General Campaign"
          })) || prev.recentDonations
        }));
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchStats();
  }, []);

  const statsCardsData = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toLocaleString("en-IN"),
      icon: <div className="p-2.5 rounded-sm bg-cyan-50 text-cyan-600 border border-cyan-100"><User size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Total Collection",
      value: `₹${dashboardData.totalCollection.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-sm bg-green-50 text-green-600 border border-green-100"><CreditCard size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Active Campaigns",
      value: dashboardData.activeCampaigns,
      icon: <div className="p-2.5 rounded-sm bg-purple-50 text-purple-600 border border-purple-100"><FolderHeart size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Pending Slips",
      value: dashboardData.pendingVerifications,
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
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-slate-400 text-xs">{row.email}</p>
        </div>
      )
    },
    { key: "fund", header: "Campaign" },
    { 
      key: "amount", 
      header: "Amount",
      render: (val) => <span className="font-bold text-slate-800">₹{val.toLocaleString("en-IN")}</span>
    },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (val) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          val === "Success" ? "bg-emerald-50 text-emerald-700" :
          val === "Pending" ? "bg-amber-50 text-amber-700" :
          "bg-rose-50 text-rose-700"
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center sm:flex-row justify-between sm:items-center sm:text-left gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Overview of users, collections, and donations in your assigned area.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer w-full sm:w-auto"
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Collection Trend</h3>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={dashboardData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} fill="#ecfdf5" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading Chart...</div>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-4">
        <h3 className="text-slate-800 font-semibold mb-3 text-base">Recent Transactions</h3>
        <Table 
          columns={transactionColumns} 
          data={dashboardData.recentDonations} 
        />
      </div>

    </div>
  );
};

export default AdminDashboard;
