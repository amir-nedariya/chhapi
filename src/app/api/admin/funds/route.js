import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, year, month, totalAmount } = body;

    if (!title || !year || !month || !totalAmount) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const amt = Number(totalAmount);
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ message: "Total amount must be a positive number" }, { status: 400 });
    }

    const newFund = await prisma.fund.create({
      data: {
        title: title.trim(),
        year: Number(year),
        month: Number(month),
        totalAmount: amt,
        usedAmount: 0,
        remainingAmount: amt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Fund created successfully",
      data: newFund,
    });
  } catch (error) {
    console.error("Create fund error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to create fund" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const funds = await prisma.fund.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: funds,
    });
  } catch (error) {
    console.error("Get funds error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch funds" }, { status: 500 });
  }
}
