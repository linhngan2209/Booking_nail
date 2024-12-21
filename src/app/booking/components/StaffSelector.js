import React from "react";
import StaffBlock from "@/components/StaffBlock";

const StaffSelector = ({ staffData, selectedStaff, setSelectedStaff }) => (
  <div className="w-full sm:w-11/12 px-8 sm:px-16 lg:px-32 mt-6 sm:mt-10">
    <div className="grid grid-cols-1 custom-sm-v1:grid-cols-2 custom-md:grid-cols-3 gap-6 sm:gap-8">
      {staffData?.map((item) => (
        <StaffBlock
          key={item.id}
          image={item?.staff_image}
          title={item?.staff_name}
          id={item.id}
          star={item.stars}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          subtitle={item.subtitle}
        />
      ))}
    </div>
  </div>
);

export default StaffSelector;
