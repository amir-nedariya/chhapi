"use client";
import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    user_management: "User Management",
    users_list: "Users List",
    pending_donations: "Pending Donations",
    send_reminders: "Send Reminders",
    reports: "Reports",
    all_donations: "All Donations",
    monthly_report: "Monthly Report",
    fund_management: "Fund Management",
    create_fund: "Create Fund",
    fund_summary: "Fund Summary",
    use_fund: "Use Fund",
    fund_history: "Fund History",
    fund_requests: "Fund Requests",
    leads: "Leads",
    rules: "Rules",
    settings: "Settings",
    logout: "Logout",
    my_donations_history: "My Donations History",
    my_donations: "My Donations",
    request_funds: "Request Funds",
    "rules_&_regulations": "Rules & Regulations",
    all_users: "All Users",
    appearance: "Appearance",
    admin_dashboard: "Admin Dashboard",
    overview_desc: "Overview of users, collections, and donations in your assigned area.",
    total_users: "Total Users",
    total_collection: "Total Collection",
    active_campaigns: "Active Campaigns",
    pending_verifications: "Pending Verifications",
    refresh: "Refresh",
    recent_donations_list: "Recent Donations",
    monthly_donations_trend: "Monthly Donations Trend",
    create_user: "Create User",
    created_by: "Created By",
    view_profile: "View Profile",
    no_users_found: "No users found.",
    active: "Active",
    inactive: "Inactive",
    password: "Password",
    user: "User",
    mobile: "Mobile",
    // General
    welcome: "Welcome",
    amount: "Amount",
    date: "Date",
    status: "Status",
    action: "Action",
    search: "Search",
    filter: "Filter",
    add: "Add",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    collector: "Collector",
    year: "Year",
    month: "Month",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    user_management: "उपयोगकर्ता प्रबंधन",
    users_list: "उपयोगकर्ता सूची",
    pending_donations: "लंबित दान",
    send_reminders: "रिमाइंडर भेजें",
    reports: "रिपोर्ट",
    all_donations: "सभी दान",
    monthly_report: "मासिक रिपोर्ट",
    fund_management: "निधि प्रबंधन",
    create_fund: "निधि बनाएं",
    fund_summary: "निधि सारांश",
    use_fund: "निधि का उपयोग",
    fund_history: "निधि इतिहास",
    fund_requests: "निधि अनुरोध",
    leads: "लीड्स",
    rules: "नियम",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    my_donations_history: "मेरा दान इतिहास",
    my_donations: "मेरा दान",
    request_funds: "निधि का अनुरोध",
    "rules_&_regulations": "नियम और विनियम",
    all_users: "सभी उपयोगकर्ता",
    appearance: "दिखावट",
    admin_dashboard: "एडमिन डैशबोर्ड",
    overview_desc: "आपके आवंटित क्षेत्र में उपयोगकर्ताओं, संग्रह और दान का अवलोकन।",
    total_users: "कुल उपयोगकर्ता",
    total_collection: "कुल संग्रह",
    active_campaigns: "सक्रिय अभियान",
    pending_verifications: "लंबित सत्यापन",
    refresh: "रिफ्रेश",
    recent_donations_list: "हाल ही के दान",
    monthly_donations_trend: "मासिक दान का रुझान",
    create_user: "उपयोगकर्ता बनाएं",
    created_by: "इसके द्वारा बनाया गया",
    view_profile: "प्रोफ़ाइल देखें",
    no_users_found: "कोई उपयोगकर्ता नहीं मिला।",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    password: "पासवर्ड",
    user: "उपयोगकर्ता",
    mobile: "मोबाइल",
    welcome: "स्वागत है",
    amount: "राशि",
    date: "दिनांक",
    status: "स्थिति",
    action: "कार्रवाई",
    search: "खोजें",
    filter: "फ़िल्टर",
    add: "जोड़ें",
    delete: "हटाएं",
    edit: "संपादित करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    name: "नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    role: "भूमिका",
    collector: "संग्रहकर्ता",
    year: "वर्ष",
    month: "महीना",
  },
  gu: {
    dashboard: "ડેશબોર્ડ",
    user_management: "વપરાશકર્તા સંચાલન",
    users_list: "વપરાશકર્તાઓની સૂચિ",
    pending_donations: "બાકી દાન",
    send_reminders: "યાદ અપાવો",
    reports: "અહેવાલો",
    all_donations: "તમામ દાન",
    monthly_report: "માસિક અહેવાલ",
    fund_management: "ફંડ મેનેજમેન્ટ",
    create_fund: "ફંડ બનાવો",
    fund_summary: "ફંડ વિહંગાવલોકન",
    use_fund: "ફંડનો ઉપયોગ",
    fund_history: "ફંડનો ઇતિહાસ",
    fund_requests: "ફંડ વિનંતીઓ",
    leads: "લીડ્સ",
    rules: "નિયમો",
    settings: "સેટિંગ્સ",
    logout: "લોગઆઉટ",
    my_donations_history: "મારો દાનનો ઇતિહાસ",
    my_donations: "મારું દાન",
    request_funds: "ફંડ વિનંતી",
    "rules_&_regulations": "નિયમો અને વિનિયમો",
    all_users: "બધા વપરાશકર્તાઓ",
    appearance: "દેખાવ",
    admin_dashboard: "એડમિન ડેશબોર્ડ",
    overview_desc: "તમારા સોંપેલ વિસ્તારમાં વપરાશકર્તાઓ, સંગ્રહો અને દાનની ઝાંખી.",
    total_users: "કુલ વપરાશકર્તાઓ",
    total_collection: "કુલ કલેક્શન",
    active_campaigns: "સક્રિય ઝુંબેશ",
    pending_verifications: "બાકી ચકાસણીઓ",
    refresh: "રીફ્રેશ",
    recent_donations_list: "તાજેતરના દાન",
    monthly_donations_trend: "માસિક દાન પ્રવાહ",
    create_user: "વપરાશકર્તા બનાવો",
    created_by: "દ્વારા બનાવવામાં આવેલ",
    view_profile: "પ્રોફાઇલ જુઓ",
    no_users_found: "કોઈ વપરાશકર્તા મળ્યા નથી.",
    active: "સક્રિય",
    inactive: "અનિયમિત",
    password: "પાસવર્ડ",
    user: "વપરાશકર્તા",
    mobile: "મોબાઈલ",
    welcome: "સ્વાગત છે",
    amount: "રકમ",
    date: "તારીખ",
    status: "સ્થિતિ",
    action: "પગલાં",
    search: "શોધો",
    filter: "ફિલ્ટર",
    add: "ઉમેરો",
    delete: "કાઢી નાખો",
    edit: "ફેરફાર કરો",
    save: "સાચવો",
    cancel: "રદ કરો",
    confirm: "ખાતરી કરો",
    name: "નામ",
    email: "ઇમેઇલ",
    phone: "ફોન",
    role: "ભૂમિકા",
    collector: "ઉઘરાવનાર",
    year: "વર્ષ",
    month: "મહિનો",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app_language") || "en";
    }
    return "en";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", lang);
      window.dispatchEvent(new Event("language-changed"));
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
