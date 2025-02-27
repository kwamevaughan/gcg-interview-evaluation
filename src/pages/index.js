import Link from "next/link";
import Image from "next/image";
import { Icon } from '@iconify/react';

export default function LandingPage() {
    return (
        <>
            <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6">
                {/* YouTube Background Video */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <iframe
                        className="w-full h-full object-cover"
                        src="https://www.youtube.com/embed/dKazJ1yr-I0?autoplay=1&loop=1&playlist=dKazJ1yr-I0&controls=0&mute=1&showinfo=0&rel=0&modestbranding=1&fs=0"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        title="Background Video"
                    />
                    {/* Dark Gradient Overlay with increased opacity */}
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent opacity-90 z-1"></div>
                </div>

                <div
                    className="relative max-w-full sm:max-w-3xl mx-auto p-6 sm:p-10 text-center bg-white bg-opacity-90 backdrop-blur-lg shadow-full rounded-lg z-10">
                    <Image
                        src="/assets/images/gcg-arrows-black.png"
                        alt="Growthpad Consulting Group Logo"
                        width={150}
                        height={200}
                        className="hidden md:block absolute top-0 right-0 p-4 z-10"
                    />

                    {/* Logo with link to the website */}
                    <div className="mb-6">
                        <a target="_blank"
                           rel="noopener noreferrer" href="https://growthpad.co.ke">
                            <Image
                                src="/assets/images/logo.svg"
                                alt="Growthpad Consulting Group Logo"
                                width={200}
                                height={200}
                                className="mx-auto transform transition duration-300 hover:scale-110"
                            />
                        </a>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-[#231812] mb-4">
                        Welcome to Careers at Growthpad
                    </h1>

                    {/* About Text */}
                    <p className="text-[#231812] mb-4 text-base ">
                        We are a Nairobi Headquartered – cross-Africa communication, technology, and digital services firm that blends strategy, creativity, and technology to bring powerful results for organizations in the African market.
                    </p>

                    <hr className="h-px my-8 bg-[#F05D23] border-0 dark:bg-gray-700"/>

                    {/* Description */}
                    <p className="text-[#231812] mb-8 text-base ">
                        Take the first step toward joining our team. Complete our standard interview questionnaire to
                        showcase your skills and experience. Click "Get Started" to begin the process!
                    </p>

                    {/* Buttons Container with Flexbox and gap */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto">
                        {/* Call to Action: Get Started Button */}
                        <Link href="/interview">
                            <button
                                className="flex items-center px-6 py-3 bg-[#ff5d38] text-white font-semibold rounded-lg shadow-lg hover:bg-[#d94f1e] hover:shadow-xl transition transform duration-300 hover:scale-105 w-full sm:w-auto">
                                <Icon icon="mdi:check-circle" width={20} height={20} className="mr-2"/>
                                Get Started
                            </button>
                        </Link>

                        {/* New "Visit Our Website" Button */}
                        <a
                            href="https://growthpad.co.ke"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="flex items-center px-6 py-3 bg-white text-[#231812] font-semibold rounded-lg shadow-lg border border-[#fff8f7] hover:shadow-xl hover:bg-[#f4f4f4] transition transform duration-300 hover:scale-105 w-full sm:w-auto">
                                <Icon icon="mdi:open-in-new" width={20} height={20} className="mr-2"/>
                                Visit Our Website
                            </button>
                        </a>
                    </div>
                    <Image
                        src="/assets/images/gcg-arrows-black.png"
                        alt="Growthpad Consulting Group Logo"
                        width={150}
                        height={200}
                        className="hidden md:block absolute bottom-0 left-0 p-4 z-10"
                    />
                </div>

                {/* Social Media Icons using Iconify */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex space-x-4 sm:space-x-6">
                        {/* X.com (formerly Twitter) Icon */}
                        <a
                            href="https://x.com/growthpadEA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="fa6-brands:square-x-twitter" width={30} height={30} className="text-black"/>
                        </a>

                        {/* YouTube Icon */}
                        <a
                            href="https://www.youtube.com/channel/UCDGqgoqam13s-e8BAw5xkCQ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:youtube" width={30} height={30} className="text-[#FF0000]"/>
                        </a>

                        {/* LinkedIn Icon */}
                        <a
                            href="https://ke.linkedin.com/company/growthpad-consulting"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:linkedin" width={30} height={30} className="text-[#0077B5]"/>
                        </a>

                        {/* Facebook Icon */}
                        <a
                            href="https://www.facebook.com/growthpadconsulting/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform transition duration-300 hover:-translate-y-2"
                        >
                            <Icon icon="mdi:facebook" width={30} height={30} className="text-[#4267B2]"/>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
