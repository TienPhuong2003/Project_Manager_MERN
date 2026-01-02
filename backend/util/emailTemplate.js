export const verifyEmailTemplate = ({ name, link }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
    <h2 style="color:#4f46e5;">Welcome to TaskHub 👋</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Please verify your email by clicking the button below:</p>

    <a href="${link}"
      style="display:inline-block;padding:12px 24px;background:#4f46e5;
      color:#fff;text-decoration:none;border-radius:6px;">
      Verify Email
    </a>

    <p style="margin-top:20px;font-size:12px;color:#666;">
      This link will expire in 1 hour.
    </p>
  </div>
`;

export const resetPasswordTemplate = ({ name, link }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
    <h2 style="color:#dc2626;">Reset your TaskHub password 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>You requested a password reset. Click the button below to set a new password:</p>

    <a href="${link}"
      style="display:inline-block;padding:12px 24px;background:#dc2626;
      color:#fff;text-decoration:none;border-radius:6px;">
      Reset Password
    </a>

    <p style="margin-top:20px;font-size:12px;color:#666;">
      This link will expire in 15 minutes. If you did not request this, please ignore this email.
    </p>
  </div>
`;
