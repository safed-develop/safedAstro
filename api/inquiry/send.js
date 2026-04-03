import nodemailer from 'nodemailer';

export const config = {
  api: { bodyParser: false },
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function esc(str) {
  return String(str).replace(/[^\x20-\x7E]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const raw = await readBody(req);
  const { name, email, contact, company, content } = JSON.parse(raw);

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

  const subjectText = company ? `[SafeD] ${company} - ${name}` : `[SafeD] ${name}`;
  const subjectB64 = `=?UTF-8?B?${Buffer.from(subjectText, 'utf-8').toString('base64')}?=`;

  const n = esc(name);
  const c = esc(contact);
  const co = company ? esc(company) : '';
  const ct = esc(content);

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
<h2 style="color:#191F28;border-bottom:2px solid #007BFF;padding-bottom:12px">&#49352;&#47196;&#50868; &#46020;&#51077; &#47928;&#51032;</h2>
<table style="width:100%;border-collapse:collapse;margin-top:16px">
<tr><td style="padding:10px 12px;background:#F8F9FA;font-weight:600;width:100px;border-bottom:1px solid #E5E8EB">&#45812;&#45817;&#51088;</td><td style="padding:10px 12px;border-bottom:1px solid #E5E8EB">${n}</td></tr>
<tr><td style="padding:10px 12px;background:#F8F9FA;font-weight:600;border-bottom:1px solid #E5E8EB">&#51060;&#47700;&#51068;</td><td style="padding:10px 12px;border-bottom:1px solid #E5E8EB"><a href="mailto:${email}">${email}</a></td></tr>
<tr><td style="padding:10px 12px;background:#F8F9FA;font-weight:600;border-bottom:1px solid #E5E8EB">&#50672;&#46973;&#52376;</td><td style="padding:10px 12px;border-bottom:1px solid #E5E8EB">${c}</td></tr>
${co ? `<tr><td style="padding:10px 12px;background:#F8F9FA;font-weight:600;border-bottom:1px solid #E5E8EB">&#54924;&#49324;&#47749;</td><td style="padding:10px 12px;border-bottom:1px solid #E5E8EB">${co}</td></tr>` : ''}
</table>
<div style="margin-top:20px;padding:16px;background:#F8F9FA;border-radius:8px">
<p style="font-weight:600;color:#191F28;margin-bottom:8px">&#47928;&#51032; &#45236;&#50857;</p>
<p style="color:#4E5968;line-height:1.7;white-space:pre-wrap">${ct}</p>
</div>
<p style="margin-top:24px;font-size:12px;color:#8B95A1">safed.co.kr &#47928;&#51032; &#54268;&#50640;&#49436; &#48156;&#49569;&#46108; &#47700;&#51068;&#51077;&#45768;&#45796;.</p>
</div></body></html>`;

  const mailOptions = {
    from: { name: 'SafeD', address: process.env.EMAIL_USER },
    to: 'sales@safed.co.kr, safesol@safed.co.kr',
    replyTo: email,
    subject: subjectB64,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
