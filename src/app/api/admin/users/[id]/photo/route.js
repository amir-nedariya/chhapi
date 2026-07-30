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

import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("photo");
    if (!file) {
      return NextResponse.json({ message: "No photo provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload via stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "chhapi_profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        profilePhoto: uploadResult.secure_url,
      },
    });

    return NextResponse.json({
      message: "Photo uploaded successfully",
      data: { ...updatedUser, _id: updatedUser.id },
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json({ message: "Failed to upload photo" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = checkAuth(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        profilePhoto: null,
      },
    });

    return NextResponse.json({
      message: "Photo deleted",
      data: { ...updatedUser, _id: updatedUser.id },
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ message: "Failed to delete photo" }, { status: 500 });
  }
}
