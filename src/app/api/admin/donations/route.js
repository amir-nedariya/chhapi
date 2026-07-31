import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function POST(req) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { donorId, amount, month, year, paymentMethod, remarks } = body;

    if (!donorId || !amount || !month || !year) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: donorId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const adminUser = await prisma.user.findUnique({ where: { id: decoded.userId } });

    // Determine Status
    const isSuperAdmin = decoded.role === "SUPER_ADMIN";
    const status = isSuperAdmin ? "Success" : "Pending";

    // Create Donation Record
    const donation = await prisma.donation.create({
      data: {
        donorId: user.id,
        donorName: user.name || "Unknown Donor",
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
        status,
        paymentMethod: paymentMethod || "Cash",
        remarks: remarks || "",
        collectedById: adminUser?.id || "",
        collectedByName: adminUser?.name || "System"
      }
    });

    if (isSuperAdmin) {
      // Update user stats directly if Super Admin created it
      const monthName = monthNames[Number(month) - 1];
      
      let monthlyStats = user.monthlyStats ? (typeof user.monthlyStats === 'string' ? JSON.parse(user.monthlyStats) : user.monthlyStats) : {};
      let yearlyStats = user.yearlyStats ? (typeof user.yearlyStats === 'string' ? JSON.parse(user.yearlyStats) : user.yearlyStats) : {};
      
      // Migration for old flat structure
      if (monthlyStats["Jan"] !== undefined || monthlyStats["Feb"] !== undefined || (Object.keys(monthlyStats).length > 0 && typeof monthlyStats[Object.keys(monthlyStats)[0]] !== 'object')) {
         monthlyStats = { [String(new Date().getFullYear())]: monthlyStats };
      }
      
      // Update monthly stats by year
      if (!monthlyStats[String(year)]) {
        monthlyStats[String(year)] = {};
      }
      const currentMonthAmount = Number(monthlyStats[String(year)][monthName]) || 0;
      monthlyStats[String(year)][monthName] = currentMonthAmount + Number(amount);
      
      // Update yearly stats
      const currentYearAmount = Number(yearlyStats[String(year)]) || 0;
      yearlyStats[String(year)] = currentYearAmount + Number(amount);

      // Calculate totals across all years
      let totalDonations = 0;
      let donationCount = 0;
      
      for (const yr in monthlyStats) {
        const values = Object.values(monthlyStats[yr] || {});
        totalDonations += values.reduce((a, b) => Number(a) + Number(b), 0);
        donationCount += values.filter((v) => Number(v) > 0).length;
      }
      
      const avgDonation = donationCount > 0 ? totalDonations / donationCount : 0;

      await prisma.user.update({
        where: { id: donorId },
        data: {
          monthlyStats,
          yearlyStats,
          totalDonations,
          donationCount,
          avgDonation,
        },
      });
    }

    return NextResponse.json({
      message: "Donation recorded successfully",
      data: donation
    });

  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json({ message: "Failed to record donation", error: error.message }, { status: 500 });
  }
}
