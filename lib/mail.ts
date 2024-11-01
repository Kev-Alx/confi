import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.NODEMAILER_ACCOUNT,
    pass: process.env.NODEMAILER_APP_KEY,
  },
  tls: {
    rejectUnauthorized: true,
  },
  connectionTimeout: 30000,
});

function sendMail(to: string, sub: string, msg: string) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
}
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.ORIGIN}/auth/new-password?token=${token}`;

  sendMail(
    email,
    "Reset your password",
    `<p>Click <a href="${confirmLink}">here</a> to reset password.</p>`
  );
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.ORIGIN}/auth/new-verification?token=${token}`;
  sendMail(
    email,
    "Confirm your email",
    `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  );
};

transporter.verify(function (error) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP connection successful");
  }
});
