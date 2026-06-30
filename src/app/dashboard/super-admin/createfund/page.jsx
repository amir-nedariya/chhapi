"use client";
import { useState } from "react";
import { createFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { Save, Landmark } from "lucide-react";

const CreateFund = () => {
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.year || !form.month || !form.totalAmount) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await createFundAPI({
        title: form.title,
        year: Number(form.year),
        month: Number(form.month),
        totalAmount: Number(form.totalAmount),
      });

      if (res.data?.success) {
        toast.success("Fund created successfully");
        setForm({
          title: "",
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          totalAmount: "",
        });
      } else {
        toast.error(res.data?.message || "Failed to create fund");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create fund"
      );
    } finally {
      setLoading(false);
    }
  };

  // Neumorphic Shadows
  const cardShadow = {
    boxShadow: "9px 9px 16px #b8c4d9, -9px -9px 16px #ffffff",
    backgroundColor: "#ecf0f3",
  };

  const inputShadow = {
    boxShadow: "inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff",
    backgroundColor: "#ecf0f3",
    border: "none",
  };

  const buttonShadow = buttonPressed
    ? { boxShadow: "inset 3px 3px 6px #b8c4d9, inset -3px -3px 6px #ffffff", backgroundColor: "#ecf0f3" }
    : { boxShadow: "5px 5px 10px #b8c4d9, -5px -5px 10px #ffffff", backgroundColor: "#ecf0f3" };

  return (
    <div className="min-h-screen w-full bg-[#ecf0f3] p-2 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4">
          <div 
            className="p-3.5 rounded-full flex items-center justify-center"
            style={{
              boxShadow: "4px 4px 8px #b8c4d9, -4px -4px 8px #ffffff",
              backgroundColor: "#ecf0f3"
            }}
          >
            <Landmark className="text-cyan-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Create New Fund
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">Initialize a new monthly budget allocation</p>
          </div>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-8 space-y-6 transition-all duration-300"
          style={cardShadow}
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
              Fund Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Medical Relief Fund"
              className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold"
              style={inputShadow}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YEAR */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none transition-all font-semibold"
                style={inputShadow}
              />
            </div>

            {/* MONTH */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
                Month
              </label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none transition-all cursor-pointer font-semibold"
                style={inputShadow}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 px-1">
              Total Amount (₹)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              placeholder="e.g., 50000"
              className="w-full px-5 py-3 rounded-2xl text-slate-800 outline-none transition-all placeholder:text-gray-400 font-semibold"
              style={inputShadow}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              disabled={loading}
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
              onMouseLeave={() => setButtonPressed(false)}
              onTouchStart={() => setButtonPressed(true)}
              onTouchEnd={() => setButtonPressed(false)}
              className="w-full flex items-center justify-center gap-2 text-cyan-600 font-extrabold py-4 rounded-2xl transition-all active:scale-[0.99] disabled:opacity-50"
              style={buttonShadow}
            >
              <Save size={20} className="text-cyan-600" />
              <span>{loading ? "Creating..." : "Create Fund"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFund;

