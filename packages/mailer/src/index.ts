// https://github.com/nodemailer/nodemailer/blob/master/examples/full.js
import { createTransport } from "nodemailer";

const { MAIL_FROM, MAIL_TO, SMTP_URL } = process.env;

export default ({ subject, message: text }) =>
  new Promise((resolve, reject) =>
    createTransport(SMTP_URL, {
      from: MAIL_FROM,
    }).sendMail(
      {
        to: MAIL_TO,
        subject,
        text,
      },
      (error, info) => (error ? reject(error) : resolve(info))
    )
  );
