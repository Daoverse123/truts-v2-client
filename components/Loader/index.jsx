import loader from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={loader.loader}>
      <img src="/loading.gif" alt="" />
    </div>
  );
};

export default Loader;
