import { Router, json } from "express";
import mailer from "@dev/mailer";

export default () =>
  Router()
    .use(json())
    .get("/mail", async function (req, res) {
      const { subject, message } = req.query;
      await mailer({
        subject,
        message,
      });
      res.send({ status: "ok" });
    });
