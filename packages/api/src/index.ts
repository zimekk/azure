import { Router, json } from "express";
import fetch from "node-fetch";

const { API_KEY, API_URL } = process.env;

export default () =>
  Router()
    .use(json())
    .get("/", (req, res) => res.json({ hello: "Hello" }))
    .get("/profile", (req, res) =>
      fetch(`${API_URL}profile`, {
        headers: {
          Authorization: `APIKey ${API_KEY}`,
          // 'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((data) => res.send(data))
    );
