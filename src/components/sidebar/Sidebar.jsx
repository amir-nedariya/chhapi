import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  UserPlus,
  UserCheck,
  History,
  Coins,
  CalendarRange,
  PieChart,
  MessageCircle,
  X,
  ScrollText,
  Target,
  Clock,
  BarChart3,
  PlusCircle,
  Send,
  User2,
  LogOut,
  Crown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useSidebarColor } from "../../hooks/useSidebarColor";
import { applyTheme, initTheme } from "../../utils/theme";

const Sidebar = ({ collapsed, setCollapsed, mobile, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarColor = useSidebarColor();
  const [currentTheme, setCurrentTheme] = useState("Clear Ocean");
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const role = user?.role || "USER";
  const roleSegment = role === "SUPER_ADMIN" ? "super-admin" : role === "ADMIN" ? "admin" : "user";
  const pathPrefix = `/dashboard/${roleSegment}`;
  const defaultName = role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : "User";

  const [openMenus, setOpenMenus] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const updatePendingCount = () => {
    if (role !== "SUPER_ADMIN") return;
    try {
      const data = JSON.parse(localStorage.getItem("chhapi_fund_requests") || "[]");
      const pending = data.filter((req) => req.status === "Pending");
      setPendingRequestsCount(pending.length);
    } catch {
      setPendingRequestsCount(0);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      initTheme();
      const saved = localStorage.getItem("selected-sidebar-theme") || "Clear Ocean";
      setCurrentTheme(saved);

      const handleExternalChange = () => {
        const current = localStorage.getItem("selected-sidebar-theme") || "Clear Ocean";
        setCurrentTheme(current);
      };

      window.addEventListener("sidebar-theme-changed", handleExternalChange);
      
      if (role === "SUPER_ADMIN") {
        updatePendingCount();
        window.addEventListener("chhapi_new_fund_request", updatePendingCount);
      }

      return () => {
        window.removeEventListener("sidebar-theme-changed", handleExternalChange);
        if (role === "SUPER_ADMIN") {
          window.removeEventListener("chhapi_new_fund_request", updatePendingCount);
        }
      };
    }
  }, [role]);

  const toggleMenu = (name) => {
    if (collapsed) setCollapsed(false);
    setOpenMenus((prev) => (prev.includes(name) ? [] : [name]));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Build the dynamic menu configuration similar to Zentro ERP
  const menuItems = [
    {
      name: "Dashboard",
      path: pathPrefix,
      icon: LayoutDashboard,
      exact: true
    }
  ];

  if (role === "USER") {
    menuItems.push(
      { name: "My Donations", path: `${pathPrefix}/all-donations`, icon: Wallet },
      { name: "Monthly Report", path: `${pathPrefix}/monthlyDonationTable`, icon: CalendarRange }
    );
  }

  if (role !== "USER") {
    const userMgmtChildren = [];
    if (role === "SUPER_ADMIN") {
      userMgmtChildren.push(
        { name: "Users List", path: `${pathPrefix}/usersList` },
        { name: "Pending Donations", path: `${pathPrefix}/pending-donations` },
        { name: "Send Reminders", path: `${pathPrefix}/reminders` },
        { name: "Reports", path: `${pathPrefix}/reports` }
      );
    } else if (role === "ADMIN") {
      userMgmtChildren.push(
        { name: "Users List", path: `${pathPrefix}/GetAllUser` },
        { name: "Send Reminders", path: `${pathPrefix}/reminders` },
        { name: "My Donations history", path: `${pathPrefix}/MyDonations` }
      );
    }
    menuItems.push({
      name: "User Management",
      icon: Users,
      children: userMgmtChildren
    });

    const fundMgmtChildren = [];
    if (role === "SUPER_ADMIN") {
      fundMgmtChildren.push({ name: "Create Fund", path: `${pathPrefix}/createfund` });
    }
    fundMgmtChildren.push({ name: "Fund Summary", path: `${pathPrefix}/fundSummary` });
    if (role === "SUPER_ADMIN") {
      fundMgmtChildren.push({ name: "Use Fund", path: `${pathPrefix}/useFund` });
    }
    fundMgmtChildren.push({ name: "Fund History", path: `${pathPrefix}/fundHistory` });

    menuItems.push({
      name: "Fund Management",
      icon: PieChart,
      children: fundMgmtChildren
    });

    const donationChildren = [];
    if (role === "SUPER_ADMIN") {
      donationChildren.push(
        { name: "All Donations", path: `${pathPrefix}/all-donations` },
        { name: "Monthly Report", path: `${pathPrefix}/monthlyDonationTable` }
      );
    } else if (role === "ADMIN") {
      donationChildren.push(
        { name: "All Donations", path: `${pathPrefix}/donations` },
        { name: "Monthly Report", path: `${pathPrefix}/monthlyDonationTable` }
      );
    }
    menuItems.push({
      name: "All Donation",
      icon: Coins,
      children: donationChildren
    });
  }

  if (role === "SUPER_ADMIN") {
    menuItems.push({ name: "Fund Requests", path: `${pathPrefix}/fund-requests`, icon: Landmark, badge: pendingRequestsCount });
  } else {
    menuItems.push({ name: "Request Funds", path: `${pathPrefix}/fund-request`, icon: Landmark });
  }

  menuItems.push({ name: "Rules & Regulations", path: `${pathPrefix}/rules`, icon: ScrollText });

  if (role === "USER") {
    menuItems.push({ name: "All Users", path: `${pathPrefix}/all-users`, icon: UserPlus });
  }

  menuItems.push(
    { name: "Leads", path: `${pathPrefix}/leads`, icon: Target }
  );

  if (role !== "SUPER_ADMIN") {
    menuItems.push(
      { name: "Appearance", path: `${pathPrefix}/appearance`, icon: Sun },
      { name: "Settings", path: `${pathPrefix}/settings`, icon: Settings }
    );
  }

  const isChildActive = (children) => {
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <>
      <div
        className={`${collapsed ? "lg:w-[90px] w-0" : "lg:w-[250px] w-[280px]"} h-screen text-white flex flex-col pt-2 pb-4 pl-2 pr-0 overflow-hidden transition-all duration-500 shadow-xl z-40 fixed lg:relative ${mobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
        style={{
          background: currentTheme === "Custom" ? sidebarColor : `linear-gradient(to top, var(--sidebar-from), var(--sidebar-via), var(--sidebar-to))`
        }}
      >
        <div className="mb-2 pb-2 flex-shrink-0 border-b border-white/10 relative flex items-center justify-between min-h-[48px] px-3">
          <div
            className={`transition-all duration-300 flex items-center gap-2 hover:bg-white/5 p-1 rounded-sm cursor-pointer ${(!collapsed || mobile) ? "opacity-100 w-auto" : "opacity-0 w-0 lg:opacity-100 lg:w-auto overflow-hidden"}`}
          >
            <div className="p-1 bg-teal-500/20 text-teal-300 rounded-sm flex items-center justify-center shrink-0">
              <Crown size={18} />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-[13px] font-bold tracking-wide text-white uppercase">
                  CHHAPI
                </span>
                <span className="text-[9px] text-teal-200/80 font-bold uppercase tracking-wider">
                  Donation Portal
                </span>
              </div>
            )}
          </div>

          {mobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-sm bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          )}

          {!mobile && setCollapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute -right-[12px] top-2 w-6 h-6 rounded-full bg-white text-teal-700 flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 z-50"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-1 mt-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus.includes(item.name);
            const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path) && (hasChildren ? isChildActive(item.children) : location.pathname === item.path);

            if (hasChildren) {
              return (
                <div key={index} className="flex flex-col gap-1">
                  <div
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center justify-between px-3 py-3 rounded-sm cursor-pointer transition-all
                      ${isActive
                        ? "bg-white text-teal-700 shadow-sm"
                        : isOpen
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/10 text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 flex justify-center">
                        <Icon size={18} className={isActive ? "text-teal-700" : "text-white"} />
                      </div>
                      {!collapsed && (
                        <span className={`text-sm tracking-wide transition-all duration-300 whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"}`}>
                          {item.name}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-all duration-300 ${isOpen ? "rotate-90" : ""} ${isActive ? "text-teal-700" : "text-white"}`}
                      />
                    )}
                  </div>

                  {!collapsed && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="relative ml-5 pl-6 border-l border-white/20 flex flex-col gap-1 py-1">
                        {item.children.map((child, childIdx) => {
                          const isChildActive = location.pathname === child.path;
                          return (
                            <NavLink
                              key={childIdx}
                              to={child.path}
                              onClick={() => mobile && setSidebarOpen(false)}
                              className="relative flex items-center group cursor-pointer"
                            >
                              <div
                                className={`absolute -left-[29px] w-[10px] h-[10px] rounded-full border-2 transition-all
                                  ${isChildActive
                                    ? "bg-white border-white ring-4 ring-white/10"
                                    : "bg-teal-600 border-white/30 group-hover:border-white/60"
                                  }`}
                              />
                              <span
                                className={`text-sm py-2 px-1 rounded-sm w-full transition-all whitespace-nowrap duration-300
                                  ${isChildActive
                                    ? "text-white font-medium"
                                    : "text-white/70 hover:text-white font-medium"
                                  }`}
                              >
                                {child.name}
                              </span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.exact}
                onClick={() => {
                  if (mobile) setSidebarOpen(false);
                  setOpenMenus([]);
                }}
                className={`flex items-center justify-between px-3 py-3 rounded-sm cursor-pointer transition-all
                  ${isActive
                    ? "bg-white text-teal-700 shadow-sm font-semibold"
                    : "hover:bg-white/10 text-white font-medium"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 flex justify-center">
                    <Icon size={18} className={isActive ? "text-teal-700" : "text-white"} />
                  </div>
                  {!collapsed && (
                    <span className="text-sm tracking-wide whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
                {!collapsed && item.badge > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-3 pt-3 pr-2 flex-shrink-0 border-t border-white/10 relative">
          <div
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center justify-between bg-black/10 hover:bg-black/20 p-2.5 rounded-sm border border-white/5 cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex-shrink-0 rounded-sm bg-white/10 text-white flex items-center justify-center text-sm font-bold border border-white/20 shadow-inner">
                {getInitials(user?.name || defaultName)}
              </div>
              {!collapsed && (
                <div>
                  <p className="text-[13px] font-semibold text-white tracking-wide">
                    {user?.name || defaultName}
                  </p>
                  <p className="text-[10px] text-white/60 font-medium tracking-wider uppercase mt-0.5">
                    {role}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <ChevronDown size={15} className="text-white/40 group-hover:text-white/70" />
            )}
          </div>

          {profileMenuOpen && !collapsed && (
            <div className="absolute bottom-16 right-2 w-44 bg-white rounded-sm shadow-xl border border-gray-100 z-50 p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => { setProfileMenuOpen(false); navigate(pathPrefix + '/settings'); }}
                className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-sm transition-colors"
              >
                <User2 size={16} className="text-gray-500" />
                Profile
              </button>
              <div className="h-px bg-gray-100 my-0.5 mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-sm transition-colors"
              >
                <LogOut size={16} className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {mobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
