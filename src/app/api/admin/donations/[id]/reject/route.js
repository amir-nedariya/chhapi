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

export async function PUT(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    if (donation.status === "Success") {
      return NextResponse.json({ message: "Cannot reject an already approved donation" }, { status: 400 });
    }

    await prisma.donation.update({
      where: { id },
      data: { status: "Failed", amount: 0 }
    });

    return NextResponse.json({ message: "Donation rejected successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to reject", error: error.message }, { status: 500 });
  }
}
