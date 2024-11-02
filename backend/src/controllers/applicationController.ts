import { Request, Response } from "express";
import Application, { IApplication } from "../models/applicationModel";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const submitApplication: AsyncRequestHandler = async (req, res) => {
  const { content, title } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const application = new Application({
      userId: req.user.id,
      title,
      content,
    });
    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Submission failed" });
  }
};

export const updateApplicationStatus: AsyncRequestHandler = async (
  req,
  res
) => {
  const { applicationId, status } = req.body;

  const validStatuses = ["new", "pending", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    application.status = status as IApplication["status"];
    const savedApplication = await application.save();

    res.json({
      message: "Status updated successfully",
      application: {
        id: savedApplication._id,
        status: savedApplication.status,
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

export const getApplications: AsyncRequestHandler = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve application list" });
  }
};

export const searchApplications: AsyncRequestHandler = async (req, res) => {
  const { keyword, status } = req.query;

  try {
    let query: any = {};

    // 关键词搜索（标题、内容和用户名）
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    // 状态筛选
    if (status) {
      query.status = status;
    }

    // 如果是普通用户，只能看到自己的申请
    if (req.user && req.user.role === "public") {
      query.userId = req.user.id;
    }

    const applications = await Application.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "搜索失败" });
  }
};
