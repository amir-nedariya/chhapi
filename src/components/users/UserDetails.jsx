"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Activity,
  IndianRupee,
  CreditCard,
  TrendingUp,
  Edit,
  UploadCloud,
  Trash2,
  Users,
  PlusCircle
} from "lucide-react";
import TicketBackground from "../common/TicketBackground";
import FullScreenLoader from "../common/FullScreenLoader";

import { 
  getUserByIdAPI,
  changeUserRoleAPI,
  softDeleteUserAPI
} from "../../api/user.api";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import Modal from "../common/Modal";
import {
  createDonationAPI,
  getDonationsByDonorIdAPI,
  updateDonationAPI,
} from "../../api/donation.api";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const monthNamesShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const UserDetails = ({ currentRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = currentRole === "SUPER_ADMIN" ? "/dashboard/super-admin" : currentRole === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
  const backPath = currentRole === "SUPER_ADMIN" ? `${basePath}/usersList` : currentRole === "ADMIN" ? `${basePath}/GetAllUser` : `${basePath}/all-users`;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("50");
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [donationLoading, setDonationLoading] = useState(false);

  // Edit Donation Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editMonth, setEditMonth] = useState(1);
  const [editYear, setEditYear] = useState(now.getFullYear());
  const [editStatus, setEditStatus] = useState("Success");
  const [editDonationLoading, setEditDonationLoading] = useState(false);

  // Filter year for Monthly Insights
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getUserByIdAPI(id);
      setUser(res.data.data);
    } catch {
      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await getDonationsByDonorIdAPI(id);
      setDonations(res.data.data || []);
    } catch {
      toast.error("Failed to load donations");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDonations();
  }, [id]);

  const handleCreateDonation = async () => {
    if (!amount || amount <= 0) return toast.error("Enter valid amount");
    try {
      setDonationLoading(true);
      await createDonationAPI({ donorId: id, amount: Number(amount), month, year, remarks: "" });
      toast.success("Donation added");
      setAmount("50");
      setShowModal(false);
      fetchDonations();
    } catch {
      toast.error("Failed to add donation");
    } finally {
      setDonationLoading(false);
    }
  };

  const handleUpdateDonation = async () => {
    if (!editAmount || editAmount <= 0) return toast.error("Enter valid amount");
    try {
      setEditDonationLoading(true);
      await updateDonationAPI(editingDonation._id, {
        amount: Number(editAmount), month: editMonth, year: editYear, status: editStatus, remarks: ""
      });
      toast.success("Donation updated successfully");
      setShowEditModal(false);
      fetchDonations();
    } catch {
      toast.error("Failed to update donation");
    } finally {
      setEditDonationLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await softDeleteUserAPI(user._id);
      toast.success("User deleted successfully");
      navigate(backPath);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteUserClick = () => {
    setDeleteModalOpen(true);
  };

  const handleRoleChange = async (newRole) => {
    try {
      await changeUserRoleAPI(user._id, { role: newRole });
      toast.success("Role updated successfully");
      fetchUser();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleMonthClick = (mIndex) => {
    if (currentRole === "USER") return;
    const d = donations.find(x => x.year === selectedYear && x.month === mIndex + 1);
    if (d) {
      setEditingDonation(d);
      setEditAmount(String(d.amount));
      setEditMonth(d.month);
      setEditYear(d.year);
      setEditStatus(d.status || "Success");
      setShowEditModal(true);
    } else {
      setMonth(mIndex + 1);
      setYear(selectedYear);
      setAmount("50");
      setShowModal(true);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-500">Loading...</div>;
  if (!user) return <div className="text-center py-20 font-bold text-rose-500">User not found</div>;

  const successfulDonations = donations.filter(d => d.status === "Success" || d.status === "Approved");
  const totalDonated = successfulDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const donationCount = successfulDonations.length;
  const avgDonation = donationCount > 0 ? Math.round(totalDonated / donationCount) : 0;

  // Yearly Distribution
  const yearlyData = {};
  successfulDonations.forEach(d => {
    yearlyData[d.year] = (yearlyData[d.year] || 0) + d.amount;
  });
  const years = Object.keys(yearlyData).sort();
  if (!years.includes(String(now.getFullYear()))) {
    years.push(String(now.getFullYear()));
    yearlyData[now.getFullYear()] = 0;
  }
  
  // Available years for dropdown
  const availableYears = [...new Set([...years, String(now.getFullYear())])].sort((a,b) => b - a);

  // Determine avatar initials
  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2) : "NA";

  return (
    <div className="p-4 md:p-6 space-y-6 text-slate-800 bg-[#F4F7FE] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-lg"><Users size={20} /></div>
          <h2 className="text-xl font-bold text-[#2B3674]">User Profile & Insights</h2>
        </div>
        <button onClick={() => navigate(backPath)} className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition">
          <ArrowLeft size={14} /> Back to Users List
        </button>
      </div>

      {/* 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center">
            {/* Top Blue Banner */}
            <div className="h-24 w-full bg-[#EEF2FF]"></div>
            
            {/* Avatar */}
            <div className="-mt-12 mb-3">
              {user.profilePhoto?.url && user.profilePhoto.url !== "/avatar.png" ? (
                <img src={user.profilePhoto.url} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-orange-400 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm">
                  {initials}
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-[#2B3674] uppercase tracking-wide">{user.name}</h3>
            <p className="text-xs text-slate-400 font-medium mb-3">{user.mobile}</p>
            
            <span className="px-4 py-1 mb-6 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-600 uppercase tracking-widest border border-cyan-100">
              {user.role}
            </span>

            <div className="w-full px-6 pb-6 space-y-3">
              {currentRole !== "USER" && (
                <button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111C44] hover:bg-[#1A2859] text-white font-bold text-xs transition">
                  <PlusCircle size={14} /> Add New Donation
                </button>
              )}
              {currentRole !== "USER" && (
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-not-allowed" disabled>
                  <UploadCloud size={14} /> Upload Photo
                </button>
              )}

              {currentRole === "SUPER_ADMIN" && (
                <button 
                  onClick={handleDeleteUserClick} 
                  className="w-full mt-2 py-2.5 rounded-lg border border-rose-200 text-rose-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition"
                >
                  <Trash2 size={16} /> Delete User
                </button>
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-5">System Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-50 text-blue-500"><UserIcon size={14} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Created By</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{user.createdByName || "System"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-blue-50 text-blue-500"><Calendar size={14} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Created At</p>
                  <p className="text-sm font-semibold text-[#2B3674] mt-0.5">{new Date(user.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-500"><Activity size={14} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <p className={`text-sm font-bold ${user.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>{user.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Switcher */}
            {currentRole !== "USER" && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="text-[10px] text-slate-800 font-bold uppercase tracking-widest mb-2 block">User Role</label>
                <select 
                  value={user.role} 
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#2B3674] outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT AREA (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <IndianRupee size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Donated</p>
                <p className="text-xl font-extrabold text-[#2B3674] mt-0.5">₹{totalDonated.toLocaleString('en-IN')}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donation Count</p>
                <p className="text-xl font-extrabold text-[#2B3674] mt-0.5">{donationCount} <span className="text-sm font-medium text-slate-400">times</span></p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg. Donation</p>
                <p className="text-xl font-extrabold text-[#2B3674] mt-0.5">₹{avgDonation.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Yearly Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-cyan-500" />
              <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">Yearly Distribution</h4>
            </div>
            <div className="space-y-5">
              {years.map(y => {
                const amount = yearlyData[y];
                const pct = totalDonated > 0 ? Math.round((amount / totalDonated) * 100) : 0;
                return (
                  <div key={y}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold text-[#2B3674]">{y}</span>
                      <span className="text-sm font-bold text-[#2B3674]">₹{amount.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-medium ml-1">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#111C44] rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Insights */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-cyan-500" />
                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">Monthly Insights</h4>
              </div>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#2B3674] outline-none"
              >
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

          {/* MONTHS GRID */}
          <div className="w-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 px-1 pb-4">
              {monthNamesShort.map((mName, idx) => {
                const monthNum = idx + 1;
                const d = successfulDonations.find(x => x.year === selectedYear && x.month === monthNum);
                const isCurrentMonth = selectedYear === now.getFullYear() && monthNum === now.getMonth() + 1;
                const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && monthNum <= now.getMonth() + 1);
                
                let status = 'future';
                let amt = d ? d.amount : 0;

                if (d) {
                  status = 'paid';
                } else if (isPast) {
                  // If it's this month, but not paid yet -> current/pending? 
                  // Let's use 'missed' for past months, and 'current' for this month.
                  if (isCurrentMonth) {
                    status = 'current';
                  } else {
                    // Past months are usually missed. Let's color them red.
                    // Or if we have a "pending" status (like FEB in the image), we can use amber.
                    // For now, if past and no donation -> missed.
                    status = 'missed';
                  }
                } else if (isCurrentMonth) {
                  status = 'current';
                }
                
                let ticketClass = "group relative flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 h-[90px] w-full ";

                return (
                  <div key={idx} className={ticketClass}>
                    {/* SVG BACKGROUND */}
                    <TicketBackground status={status} />

                    {/* CONTENT */}
                    <div className="flex items-center justify-between relative z-10 w-full px-1 sm:px-3 pointer-events-none">
                      {/* Empty Circle Indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 ${status === 'paid' || status === 'current' ? 'border-[#22c55e]' : 'border-[#cbd5e1]'} bg-white shrink-0`}></div>
                      
                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${status === 'paid' ? 'text-[#166534]' : status === 'missed' ? 'text-[#991b1b]' : status === 'current' ? 'text-[#075985]' : status === 'pending' ? 'text-[#92400e]' : 'text-[#475569]'}`}>
                          {mName}
                        </span>
                        <span className={`text-2xl font-bold tracking-tight leading-none ${status === 'paid' ? 'text-[#166534]' : status === 'missed' ? 'text-[#991b1b]' : status === 'current' ? 'text-[#075985]' : status === 'pending' ? 'text-[#92400e]' : 'text-[#475569]'}`}>₹{amt}</span>
                      </div>

                      {/* EDIT ICON */}
                      <div className="pointer-events-auto relative z-20">
                        {currentRole !== "USER" && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleMonthClick(idx); }} 
                            className={`p-2 rounded-full transition-transform hover:scale-110 cursor-pointer ${status === 'paid' ? 'bg-[#dcfce7]' : status === 'current' ? 'bg-[#e0f2fe]' : status === 'pending' ? 'bg-[#fef3c7]' : status === 'missed' ? 'bg-[#fee2e2]' : 'bg-black/5'}`}
                          >
                            <Edit size={16} className={status === 'paid' ? 'text-[#166534]' : status === 'current' ? 'text-[#0369a1]' : status === 'pending' ? 'text-[#92400e]' : status === 'missed' ? 'text-[#991b1b]' : 'text-current opacity-70'} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
      </div>

      {/* MODALS */}
      {currentRole !== "USER" && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} maxWidth="max-w-md">
          <Modal.Header onClose={() => setShowModal(false)}>Add New Donation</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Month</label>
                  <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none">
                    {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Year</label>
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none">
                    {[year-1, year, year+1].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
            <button onClick={handleCreateDonation} disabled={donationLoading} className="px-5 py-2.5 rounded-xl bg-[#111C44] text-white font-bold text-xs">{donationLoading ? "Adding..." : "Add Donation"}</button>
          </Modal.Footer>
        </Modal>
      )}

      {currentRole !== "USER" && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="max-w-md">
          <Modal.Header onClose={() => setShowEditModal(false)}>Edit Donation</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</label>
                <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Month</label>
                  <select value={editMonth} onChange={(e) => setEditMonth(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none">
                    {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Year</label>
                  <select value={editYear} onChange={(e) => setEditYear(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none">
                    {[editYear-1, editYear, editYear+1].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold outline-none">
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setShowEditModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
            <button onClick={handleUpdateDonation} disabled={editDonationLoading} className="px-5 py-2.5 rounded-xl bg-[#111C44] text-white font-bold text-xs">{editDonationLoading ? "Saving..." : "Save Changes"}</button>
          </Modal.Footer>
        </Modal>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={<>Are you sure you want to delete <strong>{user?.name}</strong>? This action will remove their access.</>}
        loading={deleteLoading}
      />
    </div>
  );
};

export default UserDetails;
