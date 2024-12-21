import React, { useState, useEffect } from 'react';

const steps = [
  { 'text': 'Services', type: 'service', 'final': false },
  { 'text': 'Inventory ( Optional )', type: 'inventory', 'final': false },
  { 'text': 'Staff', type: 'staff', 'final': false },
  { 'text': 'Time', type: 'time', 'final': false },
  { 'text': 'Infor', type: 'infor', 'final': false },
  { 'text': 'Complete', type: 'complete', 'final': true },
];

function BookingStep({ activeStep = 'service', setActiveStep }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); 
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setActiveStep2 = (value) => {
    if (value === 'complete' || activeStep === 'complete') return;
    setActiveStep(value);
  };

  return (
    <div className="flex flex-col custom-lg:flex-row custom-lg:gap-6 justify-center items-center p-4">
      {steps.map((step, index) => (
        <div
          key={index}
          onClick={() => setActiveStep2(step.type)}
          className="cursor-pointer flex flex-col custom-lg:flex-row gap-2 justify-center items-center sm:items-center"
        >
          <div
            className={`${
              step.type === activeStep ? 'bg-[#766E69] text-white' : 'bg-[#BDBDBD] text-white'
            } w-6 h-6 sm:w-8 sm:h-8 rounded-full flex justify-center items-center`}
          >
            {index + 1}
          </div>

          <div
            className={`${
              step.type === activeStep ? 'text-[#766E69]' : 'text-[#BDBDBD]'
            } font-semibold text-base sm:text-xl`}
          >
            {step.text}
          </div>

          {!step.final && (
            <svg
              width="30"
              height="32"
              viewBox="0 0 45 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                step.type === activeStep ? 'text-[#766E69]' : 'text-[#BDBDBD]'
              } sm:w-5 sm:h-5 w-4 h-4 mt-2 sm:mt-0 sm:ml-2 transform ${
                windowWidth < 1100 ? 'rotate-90' : ''
              }`}
            >
              <path
                d="M34.4166 30.3541L40.8333 23.4999L34.4166 16.6458L33.1205 18.0303L37.3243 22.5208H4.16663V24.4791H37.3243L33.1205 28.9695L34.4166 30.3541Z"
                fill={`${step.type === activeStep ? '#766E69' : '#BDBDBD'}`}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default BookingStep;
