import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
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
  } catch (error) {
    return null;
  }
};

export async function POST(req) {
  try {
    const decoded = checkAuth(req);

    if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No donation IDs provided" }, { status: 400 });
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get donations to approve
    const pendingDonations = await prisma.donation.findMany({
      where: {
        id: { in: ids },
        status: "Pending"
      }
    });

    if (pendingDonations.length === 0) {
      return NextResponse.json({ message: "No valid pending donations found to approve" }, { status: 400 });
    }

    // Process user updates
    const donorIds = [...new Set(pendingDonations.map(d => d.donorId))];
    const users = await prisma.user.findMany({ where: { id: { in: donorIds } } });
    const userMap = new Map(users.map(u => [u.id, u]));

    const userUpdates = [];
    
    // Group donations by user
    const donationsByUser = {};
    for (const d of pendingDonations) {
      if (!donationsByUser[d.donorId]) donationsByUser[d.donorId] = [];
      donationsByUser[d.donorId].push(d);
    }

    for (const [donorId, donations] of Object.entries(donationsByUser)) {
      const user = userMap.get(donorId);
      if (!user) continue;

      let monthlyStats = user.monthlyStats ? (typeof user.monthlyStats === 'string' ? JSON.parse(user.monthlyStats) : user.monthlyStats) : {};
      let yearlyStats = user.yearlyStats ? (typeof user.yearlyStats === 'string' ? JSON.parse(user.yearlyStats) : user.yearlyStats) : {};

      // Migration for old flat structure
      if (monthlyStats["Jan"] !== undefined || monthlyStats["Feb"] !== undefined || (Object.keys(monthlyStats).length > 0 && typeof monthlyStats[Object.keys(monthlyStats)[0]] !== 'object')) {
         monthlyStats = { [String(new Date().getFullYear())]: monthlyStats };
      }

      for (const donation of donations) {
        const monthName = monthNames[donation.month - 1];
        if (!monthlyStats[String(donation.year)]) {
          monthlyStats[String(donation.year)] = {};
        }
        const currentMonthAmount = Number(monthlyStats[String(donation.year)][monthName]) || 0;
        monthlyStats[String(donation.year)][monthName] = currentMonthAmount + donation.amount;
        
        const currentYearAmount = Number(yearlyStats[String(donation.year)]) || 0;
        yearlyStats[String(donation.year)] = currentYearAmount + donation.amount;
      }

      let totalDonations = 0;
      let donationCount = 0;
      for (const yr in monthlyStats) {
        const values = Object.values(monthlyStats[yr] || {});
        totalDonations += values.reduce((a, b) => Number(a) + Number(b), 0);
        donationCount += values.filter((v) => Number(v) > 0).length;
      }
      const avgDonation = donationCount > 0 ? totalDonations / donationCount : 0;

      userUpdates.push(prisma.user.update({
        where: { id: donorId },
        data: { monthlyStats, yearlyStats, totalDonations, donationCount, avgDonation }
      }));
    }

    // Execute updates transactionally
    await prisma.$transaction([
      ...userUpdates,
      prisma.donation.updateMany({
        where: { id: { in: pendingDonations.map(d => d.id) } },
        data: { status: "Success" }
      })
    ]);

    return NextResponse.json({ 
      message: `Successfully approved ${pendingDonations.length} donations`,
      count: pendingDonations.length 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Bulk Approve Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
