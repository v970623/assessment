import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: "gmail", // 或其他邮件服务
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD, // 使用应用专用密码
  },
});

// 邮件模板
const getEmailTemplate = (type: string, data: any) => {
  switch (type) {
    case "new_application":
      return {
        subject: "新申请提醒",
        html: `
          <h2>新的申请已提交</h2>
          <p>申请标题: ${data.title}</p>
          <p>申请内容: ${data.content}</p>
          <p>提交时间: ${new Date().toLocaleString()}</p>
        `,
      };
    case "status_update":
      return {
        subject: "申请状态更新",
        html: `
          <h2>您的申请状态已更新</h2>
          <p>申请标题: ${data.title}</p>
          <p>最新状态: ${data.status}</p>
          <p>更新时间: ${new Date().toLocaleString()}</p>
        `,
      };
    default:
      return {
        subject: "系统通知",
        html: `<p>${data.message}</p>`,
      };
  }
};

// 发送邮件的主函数
export const sendEmailNotification = async (
  to: string,
  type: string,
  data: any
) => {
  try {
    const template = getEmailTemplate(type, data);

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: "yaozhou794@gmail.com",
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("邮件发送成功:", info.messageId);
    return true;
  } catch (error) {
    console.error("邮件发送失败:", error);
    throw error;
  }
};
