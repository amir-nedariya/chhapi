import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function PATCH(req, { params }) {
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

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    const existing = await prisma.fundRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Fund request not found" }, { status: 404 });
    }

    const reviewer = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    const updated = await prisma.fundRequest.update({
      where: { id },
      data: {
        status,
        reviewedById: decoded.userId,
        reviewedByName: reviewer?.name || reviewer?.mobile || "Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Fund request ${status.toLowerCase()} successfully`,
      data: {
        ...updated,
        _id: updated.id,
      },
    });
  } catch (error) {
    console.error("Update fund request error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to update request" }, { status: 500 });
  }
}
