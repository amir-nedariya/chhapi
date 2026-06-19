// Mock Dashboard API

const dummyStats = {
  data: {
    data: {
      totalDonations: "₹ 5,00,000",
      totalUsers: 1250,
      activeUsers: 840,
      monthlyRevenue: "₹ 45,000",
      recentDonations: [
        { _id: "d1", name: "Rahul Sharma", amount: 5000, date: "2026-06-18", status: "Success" },
        { _id: "d2", name: "Priya Singh", amount: 1200, date: "2026-06-17", status: "Success" },
        { _id: "d3", name: "Amit Kumar", amount: 10000, date: "2026-06-16", status: "Pending" }
      ],
      chartData: [1000, 2000, 1500, 3000, 5000, 4000]
    }
  }
};

export const userDashboardAPI = async () => dummyStats;
export const adminDashboardAPI = async () => dummyStats;
export const superAdminDashboardAPI = async () => dummyStats;
