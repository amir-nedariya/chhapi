"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "../components/common/FullScreenLoader";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role === "USER") {
        router.replace("/dashboard/user");
      } else if (user.role === "ADMIN") {
        router.replace("/dashboard/admin");
      } else if (user.role === "SUPER_ADMIN") {
        router.replace("/dashboard/super-admin");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <FullScreenLoader text="Checking session..." />;
  }

  return <FullScreenLoader text="Redirecting..." />;
}
