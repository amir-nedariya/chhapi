import { useEffect, useState } from "react";

/**
 * Enhanced default Loader - Displays a premium rupee coin bouncing/pulsating,
 * with customizable texts and progress dot animations.
 */
const Loader = ({ text = "Loading...", subText = "Please wait..." }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {/* Loader Card */}
      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-xl select-none">
        {/* Animated Coin */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-white/10 border border-white/20" />
          <div className="absolute inset-4 rounded-full bg-cyan-400/80 animate-bounce" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">₹</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <p className="text-white font-semibold text-lg">
            {text} {dots}
          </p>
          <p className="text-gray-400 text-sm">{subText}</p>
        </div>
      </div>

      {/* Dots Progress */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
        <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-bounce [animation-delay:200ms]" />
        <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce [animation-delay:400ms]" />
      </div>
    </div>
  );
};

/**
 * Named Export: Classic inline circular spinner.
 * Highly configurable in size, color and padding.
 */
export const Spinner = ({ size = "md", color = "text-primary", className = "" }) => {
  const sizes = {
    xs: "h-3.5 w-3.5 border-2",
    sm: "h-5 w-5 border-2",
    md: "h-7 w-7 border-2",
    lg: "h-10 w-10 border-3",
    xl: "h-14 w-14 border-4",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent border-current ${sizes[size] || sizes.md} ${color}`}
        style={{ borderStyle: "solid", borderLeftColor: "transparent" }}
      />
    </div>
  );
};

/**
 * Named Export: TableLoader.
 * Elegant spinner tailored for listings and table placeholders.
 */
export const TableLoader = ({ text = "Synchronizing records...", subText = "Please wait a moment" }) => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-4 bg-slate-50/10 backdrop-blur-xs rounded-2xl select-none border border-slate-100/50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-100 border-t-cyan-600 animate-spin" />
        <div 
          className="absolute inset-2 rounded-full border-4 border-cyan-600/10 border-t-cyan-500/80 animate-spin"
          style={{ animationDuration: "1s", animationDirection: "reverse" }}
        />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-slate-700 animate-pulse">{text}</p>
        {subText && <p className="text-xs text-slate-400">{subText}</p>}
      </div>
    </div>
  );
};

/**
 * Named Export: Skeleton.
 * Pulsating placeholder block representing text/content loading state.
 */
export const Skeleton = ({
  width = "100%",
  height = "16px",
  circle = false,
  className = "",
  count = 1,
}) => {
  const elements = Array.from({ length: count });

  return (
    <div className="flex flex-col gap-2 w-full">
      {elements.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200/70 ${circle ? "rounded-full" : "rounded-lg"} ${className}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
};

export default Loader;
