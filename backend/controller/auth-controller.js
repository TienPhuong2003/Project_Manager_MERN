import User from "../models/user.js";
import bcrypt from "bcrypt";

//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expireAt: Date.now() + 3600000, // 1 hour
    });

    //send email
    const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${verificationToken}&id=${newUser._id}`;
    try {
      await sendVerificationEmail(
        newUser.email,
        newUser.name,
        verificationLink
      );
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { registerUser, loginUser };
