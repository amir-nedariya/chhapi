import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const checkAuth = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export async function PUT(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }
    
    if (donation.status === "Success") {
      return NextResponse.json({ message: "Already approved" }, { status: 400 });
    }

    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: { status: "Success" }
    });

    const user = await prisma.user.findUnique({ where: { id: donation.donorId } });
    if (user) {
      const monthName = monthNames[donation.month - 1];
      let monthlyStats = user.monthlyStats ? (typeof user.monthlyStats === 'string' ? JSON.parse(user.monthlyStats) : user.monthlyStats) : {};
      let yearlyStats = user.yearlyStats ? (typeof user.yearlyStats === 'string' ? JSON.parse(user.yearlyStats) : user.yearlyStats) : {};
      
      // Migration for old flat structure
      if (monthlyStats["Jan"] !== undefined || monthlyStats["Feb"] !== undefined || (Object.keys(monthlyStats).length > 0 && typeof monthlyStats[Object.keys(monthlyStats)[0]] !== 'object')) {
         monthlyStats = { [String(new Date().getFullYear())]: monthlyStats };
      }
      
      if (!monthlyStats[String(donation.year)]) {
        monthlyStats[String(donation.year)] = {};
      }
      const currentMonthAmount = Number(monthlyStats[String(donation.year)][monthName]) || 0;
      monthlyStats[String(donation.year)][monthName] = currentMonthAmount + donation.amount;
      
      const currentYearAmount = Number(yearlyStats[String(donation.year)]) || 0;
      yearlyStats[String(donation.year)] = currentYearAmount + donation.amount;

      let totalDonations = 0;
      let donationCount = 0;
      for (const yr in monthlyStats) {
        const values = Object.values(monthlyStats[yr] || {});
        totalDonations += values.reduce((a, b) => Number(a) + Number(b), 0);
        donationCount += values.filter((v) => Number(v) > 0).length;
      }
      const avgDonation = donationCount > 0 ? totalDonations / donationCount : 0;

      await prisma.user.update({
        where: { id: user.id },
        data: { monthlyStats, yearlyStats, totalDonations, donationCount, avgDonation },
      });
    }

    return NextResponse.json({ message: "Donation approved successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to approve", error: error.message }, { status: 500 });
  }
}
