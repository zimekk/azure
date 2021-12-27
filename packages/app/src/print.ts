import { Router, json } from "express";
import puppeteer from "puppeteer";
import renderHtml from "@dev/doc";
import xlsx from "xlsx";

// https://dev.to/zeka/generate-a-pdf-in-aws-lambda-with-nodejs-webpack-pug-and-puppeteer-4g59
export default () =>
  Router()
    .use(json())
    .get("/spread/:name", async function (req, res) {
      // https://github.com/SheetJS/sheetjs/blob/master/demos/server/express.js
      const { name } = req.params;
      const { data } = req.query;
      const ws = xlsx.utils.aoa_to_sheet(JSON.parse(data));
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet");
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${name}";`,
      });
      res.end(xlsx.write(wb, { type: "buffer" }));
    })
    .get("/print/:name", async function (req, res) {
      // https://github.com/puppeteer/puppeteer#usage
      const browser = await puppeteer.launch({
        // headless: true,
        // args: ['--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      const html = await renderHtml(req.params, req.query);

      // https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/
      await page.setContent(html);

      const pdf = await page.pdf({
        format: "a4",
        // printBackground: true,
        margin: {
          top: "0.5cm",
          right: "0.5cm",
          bottom: "0.5cm",
          left: "0.5cm",
        },
      });

      await browser.close();

      // https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      });
      res.send(pdf);
    });
