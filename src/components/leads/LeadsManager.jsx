"use client";
import { useState, useEffect } from "react";
import { UserPlus, Target, Plus, Search, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import CreateUserModal from "../common/CreateUserModal";

const LeadsManager = ({ role }) => {
  const canConvert = role === "ADMIN" || role === "SUPER_ADMIN";

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  
  const [newLeadForm, setNewLeadForm] = useState({ name: "", mobile: "" });
  const [selectedLead, setSelectedLead] = useState(null);

  // Load from local storage for now
  useEffect(() => {
    const loadLeads = () => {
      const savedLeads = JSON.parse(localStorage.getItem("chhapi_leads") || "[]");
      setLeads(savedLeads);
    };
    loadLeads();
    window.addEventListener("chhapi_leads_updated", loadLeads);
    return () => {
      window.removeEventListener("chhapi_leads_updated", loadLeads);
    };
  }, []);

  const saveLeads = (updatedLeads) => {
    setLeads(updatedLeads);
    localStorage.setItem("chhapi_leads", JSON.stringify(updatedLeads));
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.mobile.trim()) {
      return toast.error("Name and Mobile are required");
    }
    if (!/^\d{10}$/.test(newLeadForm.mobile)) {
      return toast.error("Enter a valid 10-digit mobile number");
    }

    const newLead = {
      id: Date.now().toString(),
      name: newLeadForm.name,
      mobile: newLeadForm.mobile,
      status: "PENDING",
      addedAt: new Date().toISOString(),
    };

    saveLeads([newLead, ...leads]);
    setNewLeadForm({ name: "", mobile: "" });
    setIsAddModalOpen(false);
    toast.success("Lead added successfully!");
  };

  const handleConvertLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsConvertModalOpen(true);
  };

  const handleConversionSuccess = () => {
    if (!selectedLead) return;
    const updatedLeads = leads.filter(l => l.id !== selectedLead.id);
    saveLeads(updatedLeads);
    setSelectedLead(null);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.mobile.includes(search)
  );

  return (
    <div className="p-4 md:p-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Target className="text-teal-500" size={28} />
            Leads Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage potential donors before they become official users.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search leads by name or mobile..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 font-semibold text-slate-600 text-sm">Lead Details</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Contact</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Date Added</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Target size={40} className="opacity-20" />
                      <p>No leads found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{lead.mobile}</td>
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(lead.addedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      {lead.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
                          <Clock size={12} /> PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                          <CheckCircle size={12} /> CONVERTED
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {canConvert && lead.status === "PENDING" && (
                        <button
                          onClick={() => handleConvertLeadClick(lead)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          <UserPlus size={14} />
                          Convert to User
                        </button>
                      )}
                      {(!canConvert || lead.status === "CONVERTED") && (
                        <span className="text-xs text-slate-400 font-medium">
                          {lead.status === "CONVERTED" ? "Already Converted" : "No Permission"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={newLeadForm.name}
                  onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="Enter lead name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile</label>
                <input 
                  type="text" 
                  value={newLeadForm.mobile}
                  onChange={e => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 10) {
                      setNewLeadForm({...newLeadForm, mobile: val});
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="10 digit mobile number"
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-teal-500 hover:bg-teal-600 rounded-xl transition-colors shadow-md hover:shadow-lg">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT MODAL */}
      <CreateUserModal
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false);
          setSelectedLead(null);
        }}
        onSuccess={handleConversionSuccess}
        initialData={selectedLead}
      />
    </div>
  );
};

export default LeadsManager;
