"use client";
import { useEffect, useState } from "react";
import { Wallet, HandCoins } from "lucide-react";
import { userDashboardAPI } from "../../../api/dashboard.api";
import FullScreenLoader from "../../../components/common/FullScreenLoader";

/* ================= MONTH MAP ================= */
const monthMap = [
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

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [monthly, setMonthly] = useState({});
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await userDashboardAPI();

        if (res.data.success) {
          const { user, monthly, totalDonations, totalAmount } =
            res.data.data;

          setUser(user);
          setMonthly(monthly);
          setTotalDonations(totalDonations);
          setTotalAmount(totalAmount);
        }
      } catch (error) {
        console.error("User dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ================= FULL SCREEN LOADER ================= */
  if (loading) {
    return <FullScreenLoader text="Loading dashboard..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome, {user?.name}
        </h2>
        <p className="text-slate-500 mt-1">
          Your donation activity overview
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-slate-100">
              <HandCoins className="text-cyan-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Donations</p>
              <p className="text-slate-800 font-bold text-xl">
                {totalDonations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-slate-100">
              <Wallet className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Amount</p>
              <p className="text-slate-800 font-bold text-xl">
                ₹{totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MONTHLY TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-slate-800 font-semibold mb-4">
          Monthly Donation Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-gray-200 text-slate-500">
                {monthMap.map((m) => (
                  <th key={m.key} className="py-2 px-3 text-left font-medium">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {monthMap.map((m) => (
                  <td key={m.key} className="py-3 px-3 text-slate-800">
                    ₹{monthly?.[m.key] || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
