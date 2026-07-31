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

export async function GET(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    safeUser._id = safeUser.id;

    // Fetch pending donations for this user
    const pendingDonations = await prisma.donation.findMany({
      where: { donorId: id, status: "Pending" }
    });
    safeUser.pendingDonations = pendingDonations;

    return NextResponse.json({
      message: "User fetched successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

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

    const updateData = {};
    if (body.hasOwnProperty("isDeleted")) {
      updateData.isDeleted = body.isDeleted;
      if (body.isDeleted) {
        updateData.deletedAt = new Date();
        updateData.deletedBy = decoded.userId;
      }
    }
    if (body.hasOwnProperty("role")) {
      updateData.role = body.role;
    }
    updateData.updatedBy = decoded.userId;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "User updated successfully",
      data: { ...updatedUser, _id: updatedUser.id },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: decoded.userId,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
