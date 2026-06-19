import { useEffect, useState } from "react";

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
      <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-3xl p-5 shadow-xl">
        
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
        <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-bounce delay-200" />
        <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce delay-400" />
      </div>
    </div>
  );
};

export default Loader;
