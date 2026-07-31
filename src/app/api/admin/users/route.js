import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
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

    // Only SUPER_ADMIN or ADMIN can view users
    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const roleFilter = url.searchParams.get("role") || "ALL";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;
    
    let whereClause = {
      isDeleted: false
    };

    // Search by name or mobile
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } }
      ];
    }

    // Filter by role
    if (roleFilter !== "ALL") {
      whereClause.role = roleFilter;
    }

    // Filter by creator
    const creatorFilter = url.searchParams.get("creator");
    if (creatorFilter && creatorFilter !== "ALL") {
      whereClause.createdBy = creatorFilter;
    }

    // Execute queries in parallel
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause })
    ]);

    // Remove passwords and map id to _id for frontend compatibility
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        _id: user.id
      };
    });

    return NextResponse.json({
      message: "Users fetched successfully",
      data: safeUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}

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
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Only SUPER_ADMIN can create users/admins
    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: You don't have permission to create users" }, { status: 403 });
    }

    const body = await req.json();
    const { name, mobile, password, role } = body;

    if (!name || !mobile || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Lookup the creator's name
    let creatorName = "System";
    try {
      const creator = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { name: true }
      });
      if (creator && creator.name) {
        creatorName = creator.name;
      }
    } catch (e) {
      console.warn("Could not fetch creator name");
    }

    // Check if mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this mobile number already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          name,
          mobile,
          password: hashedPassword,
          role,
          createdBy: creatorName,
        },
      });
    } catch (dbError) {
      // Fallback for local MongoDB standalone
      if (dbError.message?.includes("replica set")) {
        console.log("Fallback to raw insert due to replica set requirement");
        await prisma.$runCommandRaw({
          insert: "User",
          documents: [
            {
              name,
              mobile,
              password: hashedPassword,
              role,
              createdBy: creatorName,
              createdAt: { $date: new Date().toISOString() },
              updatedAt: { $date: new Date().toISOString() }
            }
          ]
        });
        
        newUser = await prisma.user.findUnique({ where: { mobile } });
      } else {
        throw dbError;
      }
    }

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    return NextResponse.json({
      message: `${role === 'ADMIN' ? 'Admin' : 'User'} created successfully`,
      data: userWithoutPassword,
    });

  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ message: error.message || "Failed to create user" }, { status: 500 });
  }
}
