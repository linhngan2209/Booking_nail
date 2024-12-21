import React, { useState } from "react";
import { Panel } from "primereact/panel";
import Image from "next/image";

const ServiceCategoryPanel = ({
  panelRef,
  imageSrc,
  headerTitle,
  services,
  selectedService,
  setSelectedService,
}) => {
  const [isRotated, setIsRotated] = useState(false);
  const handleToggle = () => {
    setIsRotated(!isRotated); 
    panelRef.current.toggle(); 
  };

  return (
    <Panel
      headerTemplate={
        <div
          onClick={handleToggle}
          className="rounded-t-lg cursor-pointer h-fit flex gap-4 pl-4 py-2 bg-white border items-center justify-center shadow-lg rounded-lg"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={headerTitle}
              width={48}
              height={50}
              className={"h-full w-full object-cover"}
            />
          </div>
          <div className="flex-grow">
            <p className="text-[#C9B081] font-semibold">{headerTitle}</p>
          </div>
          <div className="w-1/6">
            <svg
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform duration-300 ${isRotated ? "" : "rotate-180"}`}
            >
              <path
                d="M22.75 9.81494L14 18.5649L5.25 9.81494"
                stroke="black"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      }
      ref={panelRef}
      toggleable
      className="shadow-lg rounded-lg"
    >
      <div className="flex flex-col">
        {services.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedService([item?.id,item?.service_title,item?.service_price])}
            className={`${
              item.id === selectedService[0] ? "bg-gray-100" : ""
            } flex gap-3 items-center cursor-pointer rounded-xl py-2 px-2`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                className="h-full w-full object-cover"
                src={item.service_image}
                alt={item.service_title}
                width={48}
                height={50}
              />
            </div>
            <div>
              <p>{item.service_title}</p>
              <p className="text-[#C9B081]">{item.service_price}$</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ServiceCategoryPanel;
