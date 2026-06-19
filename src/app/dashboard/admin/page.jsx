"use client";
import { useEffect, useState } from "react";
import { User, CreditCard } from "lucide-react";
import { adminDashboardAPI } from "../../../api/dashboard.api";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState([
    { id: 1, title: "Total Users", value: 0, icon: <User className="text-cyan-600" /> },
    { id: 2, title: "Total Collection", value: 0, icon: <CreditCard className="text-green-600" /> },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminDashboardAPI();
        if (res.data.success) {
          const { totalUsers, totalCollection } = res.data.data;
          setMetrics([
            { id: 1, title: "Total Users", value: totalUsers, icon: <User className="text-cyan-600" /> },
            { id: 2, title: "Total Collection", value: `₹${totalCollection}`, icon: <CreditCard className="text-green-600" /> },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch Admin metrics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">Overview of users and collections managed by the admin.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-slate-100">{m.icon}</div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{m.title}</p>
                <p className="text-slate-800 font-bold text-xl">{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
