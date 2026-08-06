import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendEmail } from "../../../../lib/sendEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { message: "Email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: "insensitive",
        },
        isDeleted: false,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save reset OTP in DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetOtp: otp,
        resetOtpExpiry: expiry,
      },
    });

    // Email HTML Template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0d9488; margin: 0;">Chhapi Donation</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Password Reset Verification Code</p>
        </div>
        
        <p style="color: #334155; font-size: 15px;">Hello <strong>${user.name || "User"}</strong>,</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          You requested to reset your password. Use the verification code below to proceed with resetting your password:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0d9488; background: #f0fdfa; border: 2px dashed #0d9488; padding: 12px 28px; border-radius: 10px;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 10px;">This code is valid for 10 minutes.</p>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="text-align: center; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Chhapi Donation. All rights reserved.
        </p>
      </div>
    `;

    // Send Email
    await sendEmail({
      to: cleanEmail,
      subject: "Chhapi Password Reset OTP Code",
      text: `Your password reset OTP is: ${otp}. Valid for 10 minutes.`,
      html: emailHtml,
    });

    return NextResponse.json({
      message: "OTP sent successfully to your email address.",
      email: cleanEmail,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
