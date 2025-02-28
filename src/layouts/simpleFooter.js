import Image from "next/image";
import { Icon } from "@iconify/react";

const simpleFooter = ({ mode }) => {
    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <footer
            className={`${
                mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-[#231812] border-[#231812]"
            } border-b shadow-lg py-4 md:py-6 px-4  flex flex-col items-center sticky top-0 z-50`}
        >
            {/* New section with two columns */}
            <div className="flex w-full justify-between items-center px-24 mt-4 text-white">
                <div className="flex flex-col">
                    <span className="text-base">
                        © {currentYear} Growthpad Consulting Group. Made with ♡ in
                        <span className="relative group">
                            <span className="cursor-default">Nairobi</span>
                            {/* Nairobi Flag */}
                            <div
                                className="absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100">
                                <Image
                                    src="/assets/images/kenya.gif"
                                    alt="Nairobi Flag"
                                    width={30}
                                    height={30}
                                    className="absolute top-0 left-0"
                                />
                            </div>
                        </span>{" "}
                        x{" "}
                        <span className="relative group">
                            <span className="cursor-default">Accra</span>
                            {/* Accra Flag */}
                            <div className="absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100">
                                <Image
                                    src="/assets/images/ghana.gif"
                                    alt="Accra Flag"
                                    width={30}
                                    height={30}
                                    className="absolute top-0 left-0"
                                />
                            </div>
                        </span>
                    </span>
                </div>

                <div className="hidden md:flex flex-col items-end">
                    <a href="https://growthpad.co.ke" target="_blank">
                        <Image
                            src={mode === "dark" ? "/assets/images/logo-tagline-white.svg" : "/assets/images/logo-tagline-white-orange.svg"}
                            alt="Growthpad Logo"
                            width={300}
                            height={40}
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default simpleFooter;