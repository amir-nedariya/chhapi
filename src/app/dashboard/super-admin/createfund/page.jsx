"use client";
import { useState } from "react";
import { createFundAPI } from "../../../../api/fund.api";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

const CreateFund = () => {
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalAmount: "",
  });

  const [loading, setLoading] = useState(false);

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

      await createFundAPI({
        title: form.title,
        year: Number(form.year),
        month: Number(form.month),
        totalAmount: Number(form.totalAmount),
      });

      toast.success("Fund created successfully");

      setForm({
        title: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        totalAmount: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create fund"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold text-white mb-6">
        Create New Fund
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5"
      >
        {/* TITLE */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Fund Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Fund April 2026"
            className="w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* YEAR */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* MONTH */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Month
          </label>
          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"
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

        {/* AMOUNT */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Total Amount (₹)
          </label>
          <input
            type="number"
            name="totalAmount"
            value={form.totalAmount}
            onChange={handleChange}
            placeholder="5000"
            className="w-full px-4 py-2.5 rounded-lg bg-[#020617] text-white border border-white/10 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Creating..." : "Create Fund"}
        </button>
      </form>
    </div>
  );
};

export default CreateFund;

