import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Landmark,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const SuperAdminSidebar = ({ collapsed, setCollapsed, mobile, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  // dropdown states
  const [userMgmtOpen, setUserMgmtOpen] = useState(
    location.pathname.includes("/createAdmin") || location.pathname.includes("/usersList") || location.pathname.includes("/pending-donations") || location.pathname.includes("/reports")
  );
  const [fundOpen, setFundOpen] = useState(location.pathname.includes("/fund"));
  const [allDonationOpen, setAllDonationOpen] = useState(
    location.pathname.includes("/all-donations") || location.pathname.includes("/monthlyDonationTable")
  );

  // menu data
  const userMgmtMenu = [
    { name: "Users List", path: "/dashboard/super-admin/usersList" },
    { name: "Pending Donations", path: "/dashboard/super-admin/pending-donations" },
    { name: "Reports", path: "/dashboard/super-admin/reports" },
  ];

  const fundMenu = [
    { name: "Create Fund", path: "/dashboard/super-admin/createfund" },
    { name: "Fund Summary", path: "/dashboard/super-admin/fundSummary" },
    { name: "Use Fund", path: "/dashboard/super-admin/useFund" },
    { name: "Fund History", path: "/dashboard/super-admin/fundHistory" },
  ];

  const allDonationMenu = [
    { name: "All Donations", path: "/dashboard/super-admin/all-donations" },
    { name: "Monthly Report", path: "/dashboard/super-admin/monthlyDonationTable" },
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
          h-screen overflow-y-auto overflow-x-hidden custom-scrollbar py-6 pl-2 pr-0 text-white
          bg-gradient-to-b from-[#005f6b] via-[#007380] to-[#004d56] border-none outline-none
          transition-all duration-300 shadow-[6px_0_30px_rgba(0,0,0,0.12)]
          ${mobile ? "fixed top-0 left-0 z-40 h-full" : "relative"}
          ${!sidebarOpen && mobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* BRAND / COLLAPSE ROW */}
        <div className="flex items-center justify-end mb-8 px-5 pr-4">
          {!collapsed ? (
            <>
              {setCollapsed && !mobile && (
                <button 
                  onClick={() => setCollapsed(true)}
                  className="p-2 rounded-xl hover:bg-white/8 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <Menu size={20} />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-center">
              {setCollapsed && (
                <button 
                  onClick={() => setCollapsed(false)}
                  className="p-2 rounded-xl hover:bg-white/8 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <Menu size={20} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        {!collapsed && (
          <div className="flex items-center gap-4 mb-8 p-3.5 rounded-2xl bg-white/6 border border-white/10 mr-4 ml-4 shadow-sm">
            <div className="relative">
              <img
                src={
                  user?.profilePhoto?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Super Admin")}&background=ffffff&color=007380`
                }
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#006e7a] rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-tight">{user?.name || "Super Admin"}</p>
              <span className="text-[10px] text-teal-200 font-bold tracking-wider uppercase block mt-0.5">{user?.role || "SUPER_ADMIN"}</span>
            </div>
          </div>
        )}

        {/* MENU */}
        <nav className="flex flex-col gap-2">
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
          <div>
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              className={`w-full flex items-center gap-3 py-3 transition-all duration-200 cursor-pointer
              ${collapsed ? "justify-center ml-3 w-12 h-12 rounded-xl" : "ml-3 pl-6 rounded-l-full text-left"}
              ${userMgmtOpen ? "bg-white/10 text-white font-bold" : "text-white/80 hover:bg-white/6 hover:text-white"}`}
            >
              <div className={collapsed ? "" : (userMgmtOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                <Users size={18} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-semibold">User Management</span>
                  <ChevronDown
                    size={16}
                    className={`transition mr-4 ${userMgmtOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {userMgmtOpen && !collapsed && (
              <div className="ml-6 mt-2 relative flex flex-col gap-1.5 pl-6 border-l border-white/15">
                {userMgmtMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${isActive ? "bg-white/12 text-white font-bold" : "text-white/70 hover:bg-white/6 hover:text-white"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-29px] top-1/2 -translate-y-1/2
                          h-2 w-2 rounded-full border transition-all duration-300
                          ${isActive ? "bg-teal-200 border-teal-200 scale-125" : "border-white/40 bg-[var(--sidebar-teal)]"}`}
                        />
                        <span>{sub.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-white/50 transition-all duration-200">
                          ›
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ALL DONATIONS HISTORY */}
          <div>
            <button
              onClick={() => setAllDonationOpen(!allDonationOpen)}
              className={`w-full flex items-center gap-3 py-3 transition-all duration-200 cursor-pointer
              ${collapsed ? "justify-center ml-3 w-12 h-12 rounded-xl" : "ml-3 pl-6 rounded-l-full text-left"}
              ${allDonationOpen ? "bg-white/10 text-white font-bold" : "text-white/80 hover:bg-white/6 hover:text-white"}`}
            >
              <div className={collapsed ? "" : (allDonationOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                <Wallet size={18} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-semibold">All Donations</span>
                  <ChevronDown
                    size={16}
                    className={`transition mr-4 ${allDonationOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {allDonationOpen && !collapsed && (
              <div className="ml-6 mt-2 relative flex flex-col gap-1.5 pl-6 border-l border-white/15">
                {allDonationMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${isActive ? "bg-white/12 text-white font-bold" : "text-white/70 hover:bg-white/6 hover:text-white"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-29px] top-1/2 -translate-y-1/2
                          h-2 w-2 rounded-full border transition-all duration-300
                          ${isActive ? "bg-teal-200 border-teal-200 scale-125" : "border-white/40 bg-[var(--sidebar-teal)]"}`}
                        />
                        <span>{sub.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-white/50 transition-all duration-200">
                          ›
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* FUND MANAGEMENT */}
          <div>
            <button
              onClick={() => setFundOpen(!fundOpen)}
              className={`w-full flex items-center gap-3 py-3 transition-all duration-200 cursor-pointer
              ${collapsed ? "justify-center ml-3 w-12 h-12 rounded-xl" : "ml-3 pl-6 rounded-l-full text-left"}
              ${fundOpen ? "bg-white/10 text-white font-bold" : "text-white/80 hover:bg-white/6 hover:text-white"}`}
            >
              <div className={collapsed ? "" : (fundOpen ? "sidebar-icon-container-active" : "sidebar-icon-container-inactive")}>
                <Landmark size={18} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-semibold">Fund Management</span>
                  <ChevronDown
                    size={16}
                    className={`transition mr-4 ${fundOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {fundOpen && !collapsed && (
              <div className="ml-6 mt-2 relative flex flex-col gap-1.5 pl-6 border-l border-white/15">
                {fundMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${isActive ? "bg-white/12 text-white font-bold" : "text-white/70 hover:bg-white/6 hover:text-white"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-29px] top-1/2 -translate-y-1/2
                          h-2 w-2 rounded-full border transition-all duration-300
                          ${isActive ? "bg-teal-200 border-teal-200 scale-125" : "border-white/40 bg-[var(--sidebar-teal)]"}`}
                        />
                        <span>{sub.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-white/50 transition-all duration-200">
                          ›
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

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
