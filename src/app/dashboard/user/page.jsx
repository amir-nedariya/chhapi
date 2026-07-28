"use client";
import { useEffect, useState } from "react";
import { 
  Wallet, 
  HandCoins, 
  RefreshCw, 
  Heart
} from "lucide-react";
import { userDashboardAPI } from "../../../api/dashboard.api";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
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

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalDonations: 12,
    totalAmount: 48000,
    activeCampaigns: 3,
    recentContributions: [
      { id: "C101", date: "2026-06-25", amount: 5000, status: "Success", fund: "Medical Relief" },
      { id: "C102", date: "2026-06-12", amount: 3000, status: "Success", fund: "Education Fund" },
      { id: "C103", date: "2026-05-28", amount: 10000, status: "Success", fund: "Disaster Relief" },
      { id: "C104", date: "2026-05-15", amount: 2000, status: "Pending", fund: "Animal Welfare" }
    ],
    monthlySummary: {
      jan: 2000,
      feb: 4000,
      mar: 3000,
      apr: 8000,
      may: 12000,
      jun: 16000
    }
  });

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await userDashboardAPI();
      if (res.data.success) {
        const { user: apiUser, monthly, totalDonations, totalAmount } = res.data.data;
        setUser(apiUser);
        
        const parsedTotalAmount = typeof totalAmount === 'string'
          ? parseInt(totalAmount.replace(/[^\d]/g, ''), 10) || 48000
          : totalAmount || 48000;

        setDashboardData(prev => ({
          ...prev,
          totalDonations: totalDonations || prev.totalDonations,
          totalAmount: parsedTotalAmount || prev.totalAmount,
          monthlySummary: monthly && Object.keys(monthly).length > 0 ? monthly : prev.monthlySummary
        }));
      }
    } catch (error) {
      console.error("User dashboard fetch failed", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  if (loading) {
    return <FullScreenLoader text="Loading dashboard..." />;
  }

  const chartData = [
    { name: "Jan", amount: dashboardData.monthlySummary.jan || 0 },
    { name: "Feb", amount: dashboardData.monthlySummary.feb || 0 },
    { name: "Mar", amount: dashboardData.monthlySummary.mar || 0 },
    { name: "Apr", amount: dashboardData.monthlySummary.apr || 0 },
    { name: "May", amount: dashboardData.monthlySummary.may || 0 },
    { name: "Jun", amount: dashboardData.monthlySummary.jun || 0 },
  ];

  const statsCardsData = [
    {
      title: "Total Contributed",
      value: `₹${dashboardData.totalAmount.toLocaleString("en-IN")}`,
      icon: <div className="p-2.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-100"><Wallet size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Donations Made",
      value: dashboardData.totalDonations,
      icon: <div className="p-2.5 rounded-sm bg-cyan-50 text-cyan-600 border border-cyan-100"><HandCoins size={20} /></div>,
      valueColor: "text-slate-800"
    },
    {
      title: "Causes Supported",
      value: dashboardData.activeCampaigns,
      icon: <div className="p-2.5 rounded-sm bg-purple-50 text-purple-600 border border-purple-100"><Heart size={20} /></div>,
      valueColor: "text-slate-800"
    }
  ];

  const transactionColumns = [
    { key: "id", header: "Transaction ID" },
    { key: "fund", header: "Campaign Fund" },
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
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome Back, {user?.name || "User"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here is a summary of your impactful contributions.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw size={15} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <StatsCards cards={statsCardsData} />

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Your Giving Trend</h3>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2.5} fill="#e0f2fe" />
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
          data={dashboardData.recentContributions} 
        />
      </div>

    </div>
  );
};

export default UserDashboard;
