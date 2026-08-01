"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  getPendingDonationsAPI,
  approveDonationAPI,
  bulkApproveDonationsAPI,
  rejectDonationAPI,
} from "../../../../api/donation.api";
import { Clock } from "lucide-react";
import Table from "../../../../components/common/Table";
import FilterBar from "../../../../components/common/FilterBar";
import DeleteConfirmModal from "../../../../components/common/DeleteConfirmModal";
import ApproveConfirmModal from "../../../../components/common/ApproveConfirmModal";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ITEMS_PER_PAGE = 10;

const PendingDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [params, setParams] = useState({
    collector: "ALL",
    month: "ALL",
    year: "ALL",
    search: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [collectors, setCollectors] = useState([]);
  const [years, setYears] = useState([]);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [bulkApproveModalOpen, setBulkApproveModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalState, setModalState] = useState("idle");
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  /* ===== FETCH ===== */
  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingDonationsAPI({
        ...params,
        collectedBy: params.collector,
        page,
        limit: ITEMS_PER_PAGE
      });
      setDonations(res?.data?.data || []);
      setCollectors(res?.data?.metadata?.collectors || []);
      setYears(res?.data?.metadata?.years || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalItems(res?.data?.pagination?.totalItems || 0);
      setSelectedIds([]); // Reset selection on page or filter change
    } catch {
      toast.error("Failed to load pending donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPending();
    }, 500);
    return () => clearTimeout(delay);
  }, [params.collector, params.month, params.year, params.search, page]);

  const confirmApproval = async (id) => {
    if (!id) return;
    try {
      setLoadingId(id);
      setApproveModalOpen(false);
      await approveDonationAPI(id);

      toast.success("Donation Approved!");
      fetchPending();
    } catch {
      toast.error("Failed to approve donation");
    } finally {
      setLoadingId(null);
      setSelectedDonation(null);
    }
  };

  const bulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsBulkApproving(true);
      setBulkApproveModalOpen(false);
      await bulkApproveDonationsAPI(selectedIds);
      toast.success(`✅ ${selectedIds.length} donations approved!`);
      setSelectedIds([]);
      fetchPending();
    } catch {
      toast.error("❌ Failed to approve some donations");
    } finally {
      setIsBulkApproving(false);
    }
  };

  const confirmRejection = async (id) => {
    if (!id) return;
    try {
      setModalState("processing");
      setRejectModalOpen(false);
      await rejectDonationAPI(id);
      toast.success("Donation Rejected");
      fetchPending();
    } catch {
      toast.error("Failed to reject donation");
    } finally {
      setModalState("idle");
      setLoadingId(null);
      setSelectedDonation(null);
    }
  };

  const handleFilterChange = (e) => {
    const target = e.target;
    const name = target.name || target.id || target.getAttribute("name");
    const value = target.value;
    if (name) {
      setParams(prev => ({ ...prev, [name]: value }));
      setPage(1);
    } else {
      console.error("Filter change missing name property", target);
    }
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search donor or collector..." },
    {
      type: "select",
      name: "collector",
      options: [
        { label: "All Collectors", value: "ALL" },
        ...collectors.map(c => ({ label: c, value: c }))
      ]
    },
    {
      type: "select",
      name: "year",
      options: [
        { label: "All Years", value: "ALL" },
        ...years.map(y => ({ label: y, value: y }))
      ]
    },
    {
      type: "select",
      name: "month",
      options: [
        { label: "All Months", value: "ALL" },
        ...monthNames.map((m, i) => ({ label: m, value: i + 1 }))
      ]
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(donations.map(d => d._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const columns = [
    {
      key: "select",
      header: (
        <input 
          type="checkbox" 
          checked={donations.length > 0 && selectedIds.length === donations.length}
          onChange={handleSelectAll}
          className="cursor-pointer w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      ),
      render: (_, d) => (
        <input 
          type="checkbox" 
          checked={selectedIds.includes(d._id)}
          onChange={(e) => handleSelectOne(e, d._id)}
          className="cursor-pointer w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      ),
      align: "center"
    },
    {
      key: "donor",
      header: "Donor",
      render: (_, d) => {
        const initial = (d.donor?.name || "U").charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 flex-shrink-0">
              <span className="text-teal-700 font-bold text-sm">{initial}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">{d.donor?.name || "—"}</span>
              <span className="text-xs text-slate-500">{d.donor?.mobile || "—"}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: "amount",
      header: "Amount",
      render: (_, d) => <span className="font-extrabold tracking-tight text-green-600">₹{(Number(d.amount) || 0).toLocaleString("en-IN")}</span>
    },
    {
      key: "collectedBy",
      header: "Collected By",
      render: (_, d) => (
        <span>
          {d.collectedBy?.name} <span className="text-xs text-slate-500">({d.collectedBy?.role})</span>
        </span>
      )
    },
    { key: "year", header: "Year", align: "center", render: (_, d) => d.year },
    { key: "month", header: "Month", align: "center", render: (_, d) => monthNames[d.month - 1] },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Pending
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, d) => (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={loadingId !== null}
            onClick={() => { setSelectedDonation(d); setApproveModalOpen(true); }}
            className="px-4 py-1.5 text-[13px] font-medium text-emerald-500 bg-transparent hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-500 rounded-md transition-all"
          >
            {loadingId === d._id ? "..." : "Approve"}
          </button>
          <button
            disabled={loadingId !== null}
            onClick={() => { setSelectedDonation(d); setRejectModalOpen(true); }}
            className="px-4 py-1.5 text-[13px] font-medium text-rose-500 bg-transparent hover:bg-rose-50 border border-rose-200 hover:border-rose-500 rounded-md transition-all"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="py-3 md:py-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Clock className="text-teal-700" size={24} />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Pending Donations
          </h1>
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setBulkApproveModalOpen(true)}
            disabled={isBulkApproving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isBulkApproving ? "Approving..." : `Approve Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table
        columns={columns}
        data={donations}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Pending Donations",
          entityIcon: "Clock"
        }}
      />

      <ApproveConfirmModal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={() => confirmApproval(selectedDonation?._id)}
        title="Approve Donation?"
        loading={loadingId !== null}
      />

      <ApproveConfirmModal
        open={bulkApproveModalOpen}
        onClose={() => setBulkApproveModalOpen(false)}
        onConfirm={bulkApprove}
        title={`Approve ${selectedIds.length} Donations?`}
        message={
          <>
            This action will <span className="font-medium text-gray-700">approve {selectedIds.length}</span> selected donations.
          </>
        }
        loading={isBulkApproving}
      />

      <DeleteConfirmModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={() => confirmRejection(selectedDonation?._id)}
        title="Reject Donation?"
        message={`Are you sure you want to reject the donation of ₹${selectedDonation?.amount} from ${selectedDonation?.donor?.name || "N/A"}? This action cannot be undone.`}
        isDeleting={modalState === "processing"}
      />
    </div>
  );
};

export default PendingDonations;
