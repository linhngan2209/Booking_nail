"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import bookingbanner from "../../../public/bookingbanner.png";
import Navigation from "@/components/Navigation";
import BookingStep from "@/components/BookingStep";
import svg1 from "@/../public/svg/svg1.svg";
import svg2 from "@/../public/svg/svg2.svg";
import svg3 from "@/../public/svg/svg3.svg";
import { staffData, dateData, timeData, data } from "./dataHelpers";
import ServicePanel from "./components/ServicePanel";
import StaffSelector from "./components/StaffSelector";
import TimeSelector from "./components/TimeSelector";
import InforPanel from "./components/InforPanel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InventorySelector from "./components/InventorySelector";
import Link from "next/link";
import axios from "axios";

function Page(props) {
  const [activeStep, setActiveStep] = useState("service");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [staffData, setstaffData] = useState()

  function formatDate(obj) {
    const monthMap = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    const formattedDate = `${obj.date < 10 ? '0' + obj.date : obj.date}/${monthMap[obj.month]}/${obj.year}`;
    return formattedDate;
  }

  const fetchApi = async () => {
    const res = await axios.get("http://localhost:8000/api/v1/list-staff")
    setstaffData(res?.data)
  }
  useEffect(() => {
    fetchApi();
  }, [])

  const submit = async () => {
    if (isEmpty(selectedService)) {
      toast.error("Select a Service");
      setActiveStep("service");
      return;
    }
    if (isEmpty(selectedStaff)) {
      toast.error("Select a Staff");
      setActiveStep("staff");
      return;
    }
    if (isEmpty(selectedDate) || isEmpty(selectedTime)) {
      toast.error("Select a time for appointment");
      setActiveStep("time");
      return;
    }

    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.warning("Please login!!!")
      setActiveStep("service");
      return;
    }
    const user = JSON.parse(userData);
    console.log(user.id);
    const booking = {
      customer_id: parseInt(user.id),
      staff: parseInt(selectedStaff, 10), 
      service: parseInt(selectedService[0], 10),
      description: selectedColor,
      total_bill: parseFloat(selectedService[2]),
      start: `${selectedTime} ${formatDate(selectedDate)}`
    }
    try {
      console.log(booking)
      const response = await axios.post(
        "http://localhost:8000/api/v1/create-booking-user/",
        booking,
      );
    } catch (error) {
      console.error("Error in booking submission:", error.response || error);
    }
    if (activeStep !== "infor") {
      setActiveStep("infor");
      return;
    }

    setActiveStep("complete");
    toast.success("Your Booking is sent!");
  };

  const isEmpty = (tmp) => {
    if (tmp == null) return true;
    if (tmp.length === 0) return true;
    return false;
  };
  return (
    <>
      <ToastContainer />
      <Navigation />
      <div>
        <Image src={bookingbanner} alt={"banner"} />
      </div>
      {activeStep != "complete" && (
        <div className={"mt-10"}>
          <BookingStep activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>
      )}

      <div className={"flex justify-center"}>
        <div className={"flex flex-col items-center w-full mt-12"}>
          {activeStep === "service" && (
            <div>
              <Image src={svg1} alt={"title"} />
            </div>
          )}
          {activeStep === "inventory" && (
            <div>
              <InventorySelector selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            </div>
          )}
          {activeStep === "staff" && (
            <div className="px-5">
              <Image src={svg2} alt={"title"} />
            </div>
          )}
          {activeStep === "service" && (
            <ServicePanel
              data={data}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          )}
          {activeStep === "staff" && (
            <StaffSelector
              staffData={staffData}
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
            />
          )}
          {activeStep === "time" && (
            <div className="flex justify-center w-full">
              <TimeSelector
                dateData={dateData}
                timeData={timeData}
                selectedDate={selectedDate}
                setSelectedTime={setSelectedTime}
                selectedTime={selectedTime}
                setSelectedDate={setSelectedDate}
              />
            </div>
          )}
          {activeStep === "infor" && (
            <InforPanel
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              selectedService={selectedService}
              selectedColor={selectedColor}
              submit={submit}
            />
          )}
          {activeStep === "complete" && (
            <div className={"w-full flex flex-col justify-center items-center"}>
              <div>
                <Image src={svg3} alt={"title"} />
              </div>
              <div className={"text-2xl font-bold mt-12 text-center"}>
                Your appointment was sent successfully!
              </div>
              <div className="mt-6">
                <Link href="/">
                  <button className="bg-[#D8B192] hover:opacity-80 cursor-pointer text-white text-lg py-2 px-6 rounded-lg">
                    Go to Homepage
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={"h-24"}></div>
    </>
  );
}

export default Page;
