import { Request, Response } from "express";
import Application, { IApplication } from "../models/applicationModel";
import fs from "fs";
import path from "path";

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

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (req.user && req.user.role === "public") {
      query.userId = req.user.id;
    }

    const applications = await Application.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "申请不存在" });
    }

    if (
      req.user?.role !== "staff" &&
      application.userId.toString() !== req.user?.id
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: "无权上传文件" });
    }

    const filePath = `/uploads/${path.basename(req.file.path)}`;
    application.attachments = application.attachments || [];
    application.attachments.push(filePath);
    await application.save();

    res.json({
      message: "文件上传成功",
      filePath,
    });
  } catch (error) {
    console.error("文件上传错误:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "文件上传失败" });
  }
};
