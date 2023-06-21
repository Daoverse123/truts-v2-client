import React from "react";

function NewHero() {
  return (
    <div className="flex flex-col w-full h-max  bg-hero-bg items-center bg-cover">
      <h1
        style={{
          fontFamily: "Chillax-Semibold",
          fontWeight: "600",
        }}
        className={
          "font-[600] text-[72px] mt-[225px] max-lg:mt-[149px] m-0 mb-[14px] max-lg:text-[32px] max-lg:w-[70%] text-center"
        }
      >
        Engage with <span className={"grad-text"}>Missions</span>
      </h1>
      <p
        style={{
          fontFamily: "Chillax-Medium",
          fontWeight: "500",
        }}
        className={
          "font-[500] m-0 text-[24px] w-[800px] text-center max-lg:text-[16px] max-lg:w-[70%] "
        }
      >
        Contribute to your favourite communities, and earn exciting rewards
        along the way!
      </p>
      <button
        onClick={() => {
          openNewTab("/missons");
        }}
        className={
          "text-[16px] grad border-none px-[32px] py-[16px] rounded-lg text-white mt-[32px]"
        }
      >
        Explore Missions
      </button>

      <span className={"mt-[54px] mx-auto flex w-full justify-center"}>
        <img
          style={{
            background: "linear-gradient(90deg, #5E1ED1 0%, #3065F3 100%)",
          }}
          className={
            "w-[90%] object-contain max-sm:hidden p-2 pb-0 rounded-tl-[50px] rounded-tr-[50px]"
          }
          src="/hero.png"
          alt=""
        />
        <img
          style={{
            background: "linear-gradient(90deg, #5E1ED1 0%, #3065F3 100%)",
          }}
          className={
            "w-[70%] object-contain hidden max-sm:block p-[6px] pb-0 rounded-tl-[20px] rounded-tr-[20px]"
          }
          src="/hero-mobile.png"
          alt=""
        />
      </span>
    </div>
  );
}

export default NewHero;
