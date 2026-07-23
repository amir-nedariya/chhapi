"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Landmark, Check, X, Clock } from "lucide-react";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";

const FundRequestsSuperAdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    try {
      setLoading(true);
      const data = JSON.parse(localStorage.getItem("chhapi_fund_requests") || "[]");
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load fund requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleNewRequest = () => {
      fetchRequests();
    };

    window.addEventListener("chhapi_new_fund_request", handleNewRequest);
    return () => window.removeEventListener("chhapi_new_fund_request", handleNewRequest);
  }, []);

  const handleAction = (requestId, status) => {
    try {
      const existingRequests = JSON.parse(localStorage.getItem("chhapi_fund_requests") || "[]");
      const updated = existingRequests.map((req) => {
        if (req._id === requestId) {
          return { ...req, status };
        }
        return req;
      });

      localStorage.setItem("chhapi_fund_requests", JSON.stringify(updated));
      setRequests(updated);

      // Dispatch event to update counts/badges in real-time
      window.dispatchEvent(new Event("chhapi_new_fund_request"));

      if (status === "Approved") {
        toast.success("✅ Fund request approved successfully!");
      } else {
        toast.error("❌ Fund request rejected.");
      }
    } catch (error) {
      toast.error("Failed to update fund request");
    }
  };

  const columns = [
    {
      key: "requester",
      header: "Requester Details",
      render: (_, req) => (
        <div>
          <div className="font-semibold text-gray-800 uppercase text-xs">{req.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{req.mobile}</div>
          <span className={`inline-block text-[10px] font-bold px-1.5 mt-1 rounded uppercase ${
            req.role === "ADMIN" 
              ? "bg-amber-50 text-amber-600 border border-amber-100" 
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}>
            {req.role}
          </span>
        </div>
      )
    },
    {
      key: "amount",
      header: "Requested Amount",
      align: "right",
      render: (_, req) => (
        <span className="font-bold text-gray-800 text-sm">
          ₹{req.amount.toLocaleString("en-IN")}
        </span>
      )
    },
    {
      key: "reason",
      header: "Purpose / Reason",
      render: (_, req) => (
        <div className="max-w-xs break-words text-sm text-gray-600">
          <p>{req.reason}</p>
          {req.photo && (
            <div className="mt-2">
              <a href={req.photo} target="_blank" rel="noreferrer" className="inline-block relative group cursor-zoom-in">
                <img
                  src={req.photo}
                  alt="Attachment"
                  className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105 transition-all"
                />
              </a>
            </div>
          )}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (_, req) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
          req.status === "Pending" 
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : req.status === "Approved"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-rose-50 text-rose-700 border-rose-200"
        }`}>
          {req.status === "Pending" && <Clock size={10} />}
          {req.status === "Approved" && <Check size={10} />}
          {req.status === "Rejected" && <X size={10} />}
          {req.status}
        </span>
      )
    },
    {
      key: "date",
      header: "Date",
      render: (_, req) => <span className="text-gray-500 font-medium text-xs">{new Date(req.createdAt).toLocaleDateString("en-GB")}</span>
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (_, req) => (
        req.status === "Pending" ? (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="success"
              size="sm"
              iconLeft={Check}
              onClick={() => handleAction(req._id, "Approved")}
            />
            <Button
              variant="danger"
              size="sm"
              iconLeft={X}
              onClick={() => handleAction(req._id, "Rejected")}
            />
          </div>
        ) : (
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Reviewed</span>
        )
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-6">

        <div className="flex items-center gap-3">
          <Landmark className="text-teal-700" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Fund Requests Review
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">Review, Approve or Reject budget requests submitted by Admins and Users</p>
          </div>
        </div>

        <Table 
          columns={columns}
          data={requests}
          isLoading={loading}
          emptyStateProps={{
            entityName: "Fund Requests",
            entityIcon: "Landmark"
          }}
        />

      </div>
    </div>
  );
};

export default FundRequestsSuperAdminPage;
