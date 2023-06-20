import React from "react";

function NewHero() {
  return (
    <div className="flex flex-col w-full h-max  bg-hero-bg items-center bg-cover">
      <h1
        className={
          "font-[600] text-[72px] mt-[225px] max-lg:mt-[149px] m-0 mb-[14px] max-lg:text-[32px] max-lg:w-[70%] text-center"
        }
      >
        Engage with<span className={"grad-text"}>Missions</span>
      </h1>
      <p
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
          className={"w-[90%] object-contain max-sm:hidden"}
          src="/hero_screen.png"
          alt=""
        />
        <img
          className={"w-[70%] object-contain hidden max-sm:block"}
          src="/hero_screen_mobile.png"
          alt=""
        />
      </span>
    </div>
  );
}

export default NewHero;
