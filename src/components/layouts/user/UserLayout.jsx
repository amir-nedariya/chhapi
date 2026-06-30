import { useAuth } from "../../../context/AuthContext";
import UserSidebar from "../../sidebar/UserSidebar";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const UserLayout = ({ children }) => {
  const { logout } = useAuth();
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
    <div className="flex h-screen overflow-hidden bg-[var(--page-bg)] relative">
      {/* Sidebar */}
      <UserSidebar
        collapsed={isMobile ? !sidebarOpen : collapsed}
        setCollapsed={setCollapsed}
        mobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 right-4 z-50 p-2.5 bg-[var(--sidebar-teal)] hover:bg-[var(--sidebar-teal)]/90 text-white rounded-xl shadow-lg transition cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Content */}
      <main
        className={`flex-1 p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${
          sidebarOpen && isMobile ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
