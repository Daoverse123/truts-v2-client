import React, { useState } from "react";
import styles from "./tooltip.module.scss";

const Tooltip = ({ init, post, children, copyLink, bottom }) => {
  const [clicked, setclicked] = useState(false);

  return (
    <div
      onMouseLeave={() => {
        setclicked(false);
      }}
      className={styles.customToolTip}
      onClick={() => {
        setclicked(true);
        navigator.clipboard.writeText(copyLink);
      }}
    >
      <div
        style={
          clicked ? { background: "rgba(68, 172, 33, 1)", color: "white" } : {}
        }
        className={styles.content + " " + (bottom ? styles.bottom : {})}
      >
        {clicked ? post : init}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
