import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Sun,
  Landmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Clock,
  BarChart3,
  PlusCircle,
  PieChart,
  Send,
  History,
  Coins,
  CalendarRange,
  MessageCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useSidebarColor } from "../../hooks/useSidebarColor";
import { themes, applyTheme, initTheme } from "../../utils/theme";

const SuperAdminSidebar = ({ collapsed, setCollapsed, mobile, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const sidebarColor = useSidebarColor();
  const [currentTheme, setCurrentTheme] = useState("Classic Teal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      initTheme();
      const saved = localStorage.getItem("selected-sidebar-theme") || "Classic Teal";
      setCurrentTheme(saved);

      const handleExternalChange = () => {
        const current = localStorage.getItem("selected-sidebar-theme") || "Classic Teal";
        setCurrentTheme(current);
      };

      window.addEventListener("sidebar-theme-changed", handleExternalChange);
      return () => window.removeEventListener("sidebar-theme-changed", handleExternalChange);
    }
  }, []);

  const handleThemeChange = (t) => {
    applyTheme(t);
    setCurrentTheme(t.name);
    window.dispatchEvent(new Event("sidebar-theme-changed"));
  };

  // dropdown states
  const [userMgmtOpen, setUserMgmtOpen] = useState(
    location.pathname.includes("/createAdmin") || location.pathname.includes("/usersList") || location.pathname.includes("/pending-donations") || location.pathname.includes("/reports") || location.pathname.includes("/reminders")
  );
  const [fundOpen, setFundOpen] = useState(location.pathname.includes("/fund"));
  const [allDonationOpen, setAllDonationOpen] = useState(
    location.pathname.includes("/all-donations") || location.pathname.includes("/monthlyDonationTable")
  );

  // menu data
  const userMgmtMenu = [
    { name: "Users List", path: "/dashboard/super-admin/usersList", icon: UserCheck },
    { name: "Pending Donations", path: "/dashboard/super-admin/pending-donations", icon: Clock },
    { name: "Send Reminders", path: "/dashboard/super-admin/reminders", icon: MessageCircle },
    { name: "Reports", path: "/dashboard/super-admin/reports", icon: BarChart3 },
  ];

  const fundMenu = [
    { name: "Create Fund", path: "/dashboard/super-admin/createfund", icon: PlusCircle },
    { name: "Fund Summary", path: "/dashboard/super-admin/fundSummary", icon: PieChart },
    { name: "Use Fund", path: "/dashboard/super-admin/useFund", icon: Send },
    { name: "Fund History", path: "/dashboard/super-admin/fundHistory", icon: History },
  ];

  const allDonationMenu = [
    { name: "All Donations", path: "/dashboard/super-admin/all-donations", icon: Coins },
    { name: "Monthly Report", path: "/dashboard/super-admin/monthlyDonationTable", icon: CalendarRange },
  ];

  const getLinkClass = (isActive) => {
    if (collapsed) {
      return isActive
        ? "sidebar-link-collapsed-active"
        : "sidebar-link-collapsed-inactive";
    }
    return isActive
      ? "sidebar-link sidebar-link-active"
      : "sidebar-link sidebar-link-inactive";
  };

  return (
    <>
      <aside
        className={`
          ${collapsed ? "w-20" : "w-72"}
          h-screen text-white relative flex-shrink-0
          bg-gradient-to-b from-[var(--sidebar-from)] via-[var(--sidebar-via)] to-[var(--sidebar-to)] border-none outline-none
          transition-all duration-300 shadow-[6px_0_30px_rgba(0,0,0,0.2)]
          ${mobile ? "fixed top-0 left-0 z-40 h-full" : "relative"}
          ${!sidebarOpen && mobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar py-6 pl-2 pr-0 flex flex-col justify-between">
          <div>
            {/* BRAND HEADER */}
            <div className="flex items-center justify-between gap-3 px-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-[#007380] flex items-center justify-center shadow-[0_8px_16px_rgba(0,115,128,0.25)] border border-teal-300/20 flex-shrink-0">
                  <span className="text-white font-black text-xl tracking-wider">C</span>
                </div>
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-widest bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent">
                      CHHAPI
                    </span>
                    <span className="text-[9px] text-teal-300/80 font-bold tracking-widest uppercase">
                      Donation Portal
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Close Button */}
              {mobile && sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition cursor-pointer flex-shrink-0"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* PROFILE CARD */}
            {!collapsed && (
              <div className="flex items-center gap-4 mb-8 p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-white/20 mr-4 ml-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] group">
                <div className="relative">
                  <img
                    src={
                      user?.profilePhoto?.url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Super Admin")}&background=ffffff&color=${sidebarColor}`
                    }
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-teal-400/40 transition-colors duration-300"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#004e57] rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white leading-tight transition-colors duration-300 group-hover:text-teal-200">
                    {user?.name || "Super Admin"}
                  </p>
                  <span className="text-[10px] text-teal-300 font-bold tracking-wider uppercase block mt-0.5">
                    {user?.role || "SUPER_ADMIN"}
                  </span>
                </div>
              </div>
            )}

            {/* MENU */}
            <nav className="flex flex-col gap-1.5">
              {/* DASHBOARD */}
              <NavLink
                to="/dashboard/super-admin"
                onClick={() => mobile && setSidebarOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={collapsed ? "" : (isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                      <LayoutDashboard size={18} />
                    </div>
                    {!collapsed && <span className="text-sm font-semibold">Dashboard</span>}
                  </>
                )}
              </NavLink>

              {/* USER MANAGEMENT */}
              <button
                onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                className={`w-full flex items-center gap-3 py-3 transition-all duration-300 cursor-pointer
                ${collapsed ? "justify-center w-12 h-12 rounded-xl mx-auto" : "ml-2 pl-6 pr-4 rounded-l-full text-left"}
                ${userMgmtOpen && !collapsed
                  ? "bg-white/[0.06] text-white font-bold"
                  : "text-white/80 hover:bg-white/6 hover:text-white"
                }`}
              >
                <div className={collapsed ? "" : (userMgmtOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                  <Users size={18} />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-semibold">User Management</span>
                    <ChevronDown
                      size={16}
                      className={`transition duration-300 text-white/60 ${userMgmtOpen ? "rotate-180 text-teal-300" : ""}`}
                    />
                  </>
                )}
              </button>

              {userMgmtOpen && !collapsed && userMgmtMenu.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        ${isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive"}
                        ml-4 flex-shrink-0
                      `}>
                        <sub.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold pl-2 truncate">{sub.name}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* ALL DONATIONS HISTORY */}
              <button
                onClick={() => setAllDonationOpen(!allDonationOpen)}
                className={`w-full flex items-center gap-3 py-3 transition-all duration-300 cursor-pointer
                ${collapsed ? "justify-center w-12 h-12 rounded-xl mx-auto" : "ml-2 pl-6 pr-4 rounded-l-full text-left"}
                ${allDonationOpen && !collapsed
                  ? "bg-white/[0.06] text-white font-bold"
                  : "text-white/80 hover:bg-white/6 hover:text-white"
                }`}
              >
                <div className={collapsed ? "" : (allDonationOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                  <Wallet size={18} />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-semibold">All Donations</span>
                    <ChevronDown
                      size={16}
                      className={`transition duration-300 text-white/60 ${allDonationOpen ? "rotate-180 text-teal-300" : ""}`}
                    />
                  </>
                )}
              </button>

              {allDonationOpen && !collapsed && allDonationMenu.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        ${isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive"}
                        ml-4 flex-shrink-0
                      `}>
                        <sub.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold pl-2 truncate">{sub.name}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* FUND MANAGEMENT */}
              <button
                onClick={() => setFundOpen(!fundOpen)}
                className={`w-full flex items-center gap-3 py-3 transition-all duration-300 cursor-pointer
                ${collapsed ? "justify-center w-12 h-12 rounded-xl mx-auto" : "ml-2 pl-6 pr-4 rounded-l-full text-left"}
                ${fundOpen && !collapsed
                  ? "bg-white/[0.06] text-white font-bold"
                  : "text-white/80 hover:bg-white/6 hover:text-white"
                }`}
              >
                <div className={collapsed ? "" : (fundOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                  <Landmark size={18} />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-semibold">Fund Management</span>
                    <ChevronDown
                      size={16}
                      className={`transition duration-300 text-white/60 ${fundOpen ? "rotate-180 text-teal-300" : ""}`}
                    />
                  </>
                )}
              </button>

              {fundOpen && !collapsed && fundMenu.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`
                        ${isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive"}
                        ml-4 flex-shrink-0
                      `}>
                        <sub.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold pl-2 truncate">{sub.name}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* APPEARANCE */}
              <NavLink
                to="/dashboard/super-admin/appearance"
                onClick={() => mobile && setSidebarOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={collapsed ? "" : (isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                      <Sun size={18} />
                    </div>
                    {!collapsed && <span className="text-sm font-semibold">Appearance</span>}
                  </>
                )}
              </NavLink>

              {/* SETTINGS */}
              <NavLink
                to="/dashboard/super-admin/settings"
                onClick={() => mobile && setSidebarOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    <div className={collapsed ? "" : (isActive ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                      <Settings size={18} />
                    </div>
                    {!collapsed && <span className="text-sm font-semibold">Settings</span>}
                  </>
                )}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Edge Toggle Button */}
        {!mobile && setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-[-16px] top-8 w-8 h-8 rounded-full bg-white text-[#007380] hover:text-[#005f6b] shadow-[0_4px_12px_rgba(0,115,128,0.2)] hover:shadow-[0_6px_20px_rgba(0,115,128,0.3)] flex items-center justify-center cursor-pointer transition-all duration-300 z-50 border border-teal-700/10 hover:scale-105 active:scale-95"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        )}
      </aside>

      {/* MOBILE OVERLAY */}
      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}
    </>
  );
};

export default SuperAdminSidebar;
