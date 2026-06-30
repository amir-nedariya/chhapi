"use client";
import ThemeSettings from "../../../../components/theme/ThemeSettings";

const UserAppearance = () => {
  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-10 flex justify-center items-start">
      <div className="w-full max-w-6xl mt-6">
        <ThemeSettings />
      </div>
    </div>
  );
};

export default UserAppearance;
