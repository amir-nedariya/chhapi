"use client";
import { useEffect, useState } from "react";
import { getFundHistoryAPI } from "../../../../api/fund.api";
import { ChevronLeft, ChevronRight, Landmark } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-1">
          <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-primary flex items-center justify-center">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              Fund Usage History
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Chronological record of expenses and withdrawals</p>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="rounded-xl space-y-6 border border-slate-200/50 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">
              Loading fund history...
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">
              No fund usage records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white font-semibold uppercase tracking-wider border-b border-slate-200/20">
                  <tr>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-left">Usage Note</th>
                    <th className="px-4 py-3">Authorized By</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >

                      <td className="px-4 py-3.5 font-semibold text-rose-600">
                        ₹{item.amount.toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {item.note}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{item.usedBy?.name}</span>
                          <span 
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase border ${
                              item.usedBy?.role?.toLowerCase() === 'admin' || item.usedBy?.role?.toLowerCase() === 'super-admin'
                                ? 'bg-primary/5 text-primary border-primary/10'
                                : 'bg-slate-50 text-slate-500 border-slate-100'
                            }`}
                          >
                            {item.usedBy?.role}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-end items-center gap-3 pb-5 px-5 sm:pb-6 sm:px-6">
              <PaginationButton
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                icon={<ChevronLeft size={14} />}
              />

              <span className="text-xs text-slate-500 font-medium px-1">
                Page {page} of {totalPages}
              </span>

              <PaginationButton
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                icon={<ChevronRight size={14} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* CLEAN PAGINATION BUTTON */
const PaginationButton = ({ icon, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="p-1.5 rounded-lg text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

export default FundHistory;
