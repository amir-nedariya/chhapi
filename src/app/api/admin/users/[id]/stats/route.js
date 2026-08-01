import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
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

export async function PATCH(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let monthlyStats = user.monthlyStats ? (typeof user.monthlyStats === 'string' ? JSON.parse(user.monthlyStats) : user.monthlyStats) : {};
    let yearlyStats = user.yearlyStats ? (typeof user.yearlyStats === 'string' ? JSON.parse(user.yearlyStats) : user.yearlyStats) : {};

    // Migration for old flat structure
    if (monthlyStats["Jan"] !== undefined || monthlyStats["Feb"] !== undefined || (Object.keys(monthlyStats).length > 0 && typeof monthlyStats[Object.keys(monthlyStats)[0]] !== 'object')) {
       monthlyStats = { [String(new Date().getFullYear())]: monthlyStats };
    }

    if (body.monthlyStats) {
      // Deep merge for nested year data
      for (const year in body.monthlyStats) {
        if (!monthlyStats[year]) monthlyStats[year] = {};
        
        for (const month in body.monthlyStats[year]) {
          const val = Number(body.monthlyStats[year][month]);
          if (val === 0) {
            delete monthlyStats[year][month];
          } else {
            monthlyStats[year][month] = val;
          }
        }
        
        // if year becomes empty, optionally delete it
        if (Object.keys(monthlyStats[year]).length === 0) {
          delete monthlyStats[year];
        }
      }
    }
    if (body.yearlyStats) {
      yearlyStats = { ...yearlyStats, ...body.yearlyStats };
    }

    // Calculate totals across all years
    let totalDonations = 0;
    let donationCount = 0;
    
    for (const yr in monthlyStats) {
      const values = Object.values(monthlyStats[yr] || {});
      totalDonations += values.reduce((a, b) => Number(a) + Number(b), 0);
      donationCount += values.filter((v) => Number(v) > 0).length;
    }
    
    const avgDonation = donationCount > 0 ? totalDonations / donationCount : 0;

    // Update yearly stats for the current edited years
    if (body.monthlyStats) {
      for (const year in body.monthlyStats) {
        if (!monthlyStats[year]) {
          delete yearlyStats[year];
        } else {
          const values = Object.values(monthlyStats[year]);
          const yearTotal = values.reduce((a, b) => Number(a) + Number(b), 0);
          yearlyStats[year] = yearTotal;
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        monthlyStats,
        yearlyStats,
        totalDonations,
        donationCount,
        avgDonation,
      },
    });

    return NextResponse.json({
      message: "Stats updated successfully",
      data: { ...updatedUser, _id: updatedUser.id },
    });
  } catch (error) {
    console.error("Update stats error:", error);
    return NextResponse.json({ message: "Failed to update stats" }, { status: 500 });
  }
}
