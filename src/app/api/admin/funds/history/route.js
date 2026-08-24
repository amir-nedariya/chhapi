import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  try {
    const history = await prisma.fundUsage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fund: {
          select: { title: true },
        },
      },
    });

    const formatted = history.map((item) => ({
      _id: item.id,
      id: item.id,
      amount: item.amount,
      note: item.note,
      fundTitle: item.fund?.title || "Budget Fund",
      usedBy: {
        name: item.usedByName || "Unknown",
        role: item.usedByRole || "ADMIN",
      },
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get fund history error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch fund history" }, { status: 500 });
  }
}
