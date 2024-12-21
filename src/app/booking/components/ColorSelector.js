import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Color from './Color';

const colorCodes = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD",
    "#E74C3C", "#3498DB", "#1ABC9C", "#2ECC71", "#9B59B6",
    "#FF69B4", "#FFD700", "#7FFF00", "#808080", "#00CED1",
    "#4682B4", "#FF8C00", "#ADFF2F", "#B22222", "#D2691E",
    "#4B0082", "#FF1493", "#00BFFF", "#32CD32", "#FFDAB9",
    "#FF6347", "#00FA9A", "#C71585", "#FFFACD", "#FF7F50",
    "#8A2BE2", "#7CFC00", "#DDA0DD", "#FFB6C1", "#5F9EA0",
    "#00FF7F", "#F08080", "#20B2AA", "#BA55D3", "#FF4500",
    "#6495ED", "#000000", "#E0FFFF", "#FFE4E1", "#7B68EE",
    "#FFEBCD", "#98FB98", "#FFD700", "#CD5C5C", "#FFE4B5"
];

export default function ColorSelector({ selectedColor, onColorSelect }) {
    const [activeColor, setActiveColor] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const colorsPerView = 15;

    const nextColors = () => {
        setStartIndex((prev) => Math.min(prev + colorsPerView, colorCodes.length - colorsPerView));
    };

    const prevColors = () => {
        setStartIndex((prev) => Math.max(prev - colorsPerView, 0));
    };

    const displayedColors = colorCodes.slice(startIndex, startIndex + colorsPerView);

    const handleColorClick = (color) => {
        setActiveColor((prevColor) => {
            const newColor = prevColor === color ? null : color;
            onColorSelect(newColor); // Trigger the onColorSelect callback
            return newColor;
        });
    };

    // Group colors into arrays of five
    const colorGroups = [];
    for (let i = 0; i < displayedColors.length; i += 5) {
        colorGroups.push(displayedColors.slice(i, i + 5));
    }

    return (
        <div className="flex flex-wrap justify-center">
            <button onClick={prevColors} disabled={startIndex === 0} className="p-2 disabled:text-gray-400 rounded-l flex items-center">
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {colorGroups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className="bg-white p-4 m-2 rounded shadow-md flex justify-center"
                    style={{ width: 'fit-content' }}
                >
                    {group.map((color, index) => (
                        <Color
                            key={index}
                            color={color}
                            isActive={selectedColor === color}
                            onClick={() => handleColorClick(color)}
                        />
                    ))}
                </div>
            ))}
            <button onClick={nextColors} disabled={startIndex >= colorCodes.length - colorsPerView} className="p-2 disabled:text-gray-400 rounded-r flex items-center">
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
}
