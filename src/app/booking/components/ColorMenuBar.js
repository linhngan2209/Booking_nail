import React, { useState } from 'react';
import ColorSelector from './ColorSelector';

const ColorMenuBar = ({ selectedColor, setSelectedColor }) => {
    const [activeTab, setActiveTab] = useState('predefined');


    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    return (
        <div>
            <div className="flex justify-center space-x-4 my-4">
                <button
                    className={`py-2 px-4 rounded ${activeTab === 'predefined' ? 'bg-[#D8B192] text-white' : 'bg-white text-black'}`}
                    onClick={() => setActiveTab('predefined')}
                >
                    Predefined Colors
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeTab === 'custom' ? 'bg-[#D8B192] text-white' : 'bg-white text-black'}`}
                    onClick={() => setActiveTab('custom')}
                >
                    Custom Color
                </button>
            </div>

            {activeTab === 'predefined' && <ColorSelector selectedColor={selectedColor} onColorSelect={handleColorChange} />}
            {activeTab === 'custom' && <CustomColorInput selectedColor={selectedColor} onColorChange={handleColorChange} />}
        </div>
    );
};

const CustomColorInput = ({ selectedColor, onColorChange }) => {
    const [colorCode, setColorCode] = useState(selectedColor);
    const [isValid, setIsValid] = useState(true);

    const validateColorCode = (code) => {
        // Regex for valid hex color codes
        const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
        return hexColorRegex.test(code);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setColorCode(value);
        setIsValid(validateColorCode(value));
        onColorChange(value);
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="text"
                value={colorCode}
                onChange={handleChange}
                className={`border-2 outline-none p-2 rounded-lg w-full md:w-[300px] ${isValid ? 'border-[#D8B192]' : 'border-red-500'}`}
                placeholder="Enter color code (e.g., #FF5733)"
            />

            <div
                className="mt-4 w-40 h-40 rounded-full shadow-xl"
                style={{ backgroundColor: isValid ? colorCode : '#ffffff' }}
            >
            </div>
            {!isValid && <span className="text-red-500 text-center align-middle mt-5">Color not found</span>}
        </div>
    );
};

export default ColorMenuBar;
