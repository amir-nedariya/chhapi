export const themes = [
  // SINGLE COLOR
  {
    name: "Royal Purple",
    category: "SINGLE COLOR",
    color: "#7c3aed",
    from: "#2e1065",
    via: "#5b21b6",
    to: "#3b0764",
    teal: "#8b5cf6"
  },
  {
    name: "Sunset Orange",
    category: "SINGLE COLOR",
    color: "#ea580c",
    from: "#431407",
    via: "#9a3412",
    to: "#2c0b02",
    teal: "#ea580c"
  },
  {
    name: "Golden Glow",
    category: "SINGLE COLOR",
    color: "#d97706",
    from: "#451a03",
    via: "#854d0e",
    to: "#2d1002",
    teal: "#f59e0b"
  },
  {
    name: "Forest Green",
    category: "SINGLE COLOR",
    color: "#15803d",
    from: "#022c22",
    via: "#065f46",
    to: "#021a11",
    teal: "#10b981"
  },
  {
    name: "Ocean Blue",
    category: "SINGLE COLOR",
    color: "#0284c7",
    from: "#082f49",
    via: "#0369a1",
    to: "#0f172a",
    teal: "#0ea5e9"
  },
  {
    name: "Rose Pink",
    category: "SINGLE COLOR",
    color: "#db2777",
    from: "#4c0519",
    via: "#9d174d",
    to: "#310411",
    teal: "#f43f5e"
  },
  {
    name: "Slate Gray",
    category: "SINGLE COLOR",
    color: "#4b5563",
    from: "#1f2937",
    via: "#4b5563",
    to: "#111827",
    teal: "#9ca3af"
  },
  {
    name: "Midnight Indigo",
    category: "SINGLE COLOR",
    color: "#3730a3",
    from: "#1e1b4b",
    via: "#3730a3",
    to: "#0f172a",
    teal: "#6366f1"
  },
  // VISION ASSISTIVE
  {
    name: "Vision Dark",
    category: "VISION ASSISTIVE",
    color: "#1e293b",
    from: "#0f172a",
    via: "#1e293b",
    to: "#020617",
    teal: "#38bdf8"
  },
  {
    name: "Clear Ocean",
    category: "VISION ASSISTIVE",
    color: "#007380",
    from: "#072429",
    via: "#004e57",
    to: "#002e33",
    teal: "#007380"
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
