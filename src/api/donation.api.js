// Mock Donation API

const dummyDonationData = [
  { _id: "d1", donorName: "Rahul Sharma", donor: { name: "Rahul Sharma" }, amount: 5000, date: "2026-06-18", year: 2026, month: 6, status: "Success", paymentMethod: "UPI", donorMobile: "9876543210", remarks: "For education", collectedBy: { name: "Demo Admin", role: "ADMIN" } },
  { _id: "d2", donorName: "Priya Singh", donor: { name: "Priya Singh" }, amount: 1200, date: "2026-06-17", year: 2026, month: 6, status: "Success", paymentMethod: "Card", donorMobile: "8765432109", remarks: "General Fund", collectedBy: { name: "Ramesh Kumar", role: "USER" } },
  { _id: "d3", donorName: "Amit Kumar", donor: { name: "Amit Kumar" }, amount: 10000, date: "2026-06-16", year: 2026, month: 6, status: "Pending", paymentMethod: "Cash", donorMobile: "7654321098", remarks: "Medical Camp", collectedBy: { name: "Demo Admin", role: "ADMIN" } },
  { _id: "d4", donorName: "Sunita Devi", donor: { name: "Sunita Devi" }, amount: 500, date: "2026-06-15", year: 2026, month: 6, status: "Success", paymentMethod: "UPI", donorMobile: "6543210987", remarks: "", collectedBy: { name: "Suresh Singh", role: "ADMIN" } },
  { _id: "d5", donorName: "Vikram Raj", donor: { name: "Vikram Raj" }, amount: 2500, date: "2026-06-14", year: 2026, month: 6, status: "Failed", paymentMethod: "NetBanking", donorMobile: "5432109876", remarks: "Food distribution", collectedBy: { name: "Ramesh Kumar", role: "USER" } },
  { _id: "d6", donorName: "Rohan Verma", donor: { name: "Rohan Verma" }, amount: 1500, date: "2026-06-24", year: 2026, month: 6, status: "Pending", paymentMethod: "UPI", donorMobile: "9812345678", remarks: "Book Donation", collectedBy: { name: "Demo Admin", role: "ADMIN" } },
  { _id: "d7", donorName: "Neha Gupta", donor: { name: "Neha Gupta" }, amount: 4500, date: "2026-06-23", year: 2026, month: 6, status: "Pending", paymentMethod: "Cash", donorMobile: "8723456789", remarks: "Blanket Drive", collectedBy: { name: "Suresh Singh", role: "ADMIN" } },
  { _id: "d8", donorName: "Sandeep Mishra", donor: { name: "Sandeep Mishra" }, amount: 12000, date: "2026-06-22", year: 2026, month: 6, status: "Pending", paymentMethod: "NetBanking", donorMobile: "7634567890", remarks: "Orphanage Support", collectedBy: { name: "Ramesh Kumar", role: "USER" } },
  { _id: "d9", donorName: "Anjali Rao", donor: { name: "Anjali Rao" }, amount: 3500, date: "2026-06-21", year: 2026, month: 6, status: "Pending", paymentMethod: "Card", donorMobile: "6545678901", remarks: "Tree Plantation", collectedBy: { name: "Demo Admin", role: "ADMIN" } },
  { _id: "d10", donorName: "Karan Johar", donor: { name: "Karan Johar" }, amount: 8000, date: "2026-06-20", year: 2026, month: 6, status: "Pending", paymentMethod: "UPI", donorMobile: "9456789012", remarks: "Cow Shelter Feed", collectedBy: { name: "Suresh Singh", role: "ADMIN" } },
  { _id: "d11", donorName: "Meera Patel", donor: { name: "Meera Patel" }, amount: 6200, date: "2026-06-19", year: 2026, month: 6, status: "Pending", paymentMethod: "Cash", donorMobile: "8367890123", remarks: "Temple Renovation", collectedBy: { name: "Ramesh Kumar", role: "USER" } }
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

export const rejectDonationAPI = async (id) => {
  const donation = dummyDonationData.find(d => d._id === id);
  if (donation) {
    donation.status = "Failed";
  }
  return { data: { message: "Donation rejected successfully" } };
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
