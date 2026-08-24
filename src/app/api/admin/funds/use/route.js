import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
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

    const body = await req.json();
    const { fundId, amount, note } = body;

    if (!fundId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ message: "Valid fundId and amount are required" }, { status: 400 });
    }

    const amtNum = Number(amount);

    // Fetch user details for history tracking
    const activeUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    const result = await prisma.$transaction(async (tx) => {
      const fund = await tx.fund.findUnique({
        where: { id: fundId },
      });

      if (!fund) {
        throw new Error("Fund not found");
      }

      if (fund.remainingAmount < amtNum) {
        throw new Error(`Insufficient funds in ${fund.title}. Available: ₹${fund.remainingAmount}`);
      }

      const updatedFund = await tx.fund.update({
        where: { id: fundId },
        data: {
          usedAmount: { increment: amtNum },
          remainingAmount: { decrement: amtNum },
        },
      });

      const usage = await tx.fundUsage.create({
        data: {
          fundId,
          amount: amtNum,
          note: (note || "Fund Usage").trim(),
          usedById: decoded.userId,
          usedByName: activeUser?.name || activeUser?.mobile || "System User",
          usedByRole: activeUser?.role || decoded.role || "ADMIN",
        },
      });

      return { updatedFund, usage };
    });

    return NextResponse.json({
      success: true,
      message: "Fund usage recorded successfully",
      data: result.usage,
    });
  } catch (error) {
    console.error("Use fund error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to record fund usage" },
      { status: 400 }
    );
  }
}
