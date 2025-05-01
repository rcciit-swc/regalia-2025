import nodemailer from 'nodemailer';
import path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { toast } from 'sonner';

interface EmailContent {
  to: string;
  subject: string;
  // text: string;
  fileName: string;
  data: {};
}

export async function sendMail({ to, subject, fileName, data }: EmailContent) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      tls: {
        rejectUnauthorized: false,
      },
      port: 465 ,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection
    await transporter
      .verify()
      .then(() => {})
      .catch((err) => {
        console.error('Error verifying email connection:', err);
        throw err;
      });

    const templatePath = path.join(process.cwd(), 'public', 'mails', fileName);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }
    const html: string = await ejs.renderFile(templatePath, { data });

    const mailOptions = {
      from: `"Regalia 2025" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
}
