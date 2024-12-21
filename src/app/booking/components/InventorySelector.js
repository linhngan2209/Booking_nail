import React from "react";
import Image from "next/image";
import imageSrc from "../../../../public/svg/svg4.svg";
import ColorMenuBar from "./ColorMenuBar";

const InventorySelector = ({selectedColor,setSelectedColor}) => {
    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt="inventory image"
                        layout="intrinsic"
                    />
                </div>
            </div>

            <div className="my-10"></div>

            <div>
                <ColorMenuBar selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>
            </div>

            <div className="mt-10 px-5">
                <div className="flex justify-center">
                    <textarea
                        className="border-2 text-xl sm:text-2xl text-[#D8B192] border-[#D8B192] outline-none p-2 h-28 w-full md:w-[600px] rounded-2xl placeholder:text-[#D8B192] placeholder:text-lg sm:placeholder:text-2xl resize-none"
                        placeholder="Describe more about your favorite color. We will make you your best nail ever."
                        rows="4"
                    ></textarea>
                </div>
            </div>

            <div className="mt-5 flex justify-center">
                <button className="bg-[#D8B192] hover:opacity-80 cursor-pointer text-white text-base sm:text-lg py-2 px-4 sm:px-5 rounded-lg">
                    More required color
                </button>
            </div>

        </div>
    );
};

export default InventorySelector;
