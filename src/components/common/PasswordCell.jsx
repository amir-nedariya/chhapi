"use client";
import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

const PasswordCell = ({ password }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password || "");
    setCopied(true);
    toast.success("Password copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 shadow-xs select-none">
      <span className="font-mono text-xs font-semibold tracking-wider text-slate-700 min-w-[70px]">
        {visible ? password : "••••••••"}
      </span>
      
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
        title={visible ? "Hide Password" : "Show Password"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
        title="Copy Password"
      >
        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export default PasswordCell;
