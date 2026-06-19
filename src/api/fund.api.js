// Mock Fund API

export const createFundAPI = async (data) => {
  return { data: { message: "Fund created successfully" } };
};

export const getFundSummaryAPI = async () => {
  return {
    data: {
      data: {
        totalFundsReceived: 1000000,
        totalFundsUsed: 450000,
        currentBalance: 550000
      }
    }
  };
};

export const useFundAPI = async (data) => {
  return { data: { message: "Fund usage recorded" } };
};

export const getFundHistoryAPI = async () => {
  return {
    data: {
      data: [
        { _id: "f1", title: "Medical Camp Equipment", amountUsed: 50000, date: "2026-06-10", usedBy: { name: "Dr. Arvind" }, description: "Purchased beds and medicines." },
        { _id: "f2", title: "Orphanage Food Drive", amountUsed: 15000, date: "2026-06-05", usedBy: { name: "Super Admin" }, description: "Monthly ration." },
        { _id: "f3", title: "School Building Repair", amountUsed: 120000, date: "2026-05-20", usedBy: { name: "Ramesh Engineer" }, description: "Roofing materials." }
      ]
    }
  };
};
