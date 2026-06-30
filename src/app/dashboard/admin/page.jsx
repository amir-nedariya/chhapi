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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-cyan-600">
            <User size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Users</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">{dashboardData.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-green-600">
            <CreditCard size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Collection</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">₹{dashboardData.totalCollection.toLocaleString()}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-purple-600">
            <FolderHeart size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Campaigns</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">{dashboardData.activeCampaigns}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-xl bg-slate-100 text-amber-600">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Slips</p>
            <p className="text-xl font-bold text-slate-855 mt-0.5">{dashboardData.pendingVerifications}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Collection Trend</h3>
        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-slate-800 font-semibold mb-4 text-base">Recent Donations Slips</h3>
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

export default AdminDashboard;
