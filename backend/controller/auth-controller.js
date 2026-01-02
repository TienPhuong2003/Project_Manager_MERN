import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import aj from "../libs/arject.js";
import { sendEmail } from "../service/send-email.js";
import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../util/emailTemplate.js";

//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expireAt: Date.now() + 3600000, // 1 hour
    });

    //send email
    const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${verificationToken}&id=${newUser._id}`;
    try {
      await sendEmail({
        to: newUser.email,
        subject: "Verify your TaskHub account",
        html: verifyEmailTemplate({
          name: newUser.name,
          link: verificationLink,
        }),
      });
    } catch (emailError) {
      console.error("Send email failed:", emailError);

      return res.status(201).json({
        message:
          "Account created successfully, but verification email could not be sent. Please try resending email.",
        canResend: true,
      });
    }

    return res.status(201).json({
      message: "Account created. Please check your email to verify.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
        purpose: "email-verification",
      });

      if (!existingVerification || existingVerification.expireAt < new Date()) {
        // tạo & gửi link mới
        await Verification.deleteMany({ userId: user._id });

        const token = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token,
          expireAt: new Date(Date.now() + 60 * 60 * 1000),
        });

        await sendEmail({
          to: user.email,
          subject: "Verify your TaskHub account",
          html: verifyEmailTemplate({
            name: user.name,
            link: `${process.env.FRONT_END_URL}/verify-email?token=${token}`,
          }),
        });
      }

      return res.status(403).json({
        message: "Email not verified. Verification email has been sent.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    user.lastLogin = new Date();
    await user.save();
    const userData = user.toObject();
    delete userData.password;

    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const paypoad = jwt.verify(token, process.env.JWT_SECRET);

    if (!paypoad) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const { userId, purpose } = paypoad;
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const isTokenExpired = verification.expireAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent",
      });
    }
    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    await Verification.deleteMany({ userId: user._id });

    const resetToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m" }
    );
    await Verification.create({
      userId: user._id,
      token: resetToken,
      expireAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    //send email
    const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your TaskHub password",
        html: resetPasswordTemplate({
          name: user.name,
          link: resetLink,
        }),
      });

      return res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } catch (emailError) {
      console.error("Send email failed:", emailError);
      return res.status(500).json({ message: "Could not send reset email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        message: "Reset password link is invalid or expired",
      });
    }

    const { userId, purpose } = payload;

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(400).json({
        message: "Reset password link is invalid or expired",
      });
    }

    if (verification.expireAt < new Date()) {
      return res.status(400).json({
        message: "Reset password link has expired",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
