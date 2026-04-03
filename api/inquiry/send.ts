import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, contact, company, content } = req.body;

  if (!name || !email || !contact || !content) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SafeD 문의" <${process.env.EMAIL_USER}>`,
    to: 'sales@safed.co.kr, safesol@safed.co.kr',
    replyTo: email,
    subject: `[SafeD 문의] ${company ? company + ' - ' : ''}${name}`,
    html: `
      <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #191F28; border-bottom: 2px solid #007BFF; padding-bottom: 12px;">
          새로운 도입 문의
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 10px 12px; background: #F8F9FA; font-weight: 600; width: 100px; border-bottom: 1px solid #E5E8EB;">담당자</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E5E8EB;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #F8F9FA; font-weight: 600; border-bottom: 1px solid #E5E8EB;">이메일</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E5E8EB;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #F8F9FA; font-weight: 600; border-bottom: 1px solid #E5E8EB;">연락처</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E5E8EB;">${contact}</td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 10px 12px; background: #F8F9FA; font-weight: 600; border-bottom: 1px solid #E5E8EB;">회사명</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #E5E8EB;">${company}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #F8F9FA; border-radius: 8px;">
          <p style="font-weight: 600; color: #191F28; margin-bottom: 8px;">문의 내용</p>
          <p style="color: #4E5968; line-height: 1.7; white-space: pre-wrap;">${content}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #8B95A1;">
          safed.co.kr 문의 폼에서 발송된 메일입니다.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error: any) {
    console.error('Email error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
