import Image from "next/image";
import { Icon } from "@iconify/react";

const Footer = ({ mode }) => {
    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <footer
            className={`${
                mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-[#231812] border-[#231812]"
            } border-b shadow-lg mt-20 py-4 md:py-6 px-4 md:px-10 flex flex-col items-center sticky top-0 z-50`}
            style={{
                backgroundImage: 'url(/assets/images/footer-pattern.png)',
                backgroundPosition: 'left',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '50px 100%'  // Adjust width to make it slimmer
            }}
        >
            <div className="flex justify-between items-center text-white px-24 w-full">
                {/* Navigation and Content */}
                <div>
                    <div className="flex flex-col md:flex-row space-2 text-lg">
                        <a
                            target="_blank"
                            href="https://growthpad.co.ke"
                            className="transform transition duration-300 hover:translate-y-[-4px]"
                        >
                            Home |
                        </a>
                        <a
                            target="_blank"
                            href="https://growthpad.co.ke/gdc-trainings/"
                            className="transform transition duration-300 hover:translate-y-[-4px]"
                        >
                            Trainings |
                        </a>
                        <a
                            target="_blank"
                            href="https://growthpad.co.ke"
                            className="transform transition duration-300 hover:translate-y-[-4px]"
                        >
                            Careers |
                        </a>
                        <a
                            target="_blank"
                            href="https://growthpad.co.ke"
                            className="transform transition duration-300 hover:translate-y-[-4px]"
                        >
                            Insights |
                        </a>
                        <a
                            target="_blank"
                            href="https://growthpad.co.ke/tenders"
                            className="relative transform transition duration-300 hover:translate-y-[-4px]"
                        >
                            Tenders
                            <sup className="relative md:absolute -top-3 -right-3 bg-[#F05D23] text-white text-xs px-2 rounded">
                                New
                            </sup>
                        </a>
                    </div>


                    <span className="text-base mt-6 mb-4">
                        7th Floor, Mitsumi Business Park,<br/>
                        Westlands – Nairobi, Kenya <br/>
                        P.O. Box 1093-00606
                    </span>

                    <div className="flex space-x-4 sm:space-x-6">
                        {/* Social Icons */}
                        <a
                            href="https://x.com/growthpadEA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="fa6-brands:square-x-twitter" width={30} height={30} className="text-gray-300"/>
                        </a>

                        <a
                            href="https://www.youtube.com/channel/UCDGqgoqam13s-e8BAw5xkCQ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:youtube" width={30} height={30} className="text-gray-300"/>
                        </a>

                        <a
                            href="https://ke.linkedin.com/company/growthpad-consulting"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:linkedin" width={30} height={30} className="text-gray-300"/>
                        </a>

                        <a
                            href="https://www.facebook.com/growthpadconsulting/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:facebook" width={30} height={30} className="text-gray-300"/>
                        </a>
                    </div>
                </div>

                <div className="hidden md:block relative -top-20 right-0 bottom-0">
                    <Image
                        src="/assets/images/footer-image.png"
                        alt="Growthpad Logo"
                        width={500}
                        height={40}
                    />
                </div>
            </div>

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

export default Footer;
