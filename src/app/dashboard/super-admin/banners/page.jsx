"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Image, Save, Trash2, ToggleLeft, ToggleRight, Calendar, PlusCircle, Sparkles } from "lucide-react";

const PRESET_OPTIONS = [
  { value: "diwali", label: "Diwali (દિવાળી)" },
  { value: "eid", label: "Eid (ઈદ)" },
  { value: "navratri", label: "Navratri (નવરાત્રી)" },
  { value: "independence", label: "Independence Day (સ્વાતંત્ર્ય દિન)" },
  { value: "general", label: "General Announcement (સામાન્ય જાહેરાત)" }
];

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    bannerType: "preset", // 'preset' or 'custom'
    presetType: "diwali",
    customImage: "",
    startDate: "",
    endDate: "",
    active: true
  });
  
  const [loading, setLoading] = useState(false);

  // Load existing banners
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chhapi_banners") || "[]");
      setBanners(saved);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle custom image upload and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // Limit size to 2MB for localStorage
      toast.error("Image file size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        customImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.bannerType === "custom" && !form.customImage) {
      toast.error("Please upload an image for custom banner");
      return;
    }

    const newBanner = {
      ...form,
      id: "BN_" + Date.now()
    };

    const updated = [newBanner, ...banners];
    setBanners(updated);
    localStorage.setItem("chhapi_banners", JSON.stringify(updated));
    
    // Dispatch event to notify layout
    window.dispatchEvent(new Event("chhapi_banners_changed"));

    toast.success("Banner created successfully!");
    
    // Reset form
    setForm({
      title: "",
      description: "",
      bannerType: "preset",
      presetType: "diwali",
      customImage: "",
      startDate: "",
      endDate: "",
      active: true
    });
  };

  const handleDelete = (id) => {
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated);
    localStorage.setItem("chhapi_banners", JSON.stringify(updated));
    window.dispatchEvent(new Event("chhapi_banners_changed"));
    toast.success("Banner deleted successfully!");
  };

  const toggleActive = (id) => {
    const updated = banners.map(b => {
      if (b.id === id) {
        return { ...b, active: !b.active };
      }
      return b;
    });
    setBanners(updated);
    localStorage.setItem("chhapi_banners", JSON.stringify(updated));
    window.dispatchEvent(new Event("chhapi_banners_changed"));
    toast.success("Banner status updated!");
  };

  // Card Shadow configs matching createfund page
  const cardShadow = {
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  const inputShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
  };

  const buttonShadow = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 shadow-sm flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                બેનર અને પોસ્ટર વ્યવસ્થાપન (Banner Management)
              </h2>
              <p className="text-slate-500 text-sm mt-0.5 font-medium">Create festival announcements & event sliders for all users</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CREATE BANNER FORM */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-6 space-y-5 transition-all duration-300"
              style={cardShadow}
            >
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <PlusCircle size={18} className="text-teal-600" />
                નવું બેનર ઉમેરો (Add Banner)
              </h3>

              {/* BANNER TYPE */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                  બેનર પ્રકાર (Banner Type)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, bannerType: "preset" }))}
                    className={`py-2.5 rounded-xl font-bold border transition text-sm ${
                      form.bannerType === "preset"
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Preset Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, bannerType: "custom" }))}
                    className={`py-2.5 rounded-xl font-bold border transition text-sm ${
                      form.bannerType === "custom"
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    Custom Upload
                  </button>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                  શીર્ષક (Title - Optional for Presets)
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="દા.ત., દિવાળી શુભકામનાઓ!"
                  className="w-full px-4 py-2.5 rounded-xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold"
                  style={inputShadow}
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                  વર્ણન (Description - Optional for Presets)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="બેનર પર દર્શાવવા માટેનો ટૂંકો સંદેશ..."
                  className="w-full px-4 py-2.5 rounded-xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold resize-none"
                  style={inputShadow}
                />
              </div>

              {/* PRESET TYPE SELECT */}
              {form.bannerType === "preset" && (
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                    ટેમ્પલેટ પસંદ કરો (Select Template)
                  </label>
                  <select
                    name="presetType"
                    value={form.presetType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl text-slate-800 outline-none transition-all font-semibold cursor-pointer"
                    style={inputShadow}
                  >
                    {PRESET_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CUSTOM IMAGE UPLOAD */}
              {form.bannerType === "custom" && (
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                    પોસ્ટર ઈમેજ અપલોડ (Image - Max 2MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 rounded-xl text-slate-800 outline-none transition-all font-semibold"
                    style={inputShadow}
                  />
                  {form.customImage && (
                    <div className="mt-3 relative rounded-lg overflow-hidden h-28 border border-slate-200">
                      <img src={form.customImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              )}

              {/* DATE RANGE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 px-1">
                    શરૂઆત તારીખ (Start Date)
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl text-slate-800 outline-none text-xs font-semibold"
                    style={inputShadow}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 px-1">
                    અંતિમ તારીખ (End Date)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl text-slate-800 outline-none text-xs font-semibold"
                    style={inputShadow}
                  />
                </div>
              </div>

              {/* ACTIVE TOGGLE */}
              <div className="flex items-center justify-between p-1">
                <span className="text-sm font-bold text-slate-600">હાલ ચાલુ રાખવું છે? (Active status)</span>
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="w-5 h-5 accent-teal-600 cursor-pointer"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-teal-600 font-extrabold py-3.5 rounded-xl transition-all active:scale-[0.99]"
                style={buttonShadow}
              >
                <Save size={18} className="text-teal-600" />
                <span>બેનર સેવ કરો (Save Banner)</span>
              </button>
            </form>
          </div>

          {/* LIST OF BANNERS */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
              <Image size={18} className="text-teal-600" />
              ચાલુ બેનર્સ અને જાહેરાતો (Active Banners List)
            </h3>

            {banners.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 text-slate-400 font-semibold bg-slate-50/50">
                કોઈ બેનર મળ્યું નથી. ડાબી બાજુથી નવું બેનર ઉમેરો.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {banners.map((banner) => {
                  const isPreset = banner.bannerType === "preset";
                  const startDisplay = banner.startDate || "તુરંત જ";
                  const endDisplay = banner.endDate || "કાયમ માટે";

                  return (
                    <div
                      key={banner.id}
                      className="p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all bg-white"
                      style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)" }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Preview Block */}
                        <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-bold">
                          {isPreset ? (
                            <span className="text-center text-teal-700 capitalize p-1 leading-tight">{banner.presetType}</span>
                          ) : banner.customImage ? (
                            <img src={banner.customImage} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <Image size={18} className="text-slate-400" />
                          )}
                        </div>

                        {/* Title & Stats */}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 truncate text-sm sm:text-base">
                            {banner.title || (isPreset ? `${banner.presetType.toUpperCase()} Preset` : "શીર્ષક વગર")}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {banner.description || "કોઈ વર્ણન નથી."}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                              <Calendar size={11} />
                              {startDisplay} થી {endDisplay}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              banner.active 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {banner.active ? "ચાલુ (Active)" : "બંધ (Inactive)"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 justify-end">
                        <button
                          onClick={() => toggleActive(banner.id)}
                          title={banner.active ? "Deactivate" : "Activate"}
                          className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-600 transition"
                        >
                          {banner.active ? <ToggleRight size={22} className="text-teal-600" /> : <ToggleLeft size={22} className="text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 rounded-xl border border-slate-100 hover:bg-rose-50 text-rose-600 transition"
                          title="Delete Banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BannerManagement;
