import { useAuth } from "../../../context/AuthContext";
import UserSidebar from "../../sidebar/UserSidebar";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      {/* Sidebar */}
      <UserSidebar
        collapsed={isMobile ? !sidebarOpen : collapsed}
        setCollapsed={setCollapsed}
        mobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        {/* Mobile Navbar Header */}
        {isMobile && (
          <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 flex-shrink-0 z-30 shadow-xs relative">
            {/* Left Slot: Menu Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition active:scale-95 cursor-pointer"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Center Slot: Perfectly Centered Brand Logo & Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-[#007380] flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-sm font-black tracking-widest bg-gradient-to-r from-slate-800 to-slate-950 bg-clip-text text-transparent">
                CHHAPI
              </span>
            </div>

            {/* Right Slot: Profile Info */}
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-block text-[10px] bg-slate-50 text-slate-700 border border-slate-100 font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase whitespace-nowrap">
                Donor
              </span>
              <img
                src={
                  user?.profilePhoto?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Donor"
                  )}&background=007380&color=ffffff`
                }
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            </div>
          </header>
        )}

        {/* Content */}
        <main
          className={`flex-1 p-4 sm:p-6 overflow-y-auto bg-white transition-all duration-300 ${
            sidebarOpen && isMobile ? "blur-sm pointer-events-none" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
