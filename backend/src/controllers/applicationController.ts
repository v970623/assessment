import { Request, Response } from "express";
import Application, { IApplication } from "../models/applicationModel";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const submitApplication: AsyncRequestHandler = async (req, res) => {
  const { content } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ error: "未授权" });
      return;
    }
    const application = new Application({
      userId: req.user.id,
      content,
    });
    await application.save();
    res.status(201).json({ message: "申请提交成功" });
  } catch (error) {
    res.status(400).json({ error: "提交失败" });
  }
};

export const updateApplicationStatus: AsyncRequestHandler = async (
  req,
  res
) => {
  const { applicationId, status } = req.body;

  const validStatuses = ["new", "pending", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "无效的状态值" });
    return;
  }

  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      res.status(404).json({ error: "未找到申请" });
      return;
    }

    application.status = status as IApplication["status"];
    const savedApplication = await application.save();

    res.json({
      message: "状态更新成功",
      application: {
        id: savedApplication._id,
        status: savedApplication.status,
      },
    });
  } catch (error) {
    res.status(400).json({ error: "更新失败" });
  }
};
