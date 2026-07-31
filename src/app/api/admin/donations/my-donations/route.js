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
  } catch (err) {
    return null;
  }
};

export async function GET(req) {
  try {
    const decoded = checkAuth(req);
    if (!decoded || (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const month = searchParams.get("month") || "ALL";
    const year = searchParams.get("year") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const whereClause = decoded.role === "ADMIN" ? { collectedById: decoded.userId } : {};

    if (status !== "ALL") {
      whereClause.status = status;
    }
    if (month !== "ALL") {
      whereClause.month = parseInt(month, 10);
    }
    if (year !== "ALL") {
      whereClause.year = parseInt(year, 10);
    }
    if (search) {
      whereClause.OR = [
        { donorName: { contains: search, mode: "insensitive" } },
        { collectedByName: { contains: search, mode: "insensitive" } }
      ];
    }

    const skip = (page - 1) * limit;

    const [totalItems, donations, aggregate, uniqueYears] = await prisma.$transaction([
      prisma.donation.count({ where: whereClause }),
      prisma.donation.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.donation.aggregate({
        where: whereClause,
        _sum: { amount: true }
      }),
      prisma.donation.findMany({
        where: decoded.role === "ADMIN" ? { collectedById: decoded.userId } : {},
        distinct: ['year'],
        select: { year: true }
      })
    ]);

    const years = uniqueYears.map(y => y.year).sort((a, b) => b - a);
    const grandTotal = aggregate._sum.amount || 0;

    const data = donations.map(d => ({
      _id: d.id,
      donor: { name: d.donorName },
      donorName: d.donorName,
      donorId: d.donorId,
      amount: d.amount,
      month: d.month,
      year: d.year,
      status: d.status,
      remarks: d.remarks,
      collectedBy: { name: d.collectedByName, role: "ADMIN" },
      date: d.createdAt
    }));

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({ 
      data,
      grandTotal,
      metadata: { years },
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Fetch my donations error:", error);
    return NextResponse.json({ message: "Failed to fetch donations", error: error.message }, { status: 500 });
  }
}
