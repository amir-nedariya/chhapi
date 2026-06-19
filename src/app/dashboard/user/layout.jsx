"use client";
import LayoutComponent from "../../../components/layouts/user/UserLayout";
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
      } else if (!["USER"].includes(user.role)) {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !["USER"].includes(user.role)) {
    return <FullScreenLoader text="Checking permissions..." />;
  }

  return (
    <LayoutComponent>
      {children}
    </LayoutComponent>
  );
}
