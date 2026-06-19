"use client";
import { useEffect, useState } from "react";
import { getFundHistoryAPI } from "../../../../api/fund.api";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 8;

const FundHistory = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchFundHistory = async () => {
    try {
      setLoading(true);
      const res = await getFundHistoryAPI();

      if (res.data?.success) {
        setFunds(res.data.data || []);
      } else {
        setFunds([]);
      }
    } catch (error) {
      toast.error("Failed to load fund history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundHistory();
  }, []);

  /* PAGINATION */
  const totalPages = Math.ceil(funds.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = funds.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">
          Fund Usage History
        </h2>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading fund history...
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No fund usage records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Amount (₹)</th>
                  <th className="px-5 py-3">Note</th>
                  <th className="px-5 py-3">Used By</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-5 py-3 text-gray-300">
                      {startIndex + index + 1}
                    </td>

                    <td className="px-5 py-3 font-semibold text-red-400">
                      ₹{item.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-3 text-gray-300">
                      {item.note}
                    </td>

                    <td className="px-5 py-3 text-gray-300">
                      {item.usedBy?.name}{" "}
                      <span className="text-xs text-gray-500">
                        ({item.usedBy?.role})
                      </span>
                    </td>

                    <td className="px-5 py-3 text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FundHistory;
