const FullScreenLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1224]">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-white/10 border border-white/20" />
          <div className="absolute inset-4 rounded-full bg-cyan-400/80 animate-bounce" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">₹</span>
          </div>
        </div>

        <p className="text-white font-semibold">{text}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
