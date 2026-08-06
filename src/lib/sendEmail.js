import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, text }) {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || `"Chhapi Support" <no-reply@chhapi.org>`;

  console.log(`\n========================================`);
  console.log(`[EMAIL SENDING] To: ${to}`);
  console.log(`[EMAIL SUBJECT]: ${subject}`);
  if (text) console.log(`[EMAIL CONTENT]: ${text}`);
  console.log(`========================================\n`);

  if (!host || !user || !pass) {
    console.warn("⚠️ SMTP credentials not fully configured in .env. Email printed above.");
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email via SMTP:", error);
    // Still return success in development mode with simulated flag so app remains functional
    return { success: false, error: error.message };
  }
}
