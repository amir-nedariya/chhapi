"use client";
import { useEffect, useState } from "react";
import { getFundSummaryAPI, useFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  /* ================= LOAD FUNDS ================= */
  const loadFunds = async () => {
    try {
      const res = await getFundSummaryAPI();
      setFunds(res?.data?.data || []);
      setPage(1); // ✅ reset pagination
    } catch (err) {
      toast.error("Failed to load funds");
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  /* ================= TOGGLE FUND ================= */
  const toggleFund = (fund) => {
    setSelectedFunds((prev) =>
      prev.some((f) => f._id === fund._id)
        ? prev.filter((f) => f._id !== fund._id)
        : [...prev, fund]
    );
  };

  /* ================= PAGINATION ================= */
  const availableFunds = funds.filter(f => f.remainingAmount > 0);
  const totalPages = Math.ceil(availableFunds.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const paginatedFunds = availableFunds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= SUBMIT ================= */
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

      await Promise.all(
        usageList.map(item =>
          useFundAPI({
            fundId: item.fundId,
            amount: item.amount,
            note: note.trim() || "—", // ✅ safe note
          })
        )
      );

      toast.success("Fund used successfully");

      setSelectedFunds([]);
      setAmount("");
      setNote("");

      await loadFunds();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Fund usage failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ================= USE FUND FORM ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Use Fund
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="text-sm text-gray-400">
              Total Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#020617] text-white border border-white/10"
              placeholder="500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Usage Note
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#020617] text-white border border-white/10"
              placeholder="Emergency support"
            />
          </div>

          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Use Fund"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= SELECT FUNDS ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Select Funds
        </h2>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3">Select</th>
                <th className="px-4 py-3 text-left">Fund</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Remaining</th>
              </tr>
            </thead>

            <tbody>
              {paginatedFunds.map((fund) => (
                <tr
                  key={fund._id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedFunds.some(f => f._id === fund._id)}
                      onChange={() => toggleFund(fund)}
                      disabled={loading}
                    />
                  </td>

                  <td className="px-4 py-3 text-white font-medium">
                    {fund.title}
                  </td>

                  <td className="px-4 py-3 text-gray-400 text-center">
                    {monthNames[fund.month - 1]} {fund.year}
                  </td>

                  <td className="px-4 py-3 text-right text-green-400 font-semibold">
                    ₹{fund.remainingAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!paginatedFunds.length && (
            <div className="p-6 text-center text-gray-400">
              No available funds
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-3 mt-5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UseFund;
