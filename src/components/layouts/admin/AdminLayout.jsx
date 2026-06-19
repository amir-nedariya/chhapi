import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AdminSidebar from "../../sidebar/AdminSidebar";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0f23] relative">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={!sidebarOpen && isMobile}
        mobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-cyan-500/30 hover:bg-cyan-500/50 text-white rounded-md shadow-lg transition"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* Content */}
      <main
        className={`flex-1 p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${
          sidebarOpen && isMobile ? "blur-sm" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
