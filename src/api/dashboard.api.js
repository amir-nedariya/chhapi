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
      recentUsers: [
        { _id: "u1", name: "Rohan Das", email: "rohan@gmail.com", role: "USER", date: "2026-08-01" },
        { _id: "u2", name: "Sneha Patel", email: "sneha@yahoo.com", role: "ADMIN", date: "2026-08-02" },
        { _id: "u3", name: "Vikas Verma", email: "vikas@outlook.com", role: "USER", date: "2026-08-03" }
      ],
      chartData: [1000, 2000, 1500, 3000, 5000, 4000]
    }
  }
};

export const userDashboardAPI = async (params) => dummyStats;
export const adminDashboardAPI = async (params) => dummyStats;
export const superAdminDashboardAPI = async (params) => {
  const year = params?.year || new Date().getFullYear();
  // Simulate data changing based on the year
  const baseChartData = [1000, 2000, 1500, 3000, 5000, 4000];
  const factor = year === new Date().getFullYear() ? 1 : 1 + ((year - new Date().getFullYear()) * 0.2);

  return {
    ...dummyStats,
    data: {
      ...dummyStats.data,
      data: {
        ...dummyStats.data.data,
        chartData: baseChartData.map(val => Math.round(val * factor))
      }
    }
  };
};
