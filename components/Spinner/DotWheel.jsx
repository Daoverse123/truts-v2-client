import styles from "./spinner.module.scss";

let colors = [];

for (let i = 0; i < 8; i++) {
  if (i % 2 == 0) {
    colors.push(`#ffffff`);
  } else {
    colors.push(`#3065F3`);
  }
}

const DotWheel = ({ wheelData }) => {
  return (
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
        position: "absolute",
      }}
    >
      <div
        style={{
          width: `${100}%`,
          height: `${100}%`,
        }}
        className={styles.inner}
      >
        <div
          style={{
            transform: "rotate(26deg)",
          }}
          className={styles.flower}
        >
          {wheelData.map((color, i) => {
            return (
              <div
                key={"dot" + i}
                style={{
                  rotate: `${(360 / colors.length) * i}deg`,
                  color: `red`,
                }}
                className={styles.dot}
              >
                <div class={styles.icon}></div>
              </div>
            );
          })}
        </div>
      </div>
    </span>
  );
};

export default DotWheel;
