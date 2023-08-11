import React, { useState } from "react";
import styles from "./tweet.module.scss";
import Nav from "../../components/Nav";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

function Tweet() {
  const [link, setlink] = useState("");

  const submitForm = async () => {
    let search = location.search.split("&");

    let missionID = search[0].split("=")[1];
    let taskID = search[1].split("=")[1];

    console.log({ missionID, taskID });
    if (link.length < 1) {
      return toast.error("Please Enter your Tweet link", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    try {
      let res = await axios.post(
        `${process.env.P_API}/mission/${missionID}/task-form-submission/${taskID}`,
        {
          formData: {
            link: link,
          },
        }
      );
      if (res.status == 201) {
        toast.success("Link Submitted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return (location.href = `/mission/${missionID}`);
      }
    } catch (er) {
      if (er.response.status == 409) {
        return toast.error("Link Already Submitted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <>
      <Nav />
      <div
        className={
          "flex w-full h-screen justify-center items-center" +
          " " +
          styles.pattern
        }
      >
        <div className="flex flex-col w-[500px] g-white h-auto shadow-2xl rounded-2xl bg-white px-9 py-10 max-[516px]:w-[90%] max-[516px]:px-5 max-[516px]:py-6">
          <label className="w-[100%]" htmlFor="">
            <p className="text-[18px] text-gray-700 max-[516px]:text-[14px] mt-0">
              Enter your Tweet link
            </p>
            <input
              value={link}
              onChange={(e) => {
                setlink(e.target.value);
              }}
              className="w-[100%] text-[16px] max-[516px]:text-[14px]  border border-[#80808032] outline-none bg-transparent rounded-lg p-3"
              type="text"
            />
          </label>
          <button
            onClick={() => {
              submitForm();
            }}
            className={
              "h-12 text-white border-none rounded-lg text-[16px] mt-6 max-[516px]:mt-4 max-[516px]:text-[14px] max-[516px]:h-10" +
              " " +
              styles.grad
            }
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Tweet;
