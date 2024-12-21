import React from "react";
import Image from "next/image";
import staff1 from "@/../public/staff1.png";

function StaffBlock({
  title = "Title1",
  image = staff1,
  subtitle = "subtitle1",
  star = 4,
  id = "1",
  selectedStaff = "1",
  setSelectedStaff = () => {},
}) {
  const isSelectedStaff = id === selectedStaff;

  return (
    <div
      onClick={() => setSelectedStaff(id)}
      className={`${
        isSelectedStaff ? "border-2 border-[#C9B081]" : ""
      } relative shadow-lg rounded-xl overflow-hidden pb-2 cursor-pointer hover:scale-110 transform transition-transform duration-300`}
    >
      <div className={"w-full h-2/3 bg-red-300"}>
        <Image
          className={"w-full h-full object-cover"}
          src={image}
          alt={"staff"}
        />
      </div>
      <div className={"w-full flex flex-col justify-center items-center"}>
        <p className={"text-lg font-semibold text-center mt-4"}>{title}</p>
        <p className={"text-[#D9D9D9] text-center font-bold"}>
          {subtitle}
        </p>{" "}
      </div>
      <div
        className={
          "absolute bottom-4 w-full flex gap-1 justify-center items-center"
        }
      >
        {Array.from({ length: star }).map((_, i) => (
          <svg
            key={i}
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.5371 0L16.0027 8.22225L24.5121 9.18015L18.1409 15.1844L19.9034 23.984L12.5006 19.4723L5.08055 23.9533L6.8763 15.1605L0.528076 9.13012L9.04052 8.20767L12.5371 0Z"
              fill="#FFB400"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default StaffBlock;
