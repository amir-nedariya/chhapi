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
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const aggregatedRows = [
    { _id: "u1", name: "Rahul Sharma", mobile: "9876543210", profilePhoto: { url: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=0e7490&color=fff" }, jan: 5000, feb: 0, mar: 12000, apr: 5000, may: 10000, jun: 5000, jul: 0, aug: 7500, sep: 0, oct: 0, nov: 2000, dec: 0 },
    { _id: "u2", name: "Priya Singh", mobile: "8765432109", profilePhoto: { url: "https://ui-avatars.com/api/?name=Priya+Singh&background=0e7490&color=fff" }, jan: 1200, feb: 1200, mar: 1200, apr: 1200, may: 1200, jun: 1200, jul: 1200, aug: 1200, sep: 1200, oct: 1200, nov: 1200, dec: 1200 },
    { _id: "u3", name: "Amit Kumar", mobile: "7654321098", profilePhoto: { url: "https://ui-avatars.com/api/?name=Amit+Kumar&background=0e7490&color=fff" }, jan: 0, feb: 10000, mar: 0, apr: 10000, may: 0, jun: 10000, jul: 0, aug: 10000, sep: 0, oct: 10000, nov: 0, dec: 10000 },
    { _id: "u4", name: "Sunita Devi", mobile: "6543210987", profilePhoto: { url: "https://ui-avatars.com/api/?name=Sunita+Devi&background=0e7490&color=fff" }, jan: 500, feb: 500, mar: 500, apr: 500, may: 500, jun: 500, jul: 500, aug: 500, sep: 500, oct: 500, nov: 500, dec: 500 },
    { _id: "u5", name: "Vikram Raj", mobile: "5432109876", profilePhoto: { url: "https://ui-avatars.com/api/?name=Vikram+Raj&background=0e7490&color=fff" }, jan: 2500, feb: 0, mar: 2500, apr: 0, may: 2500, jun: 2500, jul: 0, aug: 0, sep: 2500, oct: 0, nov: 0, dec: 2500 },
    { _id: "u6", name: "Rohan Verma", mobile: "9812345678", profilePhoto: { url: "https://ui-avatars.com/api/?name=Rohan+Verma&background=0e7490&color=fff" }, jan: 1500, feb: 1500, mar: 0, apr: 1500, may: 1500, jun: 1500, jul: 1500, aug: 1500, sep: 1500, oct: 1500, nov: 1500, dec: 1500 },
    { _id: "u7", name: "Neha Gupta", mobile: "8723456789", profilePhoto: { url: "https://ui-avatars.com/api/?name=Neha+Gupta&background=0e7490&color=fff" }, jan: 4500, feb: 0, mar: 4500, apr: 0, may: 4500, jun: 4500, jul: 0, aug: 4500, sep: 0, oct: 4500, nov: 0, dec: 4500 },
    { _id: "u8", name: "Sandeep Mishra", mobile: "7634567890", profilePhoto: { url: "https://ui-avatars.com/api/?name=Sandeep+Mishra&background=0e7490&color=fff" }, jan: 12000, feb: 12000, mar: 12000, apr: 12000, may: 12000, jun: 12000, jul: 12000, aug: 12000, sep: 12000, oct: 12000, nov: 12000, dec: 12000 },
    { _id: "u9", name: "Anjali Rao", mobile: "6545678901", profilePhoto: { url: "https://ui-avatars.com/api/?name=Anjali+Rao&background=0e7490&color=fff" }, jan: 3500, feb: 3500, mar: 3500, apr: 3500, may: 3500, jun: 3500, jul: 3500, aug: 3500, sep: 3500, oct: 3500, nov: 3500, dec: 3500 },
    { _id: "u10", name: "Karan Johar", mobile: "9456789012", profilePhoto: { url: "https://ui-avatars.com/api/?name=Karan+Johar&background=0e7490&color=fff" }, jan: 0, feb: 8000, mar: 0, apr: 8000, may: 0, jun: 8000, jul: 0, aug: 8000, sep: 0, oct: 8000, nov: 0, dec: 8000 },
    { _id: "u11", name: "Meera Patel", mobile: "8367890123", profilePhoto: { url: "https://ui-avatars.com/api/?name=Meera+Patel&background=0e7490&color=fff" }, jan: 6200, feb: 6200, mar: 6200, apr: 6200, may: 6200, jun: 6200, jul: 6200, aug: 6200, sep: 6200, oct: 6200, nov: 6200, dec: 6200 },
    { _id: "u12", name: "Aarav Mehta", mobile: "9876500111", profilePhoto: { url: "https://ui-avatars.com/api/?name=Aarav+Mehta&background=0e7490&color=fff" }, jan: 15000, feb: 0, mar: 15000, apr: 0, may: 15000, jun: 15000, jul: 0, aug: 15000, sep: 0, oct: 15000, nov: 0, dec: 15000 },
    { _id: "u13", name: "Deepika Padukone", mobile: "8765400222", profilePhoto: { url: "https://ui-avatars.com/api/?name=Deepika+Padukone&background=0e7490&color=fff" }, jan: 2000, feb: 2000, mar: 2000, apr: 2000, may: 2000, jun: 2000, jul: 2000, aug: 2000, sep: 2000, oct: 2000, nov: 2000, dec: 2000 },
    { _id: "u14", name: "Sanjay Dutt", mobile: "7654300333", profilePhoto: { url: "https://ui-avatars.com/api/?name=Sanjay+Dutt&background=0e7490&color=fff" }, jan: 10000, feb: 0, mar: 10000, apr: 0, may: 10000, jun: 10000, jul: 0, aug: 10000, sep: 0, oct: 10000, nov: 0, dec: 10000 },
    { _id: "u15", name: "Kriti Sanon", mobile: "6543200444", profilePhoto: { url: "https://ui-avatars.com/api/?name=Kriti+Sanon&background=0e7490&color=fff" }, jan: 5000, feb: 5000, mar: 5000, apr: 5000, may: 5000, jun: 5000, jul: 5000, aug: 5000, sep: 5000, oct: 5000, nov: 5000, dec: 5000 },
    { _id: "u16", name: "Ranbir Kapoor", mobile: "9988700555", profilePhoto: { url: "https://ui-avatars.com/api/?name=Ranbir+Kapoor&background=0e7490&color=fff" }, jan: 25000, feb: 25000, mar: 25000, apr: 25000, may: 25000, jun: 25000, jul: 25000, aug: 25000, sep: 25000, oct: 25000, nov: 25000, dec: 25000 },
    { _id: "u17", name: "Alia Bhatt", mobile: "8877600666", profilePhoto: { url: "https://ui-avatars.com/api/?name=Alia+Bhatt&background=0e7490&color=fff" }, jan: 12000, feb: 0, mar: 12000, apr: 0, may: 12000, jun: 12000, jul: 0, aug: 12000, sep: 0, oct: 12000, nov: 0, dec: 12000 },
    { _id: "u18", name: "Gaurav Sen", mobile: "7766500777", profilePhoto: { url: "https://ui-avatars.com/api/?name=Gaurav+Sen&background=0e7490&color=fff" }, jan: 3000, feb: 3000, mar: 3000, apr: 3000, may: 3000, jun: 3000, jul: 3000, aug: 3000, sep: 3000, oct: 3000, nov: 3000, dec: 3000 },
    { _id: "u19", name: "Siddharth Malhotra", mobile: "6655400888", profilePhoto: { url: "https://ui-avatars.com/api/?name=Siddharth+Malhotra&background=0e7490&color=fff" }, jan: 7500, feb: 7500, mar: 7500, apr: 7500, may: 7500, jun: 7500, jul: 7500, aug: 7500, sep: 7500, oct: 7500, nov: 7500, dec: 7500 },
    { _id: "u20", name: "Vikram Malhotra", mobile: "9876500999", profilePhoto: { url: "https://ui-avatars.com/api/?name=Vikram+Malhotra&background=0e7490&color=fff" }, jan: 15000, feb: 0, mar: 15000, apr: 0, may: 15000, jun: 15000, jul: 0, aug: 15000, sep: 0, oct: 15000, nov: 0, dec: 15000 },
    { _id: "u21", name: "Preeti Desai", mobile: "8765400888", profilePhoto: { url: "https://ui-avatars.com/api/?name=Preeti+Desai&background=0e7490&color=fff" }, jan: 2500, feb: 2500, mar: 2500, apr: 2500, may: 2500, jun: 2500, jul: 2500, aug: 2500, sep: 2500, oct: 2500, nov: 2500, dec: 2500 },
    { _id: "u22", name: "Ramesh Kumar", mobile: "7654300777", profilePhoto: { url: "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=0e7490&color=fff" }, jan: 1000, feb: 1000, mar: 1000, apr: 1000, may: 1000, jun: 1000, jul: 1000, aug: 1000, sep: 1000, oct: 1000, nov: 1000, dec: 1000 },
    { _id: "u23", name: "Suresh Singh", mobile: "6543200666", profilePhoto: { url: "https://ui-avatars.com/api/?name=Suresh+Singh&background=0e7490&color=fff" }, jan: 500, feb: 500, mar: 500, apr: 500, may: 500, jun: 500, jul: 500, aug: 500, sep: 500, oct: 500, nov: 500, dec: 500 },
    { _id: "u24", name: "Kabir Roy", mobile: "9988700444", profilePhoto: { url: "https://ui-avatars.com/api/?name=Kabir+Roy&background=0e7490&color=fff" }, jan: 35000, feb: 35000, mar: 35000, apr: 35000, may: 35000, jun: 35000, jul: 35000, aug: 35000, sep: 35000, oct: 35000, nov: 35000, dec: 35000 },
    { _id: "u25", name: "Zoya Khan", mobile: "8877600333", profilePhoto: { url: "https://ui-avatars.com/api/?name=Zoya+Khan&background=0e7490&color=fff" }, jan: 500, feb: 500, mar: 500, apr: 500, may: 500, jun: 500, jul: 500, aug: 500, sep: 500, oct: 500, nov: 500, dec: 500 }
  ];

  // Perform dynamic filtering if search requested
  let filteredRows = [...aggregatedRows];
  if (params.search) {
    const keyword = params.search.toLowerCase();
    filteredRows = filteredRows.filter(r => 
      r.name.toLowerCase().includes(keyword) || 
      r.mobile.includes(keyword)
    );
  }

  const totalRecords = filteredRows.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const slicedData = filteredRows.slice((page - 1) * limit, page * limit);

  return {
    success: true,
    data: slicedData,
    availableYears: [2026, 2025, 2024],
    filters: { year: "ALL", month: "ALL", paymentStatus: "ALL" },
    pagination: { page, limit, pages: totalPages, totalRecords }
  };
};
