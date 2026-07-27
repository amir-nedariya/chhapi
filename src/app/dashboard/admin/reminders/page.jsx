"use client";
import { useEffect, useState, useMemo } from "react";
import { getMonthlyDonationTableAPI } from "../../../../api/donation.api";
import { getAllUsersOnlyAPI } from "../../../../api/user.api";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { MessageSquare, AlertCircle, Send, RefreshCw } from "lucide-react";
import FilterBar from "../../../../components/common/FilterBar";
import Table from "../../../../components/common/Table";
import Button from "../../../../components/common/Button";

const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthLabels = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const gujaratiMonths = {
  jan: "જાન્યુઆરી", feb: "ફેબ્રુઆરી", mar: "માર્ચ", apr: "એપ્રિલ", may: "મે", jun: "જૂન",
  jul: "જુલાઈ", aug: "ઑગસ્ટ", sep: "સપ્ટેમ્બર", oct: "ઓક્ટોબર", nov: "નવેમ્બર", dec: "ડિસેમ્બર"
};

const RemindersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const currentMonthIndex = new Date().getMonth();
  const [params, setParams] = useState({ search: "", month: monthKeys[currentMonthIndex] });
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    setSelectedUserIds([]);
  }, [params.month, params.search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [donationRes, usersRes] = await Promise.all([
        getMonthlyDonationTableAPI({ limit: 100 }),
        getAllUsersOnlyAPI()
      ]);
      
      const donationData = donationRes.data || donationRes.data?.data || [];
      const userProfiles = usersRes.data?.data || [];
      
      // Match creator names from userProfiles to donationData
      const merged = donationData.map(dUser => {
        const profile = userProfiles.find(p => p._id === dUser._id);
        return {
          ...dUser,
          createdByName: profile ? profile.createdByName : null
        };
      });
      
      // Filter: only show users created by the currently logged-in admin
      const loggedInAdminName = user?.name || "Demo Admin";
      const adminUsers = merged.filter(u => u.createdByName === loggedInAdminName);
      
      setUsers(adminUsers);
    } catch {
      toast.error("❌ Failed to load donor list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [user]);

  const pendingDonors = useMemo(() => {
    return users.filter(user => {
      const monthDonation = Number(user[params.month]) || 0;
      const isPending = monthDonation === 0;
      
      const matchesSearch = 
        user.name?.toLowerCase().includes(params.search.toLowerCase()) ||
        user.mobile?.includes(params.search);

      return isPending && matchesSearch;
    });
  }, [users, params.month, params.search]);

  const sendWhatsAppReminder = (userObj) => {
    const name = userObj.name || "દાતા";
    const phone = userObj.mobile ? userObj.mobile.replace(/[^\d]/g, '') : "";

    if (!phone) {
      toast.error(`❌ Mobile number not available for ${name}`);
      return;
    }

    const monthName = gujaratiMonths[params.month] || "";

    const message = `પ્રિય ${name},

આપનું ${monthName} મહિનાનું યોગદાન બાકી છે. "સેવા એ જ સાચો ધર્મ છે." તમારું નાનું સરખું દાન પણ કોઈ ગરીબ કે જરૂરિયાતમંદ માટે આશીર્વાદ સમાન બની શકે છે. આપણી કમાણીનો એક નાનો ભાગ સત્કર્મમાં લગાવીએ. 🤝❤️

— છપી ડોનેશન પોર્ટલ`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const sendSelectedReminders = () => {
    const selectedDonors = pendingDonors.filter(u => selectedUserIds.includes(u._id));
    if (selectedDonors.length === 0) {
      toast.error("❌ Please select at least one donor.");
      return;
    }

    const confirmSend = window.confirm(`This will open WhatsApp tabs for ${selectedDonors.length} selected donors. Please allow pop-ups in your browser. Do you want to proceed?`);
    if (!confirmSend) return;

    selectedDonors.forEach((userObj, index) => {
      setTimeout(() => {
        sendWhatsAppReminder(userObj);
      }, index * 1000); 
    });

    toast.success(`🚀 Opening WhatsApp tabs for ${selectedDonors.length} selected donors...`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const filterConfig = [
    { type: "search", name: "search", placeholder: "Search by name or phone..." },
    {
      type: "select",
      name: "month",
      options: monthKeys.map((key, index) => ({ label: `${monthLabels[index]} Reminders`, value: key }))
    }
  ];

  const columns = [
    {
      key: "checkbox",
      header: (
        <input 
          type="checkbox"
          checked={pendingDonors.length > 0 && selectedUserIds.length === pendingDonors.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUserIds(pendingDonors.map(u => u._id));
            } else {
              setSelectedUserIds([]);
            }
          }}
          className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
        />
      ),
      align: "center",
      render: (_, u) => (
        <input 
          type="checkbox"
          checked={selectedUserIds.includes(u._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUserIds(prev => [...prev, u._id]);
            } else {
              setSelectedUserIds(prev => prev.filter(id => id !== u._id));
            }
          }}
          className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
        />
      )
    },
    {
      key: "name",
      header: "Donor Name",
      render: (_, u) => <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
    },
    {
      key: "mobile",
      header: "Mobile Number",
      render: (_, u) => <span className="text-gray-600 text-sm">{u.mobile}</span>
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
          <AlertCircle size={12} /> Pending
        </span>
      )
    },
    {
      key: "action",
      header: "Send Reminder",
      align: "right",
      render: (_, u) => (
        <Button 
          variant="secondary"
          onClick={() => sendWhatsAppReminder(u)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
        >
          <Send size={12} />
          <span>Send</span>
        </Button>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-teal-700" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Pending Monthly Reminders
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Send WhatsApp reminders to donors who haven't contributed this month.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-600 transition cursor-pointer flex items-center justify-center"
            title="Refresh List"
          >
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {pendingDonors.length > 0 && (
            <Button 
              onClick={sendSelectedReminders}
              disabled={selectedUserIds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Send size={14} />
              <span>Send Selected ({selectedUserIds.length})</span>
            </Button>
          )}
        </div>
      </div>

      <FilterBar filters={filterConfig} params={params} onChange={handleFilterChange} />

      <Table 
        columns={columns}
        data={pendingDonors}
        isLoading={loading}
        emptyStateProps={{
          entityName: "Pending Reminders",
          entityIcon: "MessageSquare",
          search: params.search
        }}
      />
    </div>
  );
};

export default RemindersPage;
