"use client";
import { useEffect, useState } from "react";
import { getFundSummaryAPI, useFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";

const ITEMS_PER_PAGE = 12;

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const UseFund = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadFunds = async () => {
    try {
      const res = await getFundSummaryAPI();
      setFunds(res?.data?.data || []);
      setPage(1);
    } catch (err) {
      toast.error("Failed to load funds");
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  const toggleFund = (fund) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f._id === fund._id)
        ? prev.filter((f) => f._id !== fund._id)
        : [...prev, fund]
    );
  };

  const availableFunds = funds.filter(f => f.remainingAmount > 0);
  const totalPages = Math.ceil(availableFunds.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedFunds = availableFunds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!selectedFunds.length) {
      toast.error("Select at least one fund");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    const totalAvailable = selectedFunds.reduce(
      (sum, f) => sum + f.remainingAmount,
      0
    );

    if (Number(amount) > totalAvailable) {
      toast.error("Selected funds balance insufficient");
      return;
    }

    let remaining = Number(amount);

    const usageList = [...selectedFunds]
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      )
      .map((fund) => {
        const used = Math.min(fund.remainingAmount, remaining);
        remaining -= used;
        return { fundId: fund._id, amount: used };
      })
      .filter(item => item.amount > 0);

    try {
      setLoading(true);

      const responses = await Promise.all(
        usageList.map(item =>
          useFundAPI({
            fundId: item.fundId,
            amount: item.amount,
            note: note.trim() || "—",
          })
        )
      );

      const allSuccess = responses.every(r => r.data?.success);

      if (allSuccess) {
        toast.success("Fund used successfully");
        setSelectedFunds([]);
        setAmount("");
        setNote("");
        await loadFunds();
      } else {
        toast.error("Some fund allocations failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Fund usage failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "select",
      header: "Select",
      align: "center",
      render: (_, fund) => (
        <input
          type="checkbox"
          checked={selectedFunds.some(f => f._id === fund._id)}
          onChange={() => toggleFund(fund)}
          disabled={loading}
          className="w-4 h-4 rounded text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
        />
      )
    },
    {
      key: "title",
      header: "Fund Title",
      render: (_, fund) => <span className="font-bold text-gray-700 uppercase text-xs">{fund.title}</span>
    },
    {
      key: "month",
      header: "Month",
      align: "center",
      render: (_, fund) => <span className="text-gray-500 font-semibold text-xs">{monthNames[fund.month - 1]} {fund.year}</span>
    },
    {
      key: "remainingAmount",
      header: "Available Balance",
      align: "right",
      render: (_, fund) => <span className="text-emerald-600 font-bold text-xs">₹{fund.remainingAmount.toLocaleString("en-IN")}</span>
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Landmark className="text-teal-700" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Use Budget Fund
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">Record an expense transaction from allocated funds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-gray-800 font-bold text-lg mb-4 border-b border-gray-100 pb-3">
            Transaction Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-1">
                Total Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="e.g., 500"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-1">
                Usage Note / Remarks <span className="text-rose-500">*</span>
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                placeholder="e.g., Medicine Purchase"
              />
            </div>
            <div className="pt-2">
              <Button
                variant="solid"
                type="submit"
                loading={loading}
                className="w-full justify-center py-3"
              >
                {loading ? "Processing..." : "Submit Transaction"}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <Table 
            columns={columns}
            data={paginatedFunds}
            isLoading={loading}
            pagination={{
              currentPage: page,
              totalPages: totalPages,
              totalItems: availableFunds.length,
              itemsPerPage: ITEMS_PER_PAGE,
              onPageChange: setPage
            }}
            emptyStateProps={{
              entityName: "Active Funds",
              entityIcon: "Landmark"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UseFund;
