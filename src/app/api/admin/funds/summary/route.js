import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  try {
    const funds = await prisma.fund.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: funds,
    });
  } catch (error) {
    console.error("Get fund summary error:", error);
    return NextResponse.json({ success: false, message: "Failed to load fund summary" }, { status: 500 });
  }
}
