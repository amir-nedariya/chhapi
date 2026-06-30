// Mock Fund API

let dummyFunds = [
  { _id: "fund1", title: "Medical Assistance Fund", year: 2026, month: 6, totalAmount: 150000, usedAmount: 50000, remainingAmount: 100000 },
  { _id: "fund2", title: "Education Scholarship Fund", year: 2026, month: 5, totalAmount: 200000, usedAmount: 120000, remainingAmount: 80000 },
  { _id: "fund3", title: "Food Distribution Fund", year: 2026, month: 4, totalAmount: 100000, usedAmount: 90000, remainingAmount: 10000 },
  { _id: "fund4", title: "General Welfare Fund", year: 2026, month: 3, totalAmount: 300000, usedAmount: 150000, remainingAmount: 150000 },
  { _id: "fund5", title: "Disaster Relief Fund", year: 2025, month: 12, totalAmount: 250000, usedAmount: 250000, remainingAmount: 0 }
];

let dummyFundHistory = [
  { _id: "fh1", amount: 50000, note: "Medical equipment purchase for clinic", usedBy: { name: "Dr. Arvind", role: "ADMIN" }, createdAt: "2026-06-10T10:30:00.000Z" },
  { _id: "fh2", amount: 15000, note: "Monthly food ration for orphanage", usedBy: { name: "Demo Admin", role: "ADMIN" }, createdAt: "2026-06-05T14:45:00.000Z" },
  { _id: "fh3", amount: 120000, note: "Roof repair for local primary school", usedBy: { name: "Ramesh Engineer", role: "USER" }, createdAt: "2026-05-20T09:15:00.000Z" }
];

export const createFundAPI = async (data) => {
  const newFund = {
    _id: "fund" + (dummyFunds.length + 1),
    title: data.title,
    year: Number(data.year),
    month: Number(data.month),
    totalAmount: Number(data.totalAmount),
    usedAmount: 0,
    remainingAmount: Number(data.totalAmount)
  };
  dummyFunds.unshift(newFund); // Add to the top of list
  return { data: { success: true, message: "Fund created successfully" } };
};

export const getFundSummaryAPI = async () => {
  return {
    data: {
      success: true,
      data: dummyFunds
    }
  };
};

export const useFundAPI = async (data) => {
  const { fundId, amount, note } = data;
  const fund = dummyFunds.find(f => f._id === fundId);
  if (fund) {
    const amtNum = Number(amount);
    fund.usedAmount += amtNum;
    fund.remainingAmount -= amtNum;

    dummyFundHistory.unshift({
      _id: "fh" + (dummyFundHistory.length + 1),
      amount: amtNum,
      note: note || "Fund Usage",
      usedBy: { name: "Demo Super Admin", role: "SUPER_ADMIN" },
      createdAt: new Date().toISOString()
    });
  }
  return { data: { success: true, message: "Fund usage recorded" } };
};

export const getFundHistoryAPI = async () => {
  return {
    data: {
      success: true,
      data: dummyFundHistory
    }
  };
};
