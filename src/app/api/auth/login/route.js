import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { verifyPassword, encryptPassword } from "../../../../lib/encryption";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mobile, password } = body;

    if (!mobile || !password) {
      return NextResponse.json({ message: "Mobile and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user || user.isDeleted) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Auto-upgrade legacy bcrypt hashes to enc: format on successful login
    if (!user.password.startsWith("enc:")) {
      try {
        const encPass = encryptPassword(password);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: encPass }
        });
      } catch (e) {
        console.warn("Could not auto-upgrade user password format");
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return NextResponse.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

