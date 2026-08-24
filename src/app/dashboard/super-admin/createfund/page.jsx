"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateFundRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/super-admin/fundSummary");
  }, [router]);

  return null;
};

export default CreateFundRedirectPage;
