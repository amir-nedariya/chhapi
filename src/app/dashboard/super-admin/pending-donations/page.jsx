"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  getPendingDonationsAPI,
  approveDonationAPI,
  rejectDonationAPI,
} from "../../../../api/donation.api";
import { Clock } from "lucide-react";
import Table from "../../../../components/common/Table";
import FilterBar from "../../../../components/common/FilterBar";
import DeleteConfirmModal from "../../../../components/common/DeleteConfirmModal";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const ITEMS_PER_PAGE = 10;

const PendingDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [params, setParams] = useState({ collector: "ALL", year: "ALL", month: "ALL" });
  const [page, setPage] = useState(1);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalState, setModalState] = useState("idle");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingDonationsAPI();
      setDonations(res?.data?.data || []);
    } catch {
      toast.error("❌ Failed to load pending donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approveDonation = async (id) => {
    try {
      setLoadingId(id);
      await approveDonationAPI(id);

      const donation = donations.find(d => d._id === id);
      if (donation) {
        const phone = donation.donorMobile || donation.donor?.mobile || "";
        const donorName = donation.donor?.name || donation.donorName || "Donor";
        const amount = donation.amount;
        const campaign = donation.remarks || "our campaigns";

        const messageText = `Hello *${donorName}*,\n\nWe are pleased to inform you that your donation of *₹${amount}* for *${campaign}* has been verified and approved successfully.\n\nThank you for your generous contribution and support! 🙏\n\n— *Chhapi Donation Portal*`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone.replace(/[^\d]/g, '')}&text=${encodeURIComponent(messageText)}`;

        window.open(whatsappUrl, "_blank");
      }

      toast.success("✅ Donation approved & WhatsApp chat opened");
      fetchPending();
    } catch {
      toast.error("❌ Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  const confirmRejection = async (id) => {
    try {
      setModalState("processing");
      await rejectDonationAPI(id);
      setModalState("success");
      toast.success("❌ Donation rejected");
      fetchPending();
      setTimeout(() => {
        setRejectModalOpen(false);
        setSelectedDonation(null);
        setModalState("idle");
      }, 1500);
    } catch {
      setModalState("error");
      toast.error("❌ Rejection failed");
      setTimeout(() => {
        setRejectModalOpen(false);
        setSelectedDonation(null);
        setModalState("idle");
      }, 1500);
    }
  };

  const collectors = useMemo(() => [
    ...new Set(donations.map((d) => d.collectedBy?.name).filter(Boolean))
  ], [donations]);

  const years = useMemo(() => [
    ...new Set(donations.map(d => d.year))
  ], [donations]);

  const months = useMemo(() => [
    ...new Set(donations.map(d => d.month))
  ], [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const collectorMatch = params.collector === "ALL" || d.collectedBy?.name === params.collector;
      const yearMatch = params.year === "ALL" || d.year === Number(params.year);
      const monthMatch = params.month === "ALL" || d.month === Number(params.month);
      return collectorMatch && yearMatch && monthMatch;
    });
  }, [donations, params.collector, params.year, params.month]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedData = filteredDonations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const filterConfig = [
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
        ...months.map(m => ({ label: monthNames[m - 1], value: m }))
      ]
    }
  ];

  const columns = [
    {
      key: "donor",
      header: "Donor",
      render: (_, d) => <span className="font-medium text-slate-800">{d.donor?.name || "N/A"}</span>
    },
    {
      key: "amount",
      header: "Amount",
      render: (_, d) => <span className="font-bold text-green-600">₹{d.amount}</span>
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
            onClick={() => approveDonation(d._id)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-sm transition-all"
          >
            {loadingId === d._id ? "..." : "Approve"}
          </button>
          <button
            disabled={loadingId !== null}
            onClick={() => { setSelectedDonation(d); setRejectModalOpen(true); }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-sm transition-all"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Clock size={24} className="text-teal-700" />
        <h2 className="text-2xl font-bold text-gray-800">Pending Donations</h2>
      </div>

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table
        columns={columns}
        data={paginatedData}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems: filteredDonations.length,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setPage
        }}
        emptyStateProps={{
          entityName: "Pending Donations",
          entityIcon: "Clock"
        }}
      />

      <DeleteConfirmModal
        isOpen={rejectModalOpen}
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
