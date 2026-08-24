import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = null;
    let userRole = "USER";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        userRole = decoded.role || "USER";
      } catch {
        // Continue unauthenticated if token invalid
      }
    }

    const body = await req.json();
    const { name, mobile, amount, reason, photo } = body;

    if (!name || !mobile || !amount || !reason) {
      return NextResponse.json({ message: "Name, mobile, amount and reason are required" }, { status: 400 });
    }

    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      return NextResponse.json({ message: "Requested amount must be positive" }, { status: 400 });
    }

    const newRequest = await prisma.fundRequest.create({
      data: {
        name: name.trim(),
        mobile: mobile.trim(),
        role: userRole,
        userId,
        amount: amtNum,
        reason: reason.trim(),
        photo: photo || "",
        status: "Pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Fund request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Create fund request error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to submit fund request" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const where = statusFilter ? { status: statusFilter } : {};

    const requests = await prisma.fundRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = requests.map((r) => ({
      ...r,
      _id: r.id,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get fund requests error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch fund requests" }, { status: 500 });
  }
}
