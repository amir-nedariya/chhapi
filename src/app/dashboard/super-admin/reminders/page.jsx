"use client";
import { useEffect, useState, useMemo } from "react";
import { getMonthlyDonationTableAPI } from "../../../../api/donation.api";
import { toast } from "react-hot-toast";
import { MessageSquare, AlertCircle, CheckCircle, Send } from "lucide-react";
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

આપનું ${monthName} મહિનાનું યોગદાન બાકી છે. "સેવા એ જ સાચો ધર્મ છે." તમાrું નાનું સરખું દાન પણ કોઈ ગરીબ કે જરૂરિયાતમંદ માટે આશીર્વાદ સમાન બની શકે છે. આપણી કમાણીનો એક નાનો ભાગ સત્કર્મમાં લગાવીએ. 🤝❤️

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
      options: monthKeys.map((key, index) => ({
        label: `${monthLabels[index]} Reminders`,
        value: key
      }))
    }
  ];

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={pendingDonors.length > 0 && selectedUserIds.length === pendingDonors.length}
          onChange={(e) => {
            if (e.target.checked) setSelectedUserIds(pendingDonors.map(u => u._id));
            else setSelectedUserIds([]);
          }}
          className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
        />
      ),
      align: "center",
      render: (_, userObj) => (
        <input
          type="checkbox"
          checked={selectedUserIds.includes(userObj._id)}
          onChange={(e) => {
            if (e.target.checked) setSelectedUserIds(prev => [...prev, userObj._id]);
            else setSelectedUserIds(prev => prev.filter(id => id !== userObj._id));
          }}
          className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
        />
      )
    },
    {
      key: "donor",
      header: "Donor Details",
      render: (_, userObj) => (
        <div>
          <div className="font-semibold text-gray-700 uppercase tracking-wide">{userObj.name}</div>
          <div className="text-[10px] text-gray-500 font-medium mt-0.5">{userObj.mobile || "N/A"}</div>
        </div>
      )
    },
    {
      key: "status",
      header: "Donation Status",
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-[10px] bg-rose-50 text-rose-700 border border-rose-100">
          <AlertCircle size={10} />
          Not Paid
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, userObj) => (
        <Button
          variant="outline"
          size="sm"
          iconLeft={MessageSquare}
          onClick={() => { sendWhatsAppReminder(userObj); toast.success(`✉️ Opened chat for ${userObj.name}`); }}
        >
          Send WhatsApp
        </Button>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-teal-700" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Pending Monthly Reminders
            </h2>
            <p className="text-gray-500 text-sm mt-0.5 font-medium">Send WhatsApp reminders to donors who haven't contributed this month.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {pendingDonors.length > 0 && (
            <Button
              variant="success"
              iconLeft={Send}
              disabled={selectedUserIds.length === 0}
              onClick={sendSelectedReminders}
            >
              Send to Selected ({selectedUserIds.length})
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
          entityName: "Pending Donors",
          entityIcon: "MessageSquare",
          title: "All Caught Up!",
          description: "All donors have paid for this month! No reminders needed."
        }}
      />
    </div>
  );
};

export default RemindersPage;
