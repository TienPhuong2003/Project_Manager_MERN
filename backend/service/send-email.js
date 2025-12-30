import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, name, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#4f46e5;">Welcome to TaskHub 👋</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for registering. Please verify your email by clicking the button below:</p>

      <a href="${verificationLink}"
        style="
          display:inline-block;
          padding:12px 24px;
          background:#4f46e5;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
          margin-top:16px;
        ">
        Verify Email
      </a>

      <p style="margin-top:20px; font-size:12px; color:#666;">
        This link will expire in 1 hour.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TaskHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your TaskHub account",
    html: htmlTemplate,
  });
};
