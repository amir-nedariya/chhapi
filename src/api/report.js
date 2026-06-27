import { getAllDonationsAPI } from "./donation.api";

export const jsonReportAPI = async (params) => {
  try {
    const res = await getAllDonationsAPI();
    const rawDonations = res.data?.data || [];

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Filter for Success and Pending donations for reporting, and format
    const mapped = rawDonations
      .filter(d => d.status === "Success" || d.status === "Pending")
      .map(d => ({
        donor: d.donorName || d.donor?.name || "Unknown Donor",
        mobile: d.donorMobile || "N/A",
        year: d.year || 2026,
        month: typeof d.month === "number" ? monthNames[d.month - 1] : (d.month || "January"),
        amount: d.amount || 0
      }));

    return { data: { data: mapped } };
  } catch (err) {
    return { data: { data: [] } };
  }
};

export const pdfReportAPI = async (params) => {
  return { data: new Blob(["Dummy PDF"], { type: "application/pdf" }) };
};

export const excelReportAPI = async (params) => {
  return { data: new Blob(["Dummy Excel"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }) };
};
