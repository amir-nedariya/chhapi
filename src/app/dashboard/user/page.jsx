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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-emerald-600">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Contributed</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">₹{dashboardData.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-cyan-600">
            <HandCoins size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Donations Made</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">{dashboardData.totalDonations}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-purple-600">
            <Heart size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Causes Supported</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">{dashboardData.activeCampaigns}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Your Giving Trend</h3>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Recent Contributions</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Campaign Fund</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.recentContributions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 text-slate-500 font-medium">{tx.id}</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{tx.fund}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tx.status === "Success" ? "bg-emerald-50 text-emerald-700" :
                      tx.status === "Pending" ? "bg-amber-50 text-amber-700" :
                      "bg-rose-50 text-rose-700"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
