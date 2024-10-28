import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const JWT_SECRET = "12345678";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const register: AsyncRequestHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "用户注册成功" });
  } catch (error) {
    res.status(400).json({ error: "注册失败" });
  }
};

export const login: AsyncRequestHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "无效的凭证" });
      return;
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "登录失败" });
  }
};
