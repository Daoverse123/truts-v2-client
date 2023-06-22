import React from "react";
import styles from "./spinner.module.scss";

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "pink",
];

function Spinner() {
  let SIZE = 350;

  return (
    <div className={styles.spinner}>
      <div
        style={{
          display: "flex",
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          minWidth: `${SIZE}px`,
          minHeight: `${SIZE}px`,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(90deg, #5E1ED1 0%, #3065F3 100%)",
        }}
        className={styles.wheel}
      >
        <span
          style={{
            display: "flex",
            width: `${92}%`,
            height: `${92}%`,
            alignItems: "center",
            justifyContent: "center",
            background: "#D6E0FD",
            overflow: "hidden",
            borderRadius: "100%",
          }}
        >
          <div
            style={{
              width: `${83}%`,
              height: `${83}%`,
              backgroundImage: `conic-gradient(
                
                ${colors
                  .map((color, i) => {
                    return `${color} 0 ${(1 / colors.length) * (i + 1) * 100}%`;
                  })
                  .join(", ")}
            )`,
            }}
            className={styles.inner}
          ></div>
        </span>
      </div>
    </div>
  );
}

export default Spinner;
