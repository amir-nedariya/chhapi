import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Clock,
  Wallet,
  Table,
  Settings,
  Landmark,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const SuperAdminSidebar = ({ collapsed, mobile, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 🔹 dropdown states
  const [userMgmtOpen, setUserMgmtOpen] = useState(
    location.pathname.includes("/createAdmin") || location.pathname.includes("/usersList")
  );
  const [fundOpen, setFundOpen] = useState(location.pathname.includes("/fund"));
  const [allDonationOpen, setAllDonationOpen] = useState(
    location.pathname.includes("/all-donations") || location.pathname.includes("/monthlyDonationTable")
  );

  // 🔹 menu data
  const userMgmtMenu = [
    { name: "Create User", path: "/dashboard/super-admin/createuser" },
    // { name: "Create Admin", path: "/dashboard/super-admin/createAdmin" },
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

  return (
    <>
      <aside
        className={`
          ${collapsed ? "w-20" : "w-72"}
          min-h-screen p-4 text-white
          bg-gradient-to-b from-[#0f172a]/80 to-[#020617]/80
          backdrop-blur-xl border-r border-white/10
          transition-all duration-300
          ${mobile ? "fixed top-0 left-0 z-40 h-full" : "relative"}
          ${!sidebarOpen && mobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* PROFILE */}
        {!collapsed && (
          <div className="flex items-center gap-4 mb-10 p-3 rounded-xl bg-white/5">
            <img
              src={
                user?.profilePhoto?.url ||
                "https://ui-avatars.com/api/?name=Super+Admin&background=0f172a&color=fff"
              }
              alt="profile"
              className="w-12 h-12 rounded-full border border-white/20"
            />
            <div>
              <p className="text-sm font-semibold">{user?.name || "Super Admin"}</p>
              <span className="text-xs text-cyan-400">{user?.role || "SUPER_ADMIN"}</span>
            </div>
          </div>
        )}

        {/* MENU */}
        <nav className="flex flex-col gap-2">
          {/* DASHBOARD */}
          <NavLink
            to="/dashboard/super-admin"
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? "bg-white/10 text-cyan-400 shadow-[inset_3px_0_0_#22d3ee]" : "text-gray-300 hover:bg-white/5"}
              ${collapsed ? "justify-center" : ""}`
            }
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span className="text-sm">Dashboard</span>}
          </NavLink>

          {/* USER MANAGEMENT DROPDOWN */}
          <div>
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${userMgmtOpen ? "bg-white/10 text-cyan-400" : "text-gray-300 hover:bg-white/5"}
                ${collapsed ? "justify-center" : ""}`}
            >
              <Users size={18} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">User Management</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${userMgmtOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {userMgmtOpen && !collapsed && (
              <div className="ml-6 mt-3 relative pl-6">
                <span className="absolute left-[11px] top-0 bottom-0 w-px bg-white/15" />
                {userMgmtMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 mb-1 rounded-lg text-sm transition-all
                      ${isActive ? "bg-white/10 text-cyan-400" : "text-gray-400 hover:bg-white/5"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-18px] top-1/2 -translate-y-1/2
                          h-2.5 w-2.5 rounded-full border transition
                          ${isActive ? "bg-cyan-400 border-cyan-400" : "border-gray-500 bg-[#020617]"}`}
                        />
                        <span>{sub.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ALL DONATIONS HISTORY DROPDOWN */}
          <div>
            <button
              onClick={() => setAllDonationOpen(!allDonationOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${allDonationOpen ? "bg-white/10 text-cyan-400" : "text-gray-300 hover:bg-white/5"}
                ${collapsed ? "justify-center" : ""}`}
            >
              <Wallet size={18} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">All Donations History</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${allDonationOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {allDonationOpen && !collapsed && (
              <div className="ml-6 mt-3 relative pl-6">
                <span className="absolute left-[11px] top-0 bottom-0 w-px bg-white/15" />
                {allDonationMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 mb-1 rounded-lg text-sm transition-all
                      ${isActive ? "bg-white/10 text-cyan-400" : "text-gray-400 hover:bg-white/5"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-18px] top-1/2 -translate-y-1/2
                          h-2.5 w-2.5 rounded-full border transition
                          ${isActive ? "bg-cyan-400 border-cyan-400" : "border-gray-500 bg-[#020617]"}`}
                        />
                        <span>{sub.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* FUND MANAGEMENT DROPDOWN */}
          <div>
            <button
              onClick={() => setFundOpen(!fundOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${fundOpen ? "bg-white/10 text-cyan-400" : "text-gray-300 hover:bg-white/5"}
                ${collapsed ? "justify-center" : ""}`}
            >
              <Landmark size={18} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">Fund Management</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${fundOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {fundOpen && !collapsed && (
              <div className="ml-6 mt-3 relative pl-6">
                <span className="absolute left-[11px] top-0 bottom-0 w-px bg-white/15" />
                {fundMenu.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => mobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between
                      px-4 py-2.5 mb-1 rounded-lg text-sm transition-all
                      ${isActive ? "bg-white/10 text-cyan-400" : "text-gray-400 hover:bg-white/5"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-[-18px] top-1/2 -translate-y-1/2
                          h-2.5 w-2.5 rounded-full border transition
                          ${isActive ? "bg-cyan-400 border-cyan-400" : "border-gray-500 bg-[#020617]"}`}
                        />
                        <span>{sub.name}</span>
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? "bg-white/10 text-cyan-400 shadow-[inset_3px_0_0_#22d3ee]" : "text-gray-300 hover:bg-white/5"}
              ${collapsed ? "justify-center" : ""}`
            }
          >
            <Settings size={18} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </NavLink>
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}
    </>
  );
};

export default SuperAdminSidebar;
