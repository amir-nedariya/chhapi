export const themes = [
  // CORE THEME FIRST (FALLBACK DEFAULT)
  {
    name: "Clear Ocean",
    category: "SINGLE COLOR",
    color: "#007380",
    from: "#007380",
    via: "#005f6a",
    to: "#004851",
    teal: "#007380"
  },
  // SINGLE COLOR
  {
    name: "Royal Purple",
    category: "SINGLE COLOR",
    color: "#7c3aed",
    from: "#6d28d9",
    via: "#5b21b6",
    to: "#4c1d95",
    teal: "#8b5cf6"
  },
  {
    name: "Sunset Orange",
    category: "SINGLE COLOR",
    color: "#ea580c",
    from: "#ea580c",
    via: "#d96514",
    to: "#b8470a",
    teal: "#ea580c"
  },
  {
    name: "Golden Glow",
    category: "SINGLE COLOR",
    color: "#d97706",
    from: "#d97706",
    via: "#b45309",
    to: "#92400e",
    teal: "#f59e0b"
  },
  {
    name: "Forest Green",
    category: "SINGLE COLOR",
    color: "#15803d",
    from: "#15803d",
    via: "#166534",
    to: "#14532d",
    teal: "#10b981"
  },
  {
    name: "Ocean Blue",
    category: "SINGLE COLOR",
    color: "#0284c7",
    from: "#0284c7",
    via: "#0369a1",
    to: "#075985",
    teal: "#0ea5e9"
  },
  {
    name: "Rose Pink",
    category: "SINGLE COLOR",
    color: "#db2777",
    from: "#db2777",
    via: "#be185d",
    to: "#9d174d",
    teal: "#f43f5e"
  },
  {
    name: "Slate Gray",
    category: "SINGLE COLOR",
    color: "#4b5563",
    from: "#4b5563",
    via: "#374151",
    to: "#1f2937",
    teal: "#9ca3af"
  },
  {
    name: "Midnight Indigo",
    category: "SINGLE COLOR",
    color: "#3730a3",
    from: "#4338ca",
    via: "#3730a3",
    to: "#312e81",
    teal: "#6366f1"
  },
  // VISION ASSISTIVE
  {
    name: "Vision Dark",
    category: "VISION ASSISTIVE",
    color: "#1e293b",
    from: "#1e293b",
    via: "#0f172a",
    to: "#020617",
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
  const found = themes.find((t) => t.name === saved) || themes[0];
  applyTheme(found);
};
