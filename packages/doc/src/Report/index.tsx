import React from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import styles from "./styles.module.scss";

function Report(query) {
  return (
    <div className={styles.Report}>
      <h1>Print</h1>
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
}

export default withStyles(styles)(Report);
