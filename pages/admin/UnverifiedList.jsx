import styles from "./admin.module.scss";
import { useAdminStore } from "./index";

const UnverifiedList = ({ list }) => {
  let setSelected = useAdminStore((s) => s.setSelected);
  return (
    <div className={styles.unverifiedList}>
      <h1>Unverified Communities</h1>
      <ul>
        {list.map((ele) => {
          return (
            <li
              key={ele._id}
              onClick={() => {
                setSelected(ele._id);
              }}
            >
              <p>{ele.name}</p>
              <p>slug : {ele.slug}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UnverifiedList;
