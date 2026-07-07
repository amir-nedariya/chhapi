export const themes = [
  // CORE THEME FIRST (FALLBACK DEFAULT)
  {
    name: "Clear Ocean",
    category: "SINGLE COLOR",
    color: "#007380",
    from: "#007380",
    via: "#005f6a",
    to: "#005f6a",
    teal: "#007380"
  },
  // SINGLE COLOR
  {
    name: "Royal Purple",
    category: "SINGLE COLOR",
    color: "#7c3aed",
    from: "#6d28d9",
    via: "#5b21b6",
    to: "#5b21b6",
    teal: "#8b5cf6"
  },
  {
    name: "Sunset Orange",
    category: "SINGLE COLOR",
    color: "#ea580c",
    from: "#ea580c",
    via: "#d96514",
    to: "#d96514",
    teal: "#ea580c"
  },
  {
    name: "Golden Glow",
    category: "SINGLE COLOR",
    color: "#d97706",
    from: "#d97706",
    via: "#b45309",
    to: "#b45309",
    teal: "#f59e0b"
  },
  {
    name: "Forest Green",
    category: "SINGLE COLOR",
    color: "#15803d",
    from: "#15803d",
    via: "#166534",
    to: "#166534",
    teal: "#10b981"
  },
  {
    name: "Ocean Blue",
    category: "SINGLE COLOR",
    color: "#0284c7",
    from: "#0284c7",
    via: "#0369a1",
    to: "#0369a1",
    teal: "#0ea5e9"
  },
  {
    name: "Rose Pink",
    category: "SINGLE COLOR",
    color: "#db2777",
    from: "#db2777",
    via: "#be185d",
    to: "#be185d",
    teal: "#f43f5e"
  },
  {
    name: "Slate Gray",
    category: "SINGLE COLOR",
    color: "#4b5563",
    from: "#4b5563",
    via: "#374151",
    to: "#374151",
    teal: "#9ca3af"
  },
  {
    name: "Midnight Indigo",
    category: "SINGLE COLOR",
    color: "#3730a3",
    from: "#4338ca",
    via: "#3730a3",
    to: "#3730a3",
    teal: "#6366f1"
  },
  {
    name: "Crimson Ruby",
    category: "SINGLE COLOR",
    color: "#dc2626",
    from: "#b91c1c",
    via: "#991b1b",
    to: "#991b1b",
    teal: "#ef4444"
  },
  {
    name: "Teal Breeze",
    category: "SINGLE COLOR",
    color: "#0d9488",
    from: "#0f766e",
    via: "#115e59",
    to: "#115e59",
    teal: "#14b8a6"
  },
  {
    name: "Sunny Amber",
    category: "SINGLE COLOR",
    color: "#d97706",
    from: "#b45309",
    via: "#92400e",
    to: "#92400e",
    teal: "#f59e0b"
  },
  {
    name: "Mint Sage",
    category: "SINGLE COLOR",
    color: "#059669",
    from: "#047857",
    via: "#065f46",
    to: "#065f46",
    teal: "#10b981"
  },
  {
    name: "Electric Blue",
    category: "SINGLE COLOR",
    color: "#2563eb",
    from: "#1d4ed8",
    via: "#1e40af",
    to: "#1e40af",
    teal: "#3b82f6"
  },
  // VISION ASSISTIVE
  {
    name: "Vision Dark",
    category: "VISION ASSISTIVE",
    color: "#1e293b",
    from: "#1e293b",
    via: "#0f172a",
    to: "#0f172a",
    teal: "#38bdf8"
  }
];

export const applyTheme = (theme) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--sidebar-from", theme.from);
  root.style.setProperty("--sidebar-via", theme.via);
  root.style.setProperty("--sidebar-to", theme.to);
  root.style.setProperty("--sidebar-teal", theme.teal);
  localStorage.setItem("selected-sidebar-theme", theme.name);
};

export const initTheme = () => {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("selected-sidebar-theme");
  if (saved === "Custom Design") {
    try {
      const custom = JSON.parse(localStorage.getItem("custom-theme-colors"));
      if (custom) {
        applyTheme(custom);
        return;
      }
    } catch (e) {
      console.error("Failed to load custom theme:", e);
    }
  }
  const found = themes.find((t) => t.name === saved) || themes[0];
  applyTheme(found);
};
