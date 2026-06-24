// Mock Donation API

const dummyDonationData = [
  { _id: "d1", donorName: "Rahul Sharma", amount: 5000, date: "2026-06-18", status: "Success", paymentMethod: "UPI", donorMobile: "9876543210", remarks: "For education" },
  { _id: "d2", donorName: "Priya Singh", amount: 1200, date: "2026-06-17", status: "Success", paymentMethod: "Card", donorMobile: "8765432109", remarks: "General Fund" },
  { _id: "d3", donorName: "Amit Kumar", amount: 10000, date: "2026-06-16", status: "Pending", paymentMethod: "Cash", donorMobile: "7654321098", remarks: "Medical Camp" },
  { _id: "d4", donorName: "Sunita Devi", amount: 500, date: "2026-06-15", status: "Success", paymentMethod: "UPI", donorMobile: "6543210987", remarks: "" },
  { _id: "d5", donorName: "Vikram Raj", amount: 2500, date: "2026-06-14", status: "Failed", paymentMethod: "NetBanking", donorMobile: "5432109876", remarks: "Food distribution" },
  { _id: "d6", donorName: "Rohan Verma", amount: 1500, date: "2026-06-24", status: "Pending", paymentMethod: "UPI", donorMobile: "9812345678", remarks: "Book Donation" },
  { _id: "d7", donorName: "Neha Gupta", amount: 4500, date: "2026-06-23", status: "Pending", paymentMethod: "Cash", donorMobile: "8723456789", remarks: "Blanket Drive" },
  { _id: "d8", donorName: "Sandeep Mishra", amount: 12000, date: "2026-06-22", status: "Pending", paymentMethod: "NetBanking", donorMobile: "7634567890", remarks: "Orphanage Support" },
  { _id: "d9", donorName: "Anjali Rao", amount: 3500, date: "2026-06-21", status: "Pending", paymentMethod: "Card", donorMobile: "6545678901", remarks: "Tree Plantation" },
  { _id: "d10", donorName: "Karan Johar", amount: 8000, date: "2026-06-20", status: "Pending", paymentMethod: "UPI", donorMobile: "9456789012", remarks: "Cow Shelter Feed" },
  { _id: "d11", donorName: "Meera Patel", amount: 6200, date: "2026-06-19", status: "Pending", paymentMethod: "Cash", donorMobile: "8367890123", remarks: "Temple Renovation" }
];

export const createDonationAPI = async (data) => {
  return { data: { message: "Donation recorded successfully" } };
};

export const getMyDonationsAPI = async () => {
  return { data: { data: dummyDonationData } };
};

export const getPendingDonationsAPI = async () => {
  return { data: { data: dummyDonationData.filter(d => d.status === "Pending") } };
};

export const approveDonationAPI = async (id) => {
  const donation = dummyDonationData.find(d => d._id === id);
  if (donation) {
    donation.status = "Success";
  }
  return { data: { message: "Donation approved successfully" } };
};

export const getAllDonationsAPI = async () => {
  return { data: { data: dummyDonationData } };
};

export const viewDonationsAPI = async () => {
  return { data: { data: dummyDonationData } };
};

export const getDonationByIdAPI = async (id) => {
  return { data: { data: dummyDonationData.find(d => d._id === id) || dummyDonationData[0] } };
};

export const getMonthlyDonationTableAPI = async (params = {}) => {
  return {
    success: true,
    data: dummyDonationData,
    availableYears: [2026, 2025, 2024],
    filters: { year: "ALL", month: "ALL", paymentStatus: "ALL" },
    pagination: { page: 1, limit: 10, totalPages: 1, totalRecords: dummyDonationData.length }
  };
};
