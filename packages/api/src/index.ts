import { Router, json } from "express";
import fetch from "node-fetch";
import * as msal from "@azure/msal-node";

const {
  API_KEY,
  API_URL,
  AZURE_APP_ID,
  AZURE_AUTHORITY,
  AZURE_CLIENT_SECRET,
  REDIRECT_URI,
} = process.env;

const config = {
  auth: {
    clientId: AZURE_APP_ID, // Enter_the_Application_Id
    authority: AZURE_AUTHORITY, // Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Id_here
    clientSecret: AZURE_CLIENT_SECRET, // Enter_the_Client_secret
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

export default () =>
  Router()
    .use(json())
    .get("/", (req, res) => res.json({ hello: "Hello" }))
    .get("/auth", (req, res) => {
      const tokenRequest = {
        code: req.query.code as string,
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
      };

      cca
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
          console.log("\nResponse: \n:", response);
          res.sendStatus(200);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send(error);
        });
    })
    .get("/secure", (req, res) => {
      const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
      };

      // get url to sign user in and consent to scopes needed for application
      cca
        .getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
          res.redirect(response);
        })
        .catch((error) => console.log(JSON.stringify(error)));
    })
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
