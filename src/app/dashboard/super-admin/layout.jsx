"use client";
import LayoutComponent from "../../../components/layouts/super-admin/SuperAdminLayout";
import { useAuth } from "../../../context/AuthContext";
import FullScreenLoader from "../../../components/common/FullScreenLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!["SUPER_ADMIN"].includes(user.role)) {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !["SUPER_ADMIN"].includes(user.role)) {
    return <FullScreenLoader text="Checking permissions..." />;
  }

  return (
    <LayoutComponent>
      {children}
    </LayoutComponent>
  );
}
