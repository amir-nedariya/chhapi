"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Landmark, Send, IndianRupee, FileText, Camera } from "lucide-react";

const FundRequestPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "",
    reason: "",
  });
  const [photo, setPhoto] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      // Allow some time for video ref to mount
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast.error("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setPhoto(dataUrl);
      stopCamera();
      toast.success("Photo captured successfully!");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        mobile: user.mobile || "",
      }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return toast.error("Please enter applicant name");
    if (!formData.mobile.trim()) return toast.error("Please enter mobile number");
    if (!formData.amount || Number(formData.amount) <= 0) return toast.error("Please enter a valid request amount");
    if (!formData.reason.trim()) return toast.error("Please enter a reason or purpose for the request");

    setSubmitting(true);

    try {
      // Fetch existing requests from localStorage
      const existingRequests = JSON.parse(localStorage.getItem("chhapi_fund_requests") || "[]");

      const newRequest = {
        _id: "req_" + Date.now(),
        name: formData.name,
        mobile: formData.mobile,
        amount: Number(formData.amount),
        reason: formData.reason,
        photo: photo || "",
        role: user?.role || "ADMIN",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      existingRequests.unshift(newRequest);
      localStorage.setItem("chhapi_fund_requests", JSON.stringify(existingRequests));

      // Trigger custom event so sidebar/notifications can update in real-time
      window.dispatchEvent(new Event("chhapi_new_fund_request"));

      toast.success("🚀 Fund request submitted successfully!");
      setFormData({
        name: "",
        mobile: "",
        amount: "",
        reason: "",
      });
      setPhoto("");
      setFileKey(Date.now());
    } catch (error) {
      toast.error("❌ Failed to submit fund request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 sm:p-8 space-y-6 text-slate-800 font-sans">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 px-1">
          <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-primary flex items-center justify-center">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              Request Funds
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Apply for budget allocations or financial assistance</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Applicant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter applicant full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-xl text-slate-800 outline-none text-xs font-medium transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-xl text-slate-800 outline-none text-xs font-medium transition-all"
              />
            </div>

            {/* Requested Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Amount Requested (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  placeholder="Enter amount in Rupees"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-xl text-slate-800 outline-none text-xs font-medium transition-all"
                />
              </div>
            </div>

            {/* Purpose / Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Purpose / Reason for Request <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 text-slate-400 w-4 h-4" />
                <textarea
                  rows="4"
                  placeholder="Please describe the detailed purpose or reason for requesting funds..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-xl text-slate-800 outline-none text-xs font-medium transition-all resize-none"
                />
              </div>
            </div>
            {/* Upload Document / Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Upload Document / Photo (Optional)
              </label>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    key={fileKey}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100/80 file:cursor-pointer transition-all border border-dashed border-slate-200 rounded-xl p-2"
                  />
                  <span className="text-slate-400 text-xs font-semibold">OR</span>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full sm:w-auto py-2.5 px-4 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex-shrink-0"
                  >
                    <Camera size={14} />
                    <span>Capture Camera</span>
                  </button>
                </div>
                {photo && (
                  <div className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition active:scale-90 text-[10px] font-bold cursor-pointer shadow-sm"
                      title="Remove Photo"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--sidebar-from)] to-[var(--sidebar-via)] text-white hover:brightness-105 active:scale-[0.98] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                <span>{submitting ? "Submitting Request..." : "Submit Request"}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Camera Live Preview Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-150 shadow-xl">
            <h3 className="text-slate-800 font-semibold text-sm">Capture Photo</h3>
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="py-2.5 px-6 bg-gradient-to-r from-[var(--sidebar-from)] to-[var(--sidebar-via)] text-white hover:brightness-105 active:scale-[0.98] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundRequestPage;
