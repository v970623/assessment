import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = "12345678";
const STAFF_CODE = "9999";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;
export const register: AsyncRequestHandler = async (req, res) => {
  const { username, password, email, code } = req.body;
  try {
    const role = code === STAFF_CODE ? "staff" : "public";

    const user = new User({
      username,
      password,
      email,
      role,
    });

    await user.save();
    res.status(201).json({
      message: "User registration successful",
      role,
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const login: AsyncRequestHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
};
