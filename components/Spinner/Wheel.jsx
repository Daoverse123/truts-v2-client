import styles from "./spinner.module.scss";
import DotWheel from "./DotWheel";

let colors = [];

for (let i = 0; i < 8; i++) {
  if (i % 2 == 0) {
    colors.push(`#ffffff`);
  } else {
    colors.push(`#3065F3`);
  }
}

const Wheel = ({ wheelData }) => {
  return (
    <>
      <DotWheel wheelData={wheelData} />
      <span
        style={{
          display: "flex",
          width: `${92}%`,
          height: `${92}%`,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "100%",
          zIndex: 1,
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
        >
          <div className={styles.flower}>
            {wheelData.map((w, i) => {
              return (
                <div
                  key={"petal" + i}
                  id={"s" + w.slot}
                  style={{
                    rotate: `${(360 / colors.length) * i}deg`,
                    color: `${i % 2 == 0 ? "#3065F3" : "#ffffff"}`,
                  }}
                  className={styles.petal}
                >
                  <div
                    style={
                      i < colors.length / 2
                        ? {
                            // transform: `rotate(90deg) translateX(${
                            //   100 + 22
                            // }%) scale(-1, -1)`,
                          }
                        : {}
                    }
                    className={styles.icon}
                  >
                    {w.reward.name.toString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </span>
    </>
  );
};
export default Wheel;
