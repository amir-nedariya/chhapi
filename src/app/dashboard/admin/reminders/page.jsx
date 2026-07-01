"use client";
import { useEffect, useState, useMemo } from "react";
import { getMonthlyDonationTableAPI } from "../../../../api/donation.api";
import { toast } from "react-hot-toast";
import { MessageSquare, Search, RefreshCw, AlertCircle, CheckCircle, Send } from "lucide-react";

const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthLabels = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const RemindersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Set current month as default (0 = Jan, 5 = June, etc.)
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(monthKeys[currentMonthIndex]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getMonthlyDonationTableAPI({ limit: 100 });
      if (res.success || res.data?.success) {
        setUsers(res.data || res.data?.data || []);
      }
    } catch {
      toast.error("❌ Failed to load donor list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const pendingDonors = useMemo(() => {
    return users.filter(user => {
      const monthDonation = Number(user[selectedMonth]) || 0;
      const isPending = monthDonation === 0;
      
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm);

      return isPending && matchesSearch;
    });
  }, [users, selectedMonth, searchTerm]);

  // WhatsApp click-to-chat function (100% free)
  const sendWhatsAppReminder = (userObj) => {
    const name = userObj.name || "દાતા";
    const phone = userObj.mobile ? userObj.mobile.replace(/[^\d]/g, '') : "";

    if (!phone) {
      toast.error(`❌ Mobile number not available for ${name}`);
      return;
    }

    const message = `પ્રિય ${name},

"સેવા એ જ સાચો ધર્મ છે." તમારું નાનું સરખું દાન પણ કોઈ ગરીબ કે જરૂરિયાતમંદ માટે આશીર્વાદ સમાન બની શકે છે. આપણી કમાણીનો એક નાનો ભાગ સત્કર્મમાં લગાવીએ. આજે જ જોડાઓ! 🤝❤️

— છપી ડોનેશન પોર્ટલ`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Bulk send reminders with a 1-second delay
  const sendAllReminders = () => {
    if (pendingDonors.length === 0) {
      toast.error("❌ No pending donors to remind for this month.");
      return;
    }

    const confirmSend = window.confirm(`This will open WhatsApp tabs for ${pendingDonors.length} donors. Please allow pop-ups in your browser. Do you want to proceed?`);
    if (!confirmSend) return;

    pendingDonors.forEach((userObj, index) => {
      setTimeout(() => {
        sendWhatsAppReminder(userObj);
      }, index * 1000); // 1-second staggered delay
    });

    toast.success(`🚀 Opening WhatsApp tabs for ${pendingDonors.length} donors...`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pending Monthly Reminders</h2>
          <p className="text-sm text-slate-500 mt-1">Send WhatsApp reminders to donors who haven't contributed this month.</p>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchUsers}
            className="flex items-center justify-center p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {pendingDonors.length > 0 && (
            <button 
              onClick={sendAllReminders}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Send size={15} />
              <span>Send to All ({pendingDonors.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white transition"
          />
        </div>

        {/* Month Selector */}
        <div className="w-full sm:w-48">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition cursor-pointer"
          >
            {monthKeys.map((key, index) => (
              <option key={key} value={key}>
                {monthLabels[index]} Reminders
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-semibold text-base">
            Pending Donors ({pendingDonors.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Month: {monthLabels[monthKeys.indexOf(selectedMonth)]}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white border-b border-teal-950/20 text-xs font-semibold">
              <tr>
                <th className="py-3 px-4 font-semibold">Donor Name</th>
                <th className="py-3 px-4 font-semibold">Mobile Number</th>
                <th className="py-3 px-4 font-semibold">Donation Status</th>
                <th className="py-3 px-4 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    Loading donor records...
                  </td>
                </tr>
              ) : pendingDonors.length > 0 ? (
                pendingDonors.map((userObj) => (
                  <tr key={userObj._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-850">{userObj.name}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{userObj.mobile || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                        <AlertCircle size={12} />
                        Not Paid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => { sendWhatsAppReminder(userObj); toast.success(`✉️ Opened chat for ${userObj.name}`); }}
                        className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-100 hover:border-emerald-600 font-semibold text-xs transition active:scale-95 cursor-pointer"
                      >
                        <MessageSquare size={13} className="fill-current stroke-none" />
                        <span>Send WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-emerald-600 font-medium">
                    <div className="flex flex-col items-center gap-1 justify-center">
                      <CheckCircle size={20} className="text-emerald-500" />
                      <span>All donors have paid for this month! No reminders needed.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RemindersPage;
