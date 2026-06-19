"use client";
import { useEffect, useState } from "react";
import { User, CreditCard, BarChart3, Users } from "lucide-react";
import { superAdminDashboardAPI } from "../../../api/dashboard.api";

const SuperAdminDashboard = () => {
  const [metrics, setMetrics] = useState([
    { id: 1, title: "Total Users", value: 0, icon: <User className="text-cyan-600" /> },
    { id: 2, title: "Total Donations", value: 0, icon: <CreditCard className="text-green-600" /> },
    { id: 3, title: "Active Admins", value: 0, icon: <Users className="text-purple-600" /> },
    { id: 4, title: "Monthly Reports", value: 0, icon: <BarChart3 className="text-yellow-600" /> },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await superAdminDashboardAPI();
        if (res.data.success) {
          const { users, admins, superAdmins, donations } = res.data.data;
          setMetrics([
            { id: 1, title: "Total Users", value: users, icon: <User className="text-cyan-600" /> },
            { id: 2, title: "Total Donations", value: donations, icon: <CreditCard className="text-green-600" /> },
            { id: 3, title: "Active Admins", value: admins, icon: <Users className="text-purple-600" /> },
            { id: 4, title: "Super Admins", value: superAdmins, icon: <BarChart3 className="text-yellow-600" /> },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch Super Admin metrics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Super Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">Full system overview of users, donations, and reports.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Placeholder for Charts / Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 font-semibold mb-2">Monthly Donations Overview</h3>
          <div className="h-48 flex items-center justify-center text-slate-400">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-800 font-semibold mb-2">New Users This Month</h3>
          <div className="h-48 flex items-center justify-center text-slate-400">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
