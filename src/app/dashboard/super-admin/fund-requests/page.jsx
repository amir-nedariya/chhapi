"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Landmark, Check, X, AlertCircle, Clock, Calendar, CheckCircle } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center justify-between gap-4 px-1">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3">
            <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-primary flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Fund Requests Review
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">Review, Approve or Reject budget requests submitted by Admins and Users</p>
            </div>
          </div>
        </div>

        {/* Table List Card */}
        <div className="rounded-xl border border-slate-200/50 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto pb-1">
            <table className="min-w-full text-left text-slate-800 border-collapse">
              <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white text-xs font-semibold">
                <tr>
                  <th className="py-3.5 px-4 font-semibold border-b border-slate-200/10">Requester Details</th>
                  <th className="py-3.5 px-4 font-semibold border-b border-slate-200/10 text-right">Requested Amount</th>
                  <th className="py-3.5 px-4 font-semibold border-b border-slate-200/10">Purpose / Reason</th>
                  <th className="py-3.5 px-4 font-semibold border-b border-slate-200/10 text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold border-b border-slate-200/10">Date</th>
                  <th className="py-3.5 px-4 text-center font-semibold border-b border-slate-200/10">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium text-xs">
                      Loading fund requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-xs">
                      <div className="flex flex-col items-center gap-1 justify-center">
                        <CheckCircle size={22} className="text-emerald-500" />
                        <span>No fund requests submitted yet.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Requester Details */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-700 uppercase tracking-wide text-xs">{req.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{req.mobile}</div>
                        <span className={`inline-block text-[8px] font-bold px-1.5 py-0.2 mt-1 border rounded uppercase ${
                          req.role === "ADMIN" 
                            ? "bg-amber-50 text-amber-600 border-amber-100" 
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}>
                          {req.role}
                        </span>
                      </td>

                      {/* Requested Amount */}
                      <td className="py-4 px-4 text-right font-bold text-slate-800 text-xs whitespace-nowrap">
                        ₹{req.amount.toLocaleString("en-IN")}
                      </td>

                      {/* Purpose */}
                      <td className="py-4 px-4 text-slate-600 font-medium text-xs max-w-xs break-words">
                        <p>{req.reason}</p>
                        {req.photo && (
                          <div className="mt-2">
                            <a href={req.photo} target="_blank" rel="noreferrer" className="inline-block relative group cursor-zoom-in">
                              <img
                                src={req.photo}
                                alt="Attachment"
                                className="w-12 h-12 object-cover rounded-lg border border-slate-250 shadow-2xs hover:scale-105 transition-all"
                              />
                              <span className="absolute bottom-0 right-0 bg-black/50 text-white text-[8px] font-semibold px-1 rounded-br-lg rounded-tl-lg">
                                View
                              </span>
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[9px] border ${
                          req.status === "Pending" 
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : req.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {req.status === "Pending" && <Clock size={10} />}
                          {req.status === "Approved" && <Check size={10} />}
                          {req.status === "Rejected" && <X size={10} />}
                          {req.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString("en-GB")}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {req.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAction(req._id, "Approved")}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition active:scale-95 cursor-pointer border border-emerald-100 hover:border-emerald-600"
                              title="Approve Request"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleAction(req._id, "Rejected")}
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg transition active:scale-95 cursor-pointer border border-rose-100 hover:border-rose-600"
                              title="Reject Request"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FundRequestsSuperAdminPage;
