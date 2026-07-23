"use client";
import { useEffect, useState } from "react";
import { getFundHistoryAPI } from "../../../../api/fund.api";
import { Landmark } from "lucide-react";
import toast from "react-hot-toast";
import Table from "../../../../components/common/Table";

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

  const columns = [
    {
      key: "amount",
      header: "Amount",
      render: (_, item) => <span className="font-semibold text-rose-600">₹{item.amount.toLocaleString()}</span>
    },
    {
      key: "note",
      header: "Usage Note",
      render: (_, item) => <span className="text-gray-700 font-medium">{item.note}</span>
    },
    {
      key: "usedBy",
      header: "Authorized By",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{item.usedBy?.name}</span>
          <span 
            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase border ${
              item.usedBy?.role?.toLowerCase() === 'admin' || item.usedBy?.role?.toLowerCase() === 'super-admin'
                ? 'bg-teal-50 text-teal-700 border-teal-100'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          >
            {item.usedBy?.role}
          </span>
        </div>
      )
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (_, item) => (
        <span className="text-gray-500 font-medium text-xs">
          {new Date(item.createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Landmark className="text-teal-700" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Fund Usage History
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">Chronological record of expenses and withdrawals</p>
        </div>
      </div>

      <Table 
        columns={columns}
        data={funds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(funds.length / ITEMS_PER_PAGE),
          totalItems: funds.length,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Fund History Records",
          entityIcon: "Landmark"
        }}
      />
    </div>
  );
};

export default FundHistory;
