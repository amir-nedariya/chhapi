"use client";
import { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Users,
  Clock,
  RefreshCw,
  Download
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

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1250,
    totalDonations: 500000,
    activeAdmins: 14,
    pendingDonations: 28,
    recentDonations: [
      { id: "TX1001", name: "Rahul Sharma", email: "rahul@gmail.com", amount: 5000, date: "2026-06-18", status: "Success", fund: "Medical Relief" },
      { id: "TX1002", name: "Priya Singh", email: "priya@yahoo.com", amount: 1200, date: "2026-06-17", status: "Success", fund: "Education Fund" },
      { id: "TX1003", name: "Amit Kumar", email: "amit.k@outlook.com", amount: 10000, date: "2026-06-16", status: "Pending", fund: "Disaster Relief" },
      { id: "TX1004", name: "Sneha Patel", email: "sneha@gmail.com", amount: 8000, date: "2026-06-15", status: "Success", fund: "Animal Welfare" }
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
      const res = await superAdminDashboardAPI();
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
          monthlyTrends: apiData.chartData?.map((amt, idx) => ({
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][idx] || `M${idx+1}`,
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
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center sm:flex-row justify-between sm:items-center sm:text-left gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Full system overview of users, donations, and reports.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-cyan-600">
            <User size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Users</p>
            <p className="text-xl font-bold text-slate-850 mt-0.5">{dashboardData.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-green-600">
            <CreditCard size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Donations</p>
            <p className="text-xl font-bold text-slate-850 mt-0.5">₹{dashboardData.totalDonations.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-purple-600">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Admins</p>
            <p className="text-xl font-bold text-slate-850 mt-0.5">{dashboardData.activeAdmins}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-amber-600">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <p className="text-xl font-bold text-slate-850 mt-0.5">{dashboardData.pendingDonations}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Monthly Donations Overview</h3>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Recent Donations</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">Donor</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.recentDonations.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{tx.name}</p>
                    <p className="text-slate-400 text-xs">{tx.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{tx.fund}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
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

export default SuperAdminDashboard;
