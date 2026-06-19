"use client";

import { AuthProvider } from "../context/AuthContext";
import { LoaderProvider } from "../context/LoaderContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <LoaderProvider>
        {children}
      </LoaderProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
