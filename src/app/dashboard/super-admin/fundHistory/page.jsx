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

  // Neumorphic Styling Mappings
  const cardShadow = {
    boxShadow: "9px 9px 16px #b8c4d9, -9px -9px 16px #ffffff",
    backgroundColor: "#ecf0f3",
  };

  return (
    <div className="min-h-screen bg-[#ecf0f3] p-2 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-2">
          <div 
            className="p-3.5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff", backgroundColor: "#ecf0f3" }}
          >
            <Landmark className="text-cyan-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Fund Usage History
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-semibold">Chronological record of expenses and withdrawals</p>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="rounded-3xl p-8 space-y-6" style={cardShadow}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-bold">
              Loading fund history...
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold">
              No fund usage records found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl animate-fade-in" style={{ boxShadow: "inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff" }}>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-200/50">
                  <tr>
                    <th className="px-5 py-4 w-16">#</th>
                    <th className="px-5 py-4">Amount (₹)</th>
                    <th className="px-5 py-4 text-left">Usage Note</th>
                    <th className="px-5 py-4">Authorized By</th>
                    <th className="px-5 py-4">Timestamp</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200/30">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-200/20 transition-colors"
                    >
                      <td className="px-5 py-4 text-slate-500 font-bold">
                        {startIndex + index + 1}
                      </td>

                      <td className="px-5 py-4 font-black text-rose-600 text-base">
                        ₹{item.amount.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-slate-700 font-bold">
                        {item.note}
                      </td>

                      <td className="px-5 py-4 text-slate-700 font-bold">
                        <span>{item.usedBy?.name}</span>
                        <span 
                          className="text-[9px] px-2 py-0.5 rounded-full font-black ml-2 uppercase border"
                          style={{
                            boxShadow: "inset 1px 1px 2px #d1d9e6, inset -1px -1px 2px #ffffff",
                            backgroundColor: "#ecf0f3",
                            borderColor: "#e1e3e6",
                            color: "#5f6368"
                          }}
                        >
                          {item.usedBy?.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500 font-bold">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-end items-center gap-4 mt-8 pt-2">
              <PaginationButton
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                icon={<ChevronLeft size={18} />}
              />

              <span className="text-sm text-slate-600 font-bold px-1">
                Page {page} of {totalPages}
              </span>

              <PaginationButton
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                icon={<ChevronRight size={18} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* NEUMORPHIC PAGINATION BUTTON */
const PaginationButton = ({ icon, disabled, onClick }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="p-3 rounded-2xl text-slate-700 transition duration-300 disabled:opacity-40"
      style={
        pressed
          ? { boxShadow: "inset 2px 2px 4px #b8c4d9, inset -2px -2px 4px #ffffff", backgroundColor: "#ecf0f3" }
          : { boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff", backgroundColor: "#ecf0f3" }
      }
    >
      {icon}
    </button>
  );
};

export default FundHistory;
