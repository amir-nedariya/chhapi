import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const creators = await prisma.user.findMany({
      select: { createdBy: true },
      distinct: ['createdBy'],
      where: {
        createdBy: { not: null }
      }
    });

    const creatorNames = creators.map(c => c.createdBy).filter(Boolean);

    return NextResponse.json({
      message: "Creators fetched successfully",
      data: creatorNames
    });
  } catch (error) {
    console.error("Get creators error:", error);
    return NextResponse.json({ message: "Failed to fetch creators" }, { status: 500 });
  }
}
