
import SuperAdminSidebar from "../../sidebar/SuperAdminSidebar";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const SuperAdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // mobile & tablet
      if (window.innerWidth >= 1024) setSidebarOpen(true); // full on desktop
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0f23] relative">
      {/* Sidebar */}
      <SuperAdminSidebar
        collapsed={!sidebarOpen && isMobile}
        mobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Toggle Button (Right Side) */}
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
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          sidebarOpen && isMobile ? "blur-sm" : ""
        }`}
        style={{ minHeight: "100vh" }}
      >
        {children}
      </main>
    </div>
  );
};

export default SuperAdminLayout;
