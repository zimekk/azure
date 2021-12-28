import React from "react";
import { hot } from "react-hot-loader/root";
import styles from "./App.module.scss";

function App() {
  const data = "a,b,c\n1,2,3".split("\n").map((x) => x.split(","));

  return (
    <section className={styles.App}>
      <h1 className={styles.Nav}>Reports</h1>
      <nav>
        <ul>
          <li>
            <a
              href={`spread/sheet.xlsx?data=${encodeURIComponent(
                JSON.stringify(data)
              )}`}
            >
              spread/sheet.xlsx?data=
            </a>
          </li>
          <li>
            <a
              href={`print/report.pdf?data=${encodeURIComponent(
                JSON.stringify(data)
              )}`}
            >
              print/report.pdf?data=
            </a>
          </li>
          <li>
            <a
              href={`mail?subject=${encodeURIComponent(
                "Subject"
              )}&message=${encodeURIComponent("Message")}`}
            >
              mail?subject=Subject&amp;message=Message
            </a>
          </li>
          <li>
            <a href={`api`}>api</a>
          </li>
          <li>
            <a href={`api/profile`}>api/profile</a>
          </li>
          <li>
            <a href={`api/secure`}>api/secure</a>
          </li>
          <li>
            <a href={`api/auth`}>api/auth</a>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default hot(App);
