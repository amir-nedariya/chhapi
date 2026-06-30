"use client";
import { useState, useEffect } from "react";
import { themes, applyTheme, initTheme } from "../../utils/theme";
import { Check } from "lucide-react";

const ThemeSettings = () => {
  const [activeTheme, setActiveTheme] = useState("Clear Ocean");

  useEffect(() => {
    initTheme();
    const saved = localStorage.getItem("selected-sidebar-theme") || "Clear Ocean";
    setActiveTheme(saved);

    const handleExternalChange = () => {
      const current = localStorage.getItem("selected-sidebar-theme") || "Clear Ocean";
      setActiveTheme(current);
    };

    window.addEventListener("sidebar-theme-changed", handleExternalChange);
    return () => window.removeEventListener("sidebar-theme-changed", handleExternalChange);
  }, []);

  const handleSelect = (theme) => {
    applyTheme(theme);
    setActiveTheme(theme.name);
    window.dispatchEvent(new Event("sidebar-theme-changed"));
  };

  // Find the selected theme object for live preview
  const selectedThemeObj = themes.find((t) => t.name === activeTheme) || themes[themes.length - 1];

  const renderGroup = (category) => {
    const groupThemes = themes.filter((t) => t.category === category);
    return (
      <div className="space-y-4">
        <h4 className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
          {category}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupThemes.map((t) => {
            const isSelected = activeTheme === t.name;
            return (
              <button
                key={t.name}
                onClick={() => handleSelect(t)}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? "bg-[#f0f9ff] border-[#0ea5e9] shadow-sm ring-1 ring-[#0ea5e9]/20"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                  style={{ backgroundColor: t.color }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full bg-black/10 flex items-center justify-center">
                      <Check className="text-white w-5 h-5 stroke-[3.5]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-sm tracking-tight">{t.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#f8fafc] border border-slate-200/60 rounded-[2rem] p-8 space-y-8 shadow-xs">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Appearance</h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize how the dashboard looks. Changes are saved automatically.
        </p>
      </div>

      <div className="border-t border-slate-200/60 pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">Theme Colors</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pick a preset or create your own custom theme.
          </p>
        </div>

        {renderGroup("SINGLE COLOR")}
        {renderGroup("VISION ASSISTIVE")}
      </div>

      {/* Live Preview Section */}
      <div className="border-t border-slate-200/60 pt-8 space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Live Preview</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            See how your layout selections will look across the interface.
          </p>
        </div>

        <div className="w-full bg-slate-50/50 border border-slate-200/60 rounded-[1.5rem] p-5">
          <div className="flex rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs min-h-[220px]">
            {/* Mini Sidebar */}
            <div 
              className="w-1/4 max-w-[140px] p-3 flex flex-col gap-4 transition-all duration-300 border-r border-slate-100"
              style={{
                background: `linear-gradient(to bottom, ${selectedThemeObj.from}, ${selectedThemeObj.via}, ${selectedThemeObj.to})`
              }}
            >
              {/* Mini Logo */}
              <div className="h-4 w-12 bg-white/20 rounded-md mb-2"></div>
              {/* Mini Links */}
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/25 rounded-md"></div>
                <div className="h-3 w-12 bg-white/20 rounded-md opacity-90"></div>
                <div className="h-3 w-14 bg-white/15 rounded-md opacity-80"></div>
                <div className="h-3 w-10 bg-white/10 rounded-md opacity-70"></div>
              </div>
            </div>

            {/* Mini Content Area */}
            <div className="flex-1 bg-slate-50/30 flex flex-col">
              {/* Mini Header */}
              <div className="h-10 border-b border-slate-100 bg-white px-4 flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-5 h-5 w-5 rounded-full bg-slate-200"></div>
              </div>

              {/* Mini Content Page */}
              <div className="p-4 flex-1 space-y-4">
                {/* Title & Actions */}
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-slate-300 rounded-md"></div>
                  <div className="h-6 w-14 rounded-md" style={{ backgroundColor: selectedThemeObj.teal }}></div>
                </div>

                {/* Mock Table */}
                <div className="rounded-xl border border-slate-100 overflow-hidden bg-white shadow-xs">
                  {/* Table Header */}
                  <div 
                    className="h-8 px-3 flex items-center justify-between text-[10px] text-white"
                    style={{
                      background: `linear-gradient(to right, ${selectedThemeObj.from}, ${selectedThemeObj.via}, ${selectedThemeObj.to})`
                    }}
                  >
                    <div className="w-12 h-2.5 bg-white/30 rounded"></div>
                    <div className="w-8 h-2.5 bg-white/30 rounded"></div>
                    <div className="w-10 h-2.5 bg-white/30 rounded"></div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-7 px-3 flex items-center justify-between">
                        <div className="w-16 h-2 bg-slate-200 rounded"></div>
                        <div className="w-6 h-2 bg-slate-200 rounded"></div>
                        <div className="w-12 h-2 bg-slate-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
