import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../../../lib/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_12345";

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

    // Only SUPER_ADMIN and ADMIN can broadcast/send emails
    if (!["SUPER_ADMIN", "ADMIN"].includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden: Only admins can send report emails" }, { status: 403 });
    }

    const body = await req.json();
    const { pdfBase64, year = new Date().getFullYear(), customEmail, targetEmails } = body;

    if (!pdfBase64) {
      return NextResponse.json({ message: "PDF data is required" }, { status: 400 });
    }

    // Strip base64 data URI prefix robustly (handling data:application/pdf;filename=...;base64, etc.)
    let rawBase64 = pdfBase64;
    if (rawBase64.includes(",")) {
      rawBase64 = rawBase64.split(",")[1];
    }
    rawBase64 = rawBase64.trim();
    const pdfBuffer = Buffer.from(rawBase64, "base64");

    // Gather email recipients
    let recipientsList = [];

    if (Array.isArray(targetEmails) && targetEmails.length > 0) {
      recipientsList = targetEmails.filter(e => typeof e === 'string' && e.includes("@"));
      if (customEmail && customEmail.trim() && !recipientsList.includes(customEmail.trim())) {
        recipientsList.push(customEmail.trim());
      }
    } else if (customEmail && customEmail.trim()) {
      recipientsList = [customEmail.trim()];
    } else {
      // Fetch all non-deleted users who have an email address
      const users = await prisma.user.findMany({
        where: {
          isDeleted: false,
          email: { not: null }
        },
        select: { email: true, name: true }
      });

      recipientsList = users
        .map(u => u.email)
        .filter(email => email && email.includes("@"));

      // Also ensure default fallback/SMTP email is included if list is empty
      if (process.env.SMTP_USER && !recipientsList.includes(process.env.SMTP_USER)) {
        recipientsList.push(process.env.SMTP_USER);
      }
    }

    // Remove duplicates
    recipientsList = [...new Set(recipientsList)];

    if (recipientsList.length === 0) {
      return NextResponse.json({
        message: "No user email addresses found in database to send report."
      }, { status: 400 });
    }

    const subject = `Chhapi Annual Donation PDF Report - ${year}`;
    const attachments = [
      {
        filename: `Chhapi_Donation_Report_${year}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ];

    let successCount = 0;
    let failedCount = 0;

    for (const email of recipientsList) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #00ccff; padding-bottom: 16px; margin-bottom: 20px;">
              <h1 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: bold;">CHHAPI DONATION PORTAL</h1>
              <p style="color: #00ccff; margin: 4px 0 0 0; font-size: 14px; font-weight: 600;">Annual Donation Statement (${year})</p>
            </div>
            
            <p style="font-size: 15px; line-height: 1.6;">Dear Member / Donor,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Please find attached the official <strong>Chhapi Annual Donation PDF Statement for Year ${year}</strong> containing detailed monthly breakdown and collection summaries.
            </p>

            <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00ccff;">
              <p style="margin: 0; font-size: 13px; color: #334155; font-weight: 600;">📄 Attachment Included:</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #0f172a; font-family: monospace;">Chhapi_Donation_Report_${year}.pdf</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Thank you for your continuous support and valuable contributions towards our community initiatives.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
              This is an automated report email from Chhapi Support. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      `;

      const result = await sendEmail({
        to: email,
        subject,
        html: htmlContent,
        text: `Hello, please find attached the Chhapi Annual Donation Statement for ${year}.`,
        attachments
      });

      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }
    }

    return NextResponse.json({
      message: `PDF report sent successfully to ${successCount} recipient(s)!${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
      successCount,
      failedCount,
      recipients: recipientsList
    });

  } catch (error) {
    console.error("Email PDF report error:", error);
    return NextResponse.json({ message: error.message || "Failed to send PDF report via email" }, { status: 500 });
  }
}
