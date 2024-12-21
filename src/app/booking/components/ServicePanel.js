import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import service1 from "../../../../public/service1.jpg";
import enhance from "../../../../public/enhance.png";
import taking from "../../../../public/taking.png";
import waxingmain from "../../../../public/waxingmain.png";
import ServiceCategoryPanel from "./ServiceCategoryPanel";

const ServicePanel = ({ selectedService, setSelectedService }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(null); // Dữ liệu lọc
  const [data, setData] = useState(null); // Dữ liệu gốc

  const panel1 = useRef(null);
  const panel2 = useRef(null);
  const panel3 = useRef(null);
  const panel4 = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/list-services/");
      const result = response.data.services;

      const formattedData = {
        natural: result.filter((service) => service.service_category === "natural"),
        enhance: result.filter((service) => service.service_category === "enhance"),
        takingOff: result.filter((service) => service.service_category === "takingOff"),
        waxing: result.filter((service) => service.service_category === "waxing"),
      };

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  // Hàm lọc dịch vụ theo query
  const filterServices = (query) => {
    if (!data) return;

    const lowerCaseQuery = query.toLowerCase();

    const filtered = {
      natural: data.natural.filter((service) =>
        service.service_title.toLowerCase().includes(lowerCaseQuery)
      ),
      enhance: data.enhance.filter((service) =>
        service.service_title.toLowerCase().includes(lowerCaseQuery)
      ),
      takingOff: data.takingOff.filter((service) =>
        service.service_title.toLowerCase().includes(lowerCaseQuery)
      ),
      waxing: data.waxing.filter((service) =>
        service.service_title.toLowerCase().includes(lowerCaseQuery)
      ),
    };

    setFilteredData(filtered); 
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // Lọc dịch vụ mỗi khi searchQuery thay đổi
  useEffect(() => {
    if (data) {  // Đảm bảo dữ liệu đã có trước khi lọc
      filterServices(searchQuery);
    }
  }, [searchQuery, data]);

  return (
    <div className="w-full custom-sm:w-3/4 px-8 custom-sm:px-16 lg:px-32 mt-6 custom-sm:mt-10">
      <InputIcon className="pi pi-search" />
      <InputText
        className={"w-full"}
        placeholder="What service are you looking for?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      {filteredData && (
        <>
          <div className={"my-2"}>
            <ServiceCategoryPanel
              panelRef={panel1}
              imageSrc={service1}
              headerTitle="Natural Nails"
              services={filteredData.natural}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
          <div className={"my-2"}>
            <ServiceCategoryPanel
              panelRef={panel2}
              imageSrc={enhance}
              headerTitle="Nail Extension / Enhancement"
              services={filteredData.enhance}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
          <div className={"my-2"}>
            <ServiceCategoryPanel
              panelRef={panel3}
              imageSrc={taking}
              headerTitle="Gel/Dip/Acrylic Taking Off"
              services={filteredData.takingOff}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
          <div className={"my-2"}>
            <ServiceCategoryPanel
              panelRef={panel4}
              imageSrc={waxingmain}
              headerTitle="Waxing"
              services={filteredData.waxing}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ServicePanel;
