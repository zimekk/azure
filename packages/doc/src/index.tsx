import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import StyleContext from "isomorphic-style-loader/StyleContext";

// https://dev.to/zeka/generate-a-pdf-in-aws-lambda-with-nodejs-webpack-pug-and-puppeteer-4g59
// https://github.com/kriasoft/isomorphic-style-loader
export default async (params, query) => {
  const css = new Set() as any; // CSS for all rendered React components
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));

  const { name = "report.pdf" } = params;

  const App = {
    "report.pdf": require("./Report").default,
  }[name];

  const body = renderToStaticMarkup(
    <StyleContext.Provider value={{ insertCss }}>
      <App query={query} />
    </StyleContext.Provider>
  );

  // https://benborgers.com/posts/node-minify-css
  // const style = await require("postcss")([require("cssnano")]).process(
  //   [...css].join("")
  // );
  const style = [...css].join("");

  return `<!doctype html>
    <html>
      <head>
        <style>${style}</style>
      </head>
      <body>
        <div id="root">${body}</div>
      </body>
    </html>`;
};
