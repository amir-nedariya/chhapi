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

const gujaratiMonths = {
  jan: "જાન્યુઆરી",
  feb: "ફેબ્રુઆરી",
  mar: "માર્ચ",
  apr: "એપ્રિલ",
  may: "મે",
  jun: "જૂન",
  jul: "જુલાઈ",
  aug: "ઑગસ્ટ",
  sep: "સપ્ટેમ્બર",
  oct: "ઓક્ટોબર",
  nov: "નવેમ્બર",
  dec: "ડિસેમ્બર"
};

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

    const monthName = gujaratiMonths[selectedMonth] || "";

    const message = `પ્રિય ${name},

આપનું ${monthName} મહિનાનું યોગદાન બાકી છે. "સેવા એ જ સાચો ધર્મ છે." તમાrું નાનું સરખું દાન પણ કોઈ ગરીબ કે જરૂરિયાતમંદ માટે આશીર્વાદ સમાન બની શકે છે. આપણી કમાણીનો એક નાનો ભાગ સત્કર્મમાં લગાવીએ. 🤝❤️

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
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:justify-between gap-4 px-1">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3">
            <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-primary flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Pending Monthly Reminders
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">Send WhatsApp reminders to donors who haven't contributed this month.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button 
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-600 transition cursor-pointer flex items-center justify-center"
              title="Refresh List"
            >
              <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {pendingDonors.length > 0 && (
              <button 
                onClick={sendAllReminders}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-sm hover:shadow active:scale-98"
              >
                <Send size={12} />
                <span>Send to All ({pendingDonors.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="rounded-xl p-4 sm:p-5 border border-slate-200/50 bg-white shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none placeholder:text-slate-400 font-medium text-xs transition-colors bg-white"
            />
          </div>

          {/* Month Selector */}
          <div className="w-full sm:w-48">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-primary/45 rounded-lg text-slate-800 outline-none cursor-pointer font-medium text-xs transition-colors bg-white"
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
        <div className="rounded-xl py-5 sm:py-6 space-y-6 border border-slate-200/50 bg-white shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-1 px-5 sm:px-6">
            <h3 className="text-slate-800 font-semibold text-xs uppercase tracking-wider">
              Pending Donors ({pendingDonors.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Month: {monthLabels[monthKeys.indexOf(selectedMonth)]}
            </span>
          </div>

          <div className="overflow-x-auto border-t border-slate-200/40">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="bg-gradient-to-r from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] text-white text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 font-semibold border-b border-slate-200/10">Donor Details</th>
                  <th className="py-3 px-4 font-semibold border-b border-slate-200/10">Donation Status</th>
                  <th className="py-3 px-4 text-center font-semibold border-b border-slate-200/10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">
                      Loading donor records...
                    </td>
                  </tr>
                ) : pendingDonors.length > 0 ? (
                  pendingDonors.map((userObj) => (
                    <tr key={userObj._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700 uppercase tracking-wide">{userObj.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{userObj.mobile || "N/A"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[10px] bg-rose-50 text-rose-700 border border-rose-100">
                          <AlertCircle size={10} />
                          Not Paid
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => { sendWhatsAppReminder(userObj); toast.success(`✉️ Opened chat for ${userObj.name}`); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-100 hover:border-emerald-600 font-semibold text-xs transition active:scale-95 cursor-pointer"
                        >
                          <MessageSquare size={12} className="fill-current stroke-none" />
                          <span>Send WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-emerald-600 font-medium">
                      <div className="flex flex-col items-center gap-1 justify-center">
                        <CheckCircle size={18} className="text-emerald-500" />
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
    </div>
  );
};

export default RemindersPage;
