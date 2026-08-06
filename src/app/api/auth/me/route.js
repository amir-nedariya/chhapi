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
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.isDeleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return NextResponse.json({
      message: "Success",
      data: userWithoutPassword
    });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ message: "Unauthorized or invalid token" }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const body = await req.json();
    const { name, email } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!existingUser || existingUser.isDeleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateData = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      const cleanEmail = email ? email.trim().toLowerCase() : null;

      if (cleanEmail) {
        // Check if email already taken by another user
        const duplicateEmail = await prisma.user.findFirst({
          where: {
            email: {
              equals: cleanEmail,
              mode: "insensitive",
            },
            id: { not: decoded.userId },
            isDeleted: false,
          },
        });

        if (duplicateEmail) {
          return NextResponse.json(
            { message: "This email address is already in use by another account." },
            { status: 400 }
          );
        }
      }
      updateData.email = cleanEmail;
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    const safeUser = { ...updatedUser };
    delete safeUser.password;

    return NextResponse.json({
      message: "Profile updated successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
