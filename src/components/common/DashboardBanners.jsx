"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Calendar, Bell, ShieldAlert, Heart } from "lucide-react";

// Predefined styles and icons for templates
const PRESETS = {
  diwali: {
    background: "linear-gradient(135deg, #4c0519 0%, #881337 50%, #9f1239 100%)",
    textColor: "text-amber-100",
    accentColor: "text-amber-400 bg-amber-500/10",
    icon: Sparkles,
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.35)]",
    defaultTitle: "દિવાળી પર્વની હાર્દિક શુભેચ્છાઓ! 🎉",
    defaultDesc: "પ્રકાશ અને આનંદનો આ તહેવાર તમારા જીવનમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવે તેવી છપ્પી ગામ કમિટી તરફથી મંગલ કામનાઓ."
  },
  eid: {
    background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)",
    textColor: "text-emerald-100",
    accentColor: "text-emerald-400 bg-emerald-500/10",
    icon: Heart,
    glow: "shadow-[0_0_25px_rgba(52,211,153,0.3)]",
    defaultTitle: "ઈદ મુબારક! 🌙✨",
    defaultDesc: "આ પવિત્ર અવસરે તમારા પરિવારમાં પરસ્પર પ્રેમ, ભાઈચારો અને ખુશીઓ કાયમ રહે તેવી છપ્પી સમુદાય તરફથી હાર્દિક દુઆ."
  },
  navratri: {
    background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
    textColor: "text-orange-100",
    accentColor: "text-yellow-400 bg-yellow-500/10",
    icon: Sparkles,
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.35)]",
    defaultTitle: "નવરાત્રી મહોત્સવની શુભકામનાઓ! 🌸💃",
    defaultDesc: "જગતજનની મા અંબા આપ સૌના જીવનમાં ઉત્સાહ, આરોગ્ય અને અપાર સુખ-સમૃદ્ધિ પ્રદાન કરે તેવી પ્રાર્થના."
  },
  independence: {
    background: "linear-gradient(135deg, #7c2d12 0%, #f8fafc 50%, #065f46 100%)",
    textColor: "text-slate-800",
    accentColor: "text-blue-600 bg-blue-500/10",
    icon: Calendar,
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    defaultTitle: "સ્વાતંત્ર્ય દિનની શુભકામનાઓ! 🇮🇳",
    defaultDesc: "રાષ્ટ્ર પ્રત્યેની આપણી ફરજ નિભાવીએ અને એકતા તેમજ સમરસતા સાથે ગામના વિકાસમાં સહભાગી બનીએ."
  },
  general: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    textColor: "text-cyan-100",
    accentColor: "text-cyan-400 bg-cyan-500/10",
    icon: Bell,
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    defaultTitle: "મહત્વની જાહેરાત 📢",
    defaultDesc: "તમામ સભ્યોને નમ્ર વિનંતી કે ગામના કલ્યાણ ફંડમાં નિયમિત યોગદાન આપી સામાજિક કાર્યોને વેગ આપો."
  }
};

const DashboardBanners = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const fetchBanners = () => {
    try {
      const savedBanners = JSON.parse(localStorage.getItem("chhapi_banners") || "[]");
      const today = new Date().toISOString().split("T")[0];
      
      // Filter active banners and inside valid date ranges
      const activeBanners = savedBanners.filter((b) => {
        if (!b.active) return false;
        if (b.startDate && b.startDate > today) return false;
        if (b.endDate && b.endDate < today) return false;
        return true;
      });

      setBanners(activeBanners);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Failed to load banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();

    // Listen to changes in banners from the management page
    window.addEventListener("chhapi_banners_changed", fetchBanners);
    return () => {
      window.removeEventListener("chhapi_banners_changed", fetchBanners);
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (banners.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners, isHovered]);

  if (banners.length === 0) return null;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden mb-6 group transition-all duration-300 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Inner */}
      <div className="relative h-[200px] sm:h-[240px] md:h-[280px] w-full overflow-hidden">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isPreset = banner.bannerType === "preset";
          const presetConfig = isPreset ? (PRESETS[banner.presetType] || PRESETS.general) : null;
          const IconComponent = presetConfig ? presetConfig.icon : Bell;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                background: isPreset ? presetConfig.background : "none",
              }}
            >
              {/* If Custom Image Uploaded */}
              {!isPreset && banner.customImage && (
                <>
                  <img
                    src={banner.customImage}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Dark Gradient Overlay for readability of title/desc */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </>
              )}

              {/* Glassmorphic/Premium Text Container */}
              <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-3/5 p-6 md:p-10 flex flex-col justify-end md:justify-center z-20 text-white select-none">
                <div className="flex flex-col gap-2 md:gap-3">
                  {/* Category Tag */}
                  <div className="flex items-center gap-1.5 self-start">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      presetConfig 
                        ? presetConfig.accentColor 
                        : "text-teal-300 bg-teal-500/10"
                    }`}>
                      <IconComponent size={12} className="animate-pulse" />
                      {banner.bannerType === "preset" ? banner.presetType.toUpperCase() : "EVENT"}
                    </span>
                  </div>

                  {/* Banner Title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide leading-tight drop-shadow-md">
                    {banner.title || (presetConfig ? presetConfig.defaultTitle : "નવી જાહેરાત")}
                  </h2>

                  {/* Banner Description */}
                  <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium max-w-xl leading-relaxed drop-shadow-sm line-clamp-3">
                    {banner.description || (presetConfig ? presetConfig.defaultDesc : "")}
                  </p>
                </div>
              </div>

              {/* Additional premium decorative element on the right (only for presets) */}
              {isPreset && (
                <div className="hidden md:flex absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 backdrop-blur-3xl items-center justify-center border border-white/10 animate-pulse">
                  <IconComponent size={72} className={`opacity-20 ${presetConfig?.textColor}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev/Next Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex 
                  ? "bg-white scale-125 w-5" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBanners;
