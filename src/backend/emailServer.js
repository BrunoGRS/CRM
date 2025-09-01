import nodemailer from "nodemailer";
import dotenv from "dotenv";

const email = process.env.EMAIL;
const appPassword = process.env.APP_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: appPassword,
  },
});

export async function enviarEmail(destinatario, assunto, texto) {
  await transporter.sendMail({
    from: '"IxMed" <rodriguesbrunor01@gmail.com>',
    to: destinatario,
    subject: assunto,
    text: texto,
    // html: "<b>Opcional: HTML aqui</b>"
  });
}
