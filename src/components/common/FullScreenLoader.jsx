import { Heart, Users, Leaf, HeartHandshake } from "lucide-react";

const FullScreenLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f0fdfa] overflow-hidden px-4">
      {/* --- BACKGROUND DECORATIONS (Match Login) --- */}
      
      {/* Top Left Watercolor Blob */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
      
      {/* Top Right Dotted/Leaf Patterns */}
      <div className="absolute top-10 right-10 opacity-20">
        <Leaf size={40} className="text-teal-600 rotate-45 mb-4" />
        <Heart size={20} className="text-teal-500 ml-8" />
      </div>

      {/* Bottom Wavy Shape & Hands */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[150px] sm:h-[250px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,110.36,112.55,108.79,166.4,92.83,219.06,77.3,269.58,66,321.39,56.44Z"
            className="fill-[var(--primary)] opacity-90"
          ></path>
          <path
            d="M0,50 C200,100 300,10 500,50 C700,90 800,20 1200,50 L1200,120 L0,120 Z"
            className="fill-[var(--primary)] opacity-60"
          ></path>
          <path
            d="M0,80 C150,110 300,30 500,60 C700,90 900,40 1200,80 L1200,120 L0,120 Z"
            className="fill-[var(--primary)] opacity-30"
          ></path>
        </svg>

        <div className="absolute bottom-12 left-12 flex items-end gap-2 opacity-20 hidden md:flex">
          <Users size={80} className="text-[var(--primary-hover)]" />
          <HeartHandshake size={120} className="text-[var(--primary)] mb-8 -ml-8" />
        </div>
      </div>

      {/* --- CENTRAL LOADER CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700 w-full max-w-sm -mt-16">
        
        {/* Animated Ring & Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[2px] border-[var(--primary)]/20" />
          
          {/* Spinning container for dot */}
          <div className="absolute inset-0 animate-[spin_2s_linear_infinite]">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--primary)] rounded-full shadow-[0_0_10px_rgba(0,115,128,0.5)]" />
          </div>
          
          {/* Inner Glowing Circles */}
          <div className="absolute inset-2 rounded-full border border-[var(--primary)]/10" />
          <div className="absolute inset-4 rounded-full bg-white shadow-lg flex items-center justify-center p-2 animate-pulse">
            <img
              src="/logo.png"
              alt="Loading"
              className="w-full h-auto drop-shadow-sm mix-blend-multiply"
              onError={(e) => { e.target.src = '/applogo.png'; }}
            />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-[24px] font-extrabold text-[var(--primary)] tracking-tight mb-1 text-center">
          {text}
        </h2>
        <p className="text-[14px] text-slate-500 font-medium mb-6 text-center">
          Preparing your dashboard
        </p>

        {/* Animated Dots */}
        <div className="flex gap-2 mb-2">
          <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-[var(--primary)]/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-[var(--primary)]/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
