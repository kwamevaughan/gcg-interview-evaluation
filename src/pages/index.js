// src/pages/index.js
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const JobDescriptionModal = dynamic(() => import("../components/JobDescriptionModal"), { ssr: false });

export default function LandingPage() {
    const [selectedOpening, setSelectedOpening] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openings, setOpenings] = useState([]);

    useEffect(() => {
        const fetchOpenings = async () => {
            const { data, error } = await supabase
                .from("job_openings")
                .select("title")
                .gt("expires_on", new Date().toISOString());
            if (error) console.error("Error fetching openings:", error);
            else setOpenings(data.map((job) => job.title));
        };
        fetchOpenings();
    }, []);

    const handleOpeningChange = (e) => {
        setSelectedOpening(e.target.value);
    };

    const handleViewDescription = () => {
        if (selectedOpening) {
            setIsModalOpen(true);
        }
    };

    const handleProceed = () => {
        setIsModalOpen(false);
        window.location.href = `/interview?opening=${encodeURIComponent(selectedOpening)}`;
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <iframe
                    className="w-full h-full object-cover"
                    src="https://www.youtube.com/embed/K_-ueg_1moI?autoplay=1&loop=1&playlist=K_-ueg_1moI&controls=0&mute=1&showinfo=0&rel=0&modestbranding=1&fs=0"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title="Background Video"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent opacity-90 z-1"></div>
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
                <div className="mb-6">
                    <a target="_blank" rel="noopener noreferrer" href="https://growthpad.co.ke">
                        <Image
                            src="/assets/images/logo-tagline-orange.svg"
                            alt="Growthpad Consulting Group Logo"
                            width={350}
                            height={200}
                            className="mx-auto transform transition duration-300 hover:scale-110"
                        />
                    </a>
                </div>
                <h1 className="text-3xl font-bold text-[#231812] mb-4">Welcome to Careers at Growthpad</h1>
                <p className="text-[#231812] mb-4 text-base">
                    We are a Nairobi Headquartered – cross-Africa communication, technology, and digital services firm
                    that blends strategy, creativity, and technology to bring powerful results for organizations in the
                    African market.
                </p>
                <hr className="h-px my-8 bg-[#F05D23] border-0 dark:bg-gray-700"/>
                <p className="text-[#231812] mb-8 text-base">
                    Take the first step toward joining our team. Select a current opening below to view the job
                    description and begin the interview process.
                </p>
                <div className="mb-6">
                    <label htmlFor="opening" className="block text-lg font-medium text-[#231812] mb-2">
                        Current Opening <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="opening"
                        value={selectedOpening}
                        onChange={handleOpeningChange}
                        className="w-full sm:w-3/4 mx-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:border-[#f05d23] transition-all duration-200 bg-white text-[#231812]"
                    >
                        <option value="" disabled>Select an opening</option>
                        {openings.map((opening) => (
                            <option key={opening} value={opening}>
                                {opening}
                            </option>
                        ))}
                    </select>
                    {selectedOpening && (
                        <button
                            onClick={handleViewDescription}
                            className="mt-4 text-[#f05d23] text-lg font-semibold hover:text-[#d94f1e] transition duration-200 flex items-center mx-auto"
                        >
                            <Icon icon="mdi:information-outline" width={20} height={20} className="mr-2"/>
                            View Job Description
                        </button>
                    )}
                </div>
                <JobDescriptionModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onProceed={handleProceed}
                    selectedOpening={selectedOpening}
                />
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto">
                    <a href="https://growthpad.co.ke/career-opportunities/" target="_blank" rel="noopener noreferrer">
                        <button
                            className="flex items-center px-6 py-3 bg-white text-[#231812] font-semibold rounded-lg shadow-lg border border-[#fff8f7] hover:shadow-xl hover:bg-[#f4f4f4] transition transform duration-300 hover:scale-105 w-full sm:w-auto">
                            <Icon icon="mdi:open-in-new" width={20} height={20} className="mr-2"/>
                            Explore Life at Growthpad
                        </button>
                    </a>
                </div>

                {/* Admin Login Button */}
                <Link href="/hr/login">
                    <span className="flex items-center gap-2 font-bold p-4 z-10 transform transition-transform hover:translate-y-[-2px] sm:absolute sm:bottom-0 sm:right-0 sm:flex sm:mt-4 w-full sm:w-auto justify-center">
                        Admin Login
                        <Image
                            src="/assets/images/single-arrow.png"
                            alt="GCG Arrow"
                            width={20}
                            height={20}
                            className=""
                        />
                    </span>
                </Link>

                {/* Hidden Arrow Image at the Bottom Left */}
                <Image
                    src="/assets/images/gcg-arrows-black.png"
                    alt="Growthpad Consulting Group Logo"
                    width={150}
                    height={200}
                    className="hidden sm:block absolute bottom-0 left-0 p-4 z-10"
                />
            </div>

            {/* Social Icons in Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-4 sm:space-x-6 p-2 bg-white bg-opacity-50 backdrop-blur-lg shadow-full rounded-lg">
                    <a href="https://x.com/growthpadEA" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:-translate-y-2 group">
                        <Icon icon="fa6-brands:square-x-twitter" width={30} height={30} className="text-black" />
                        <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black p-2 rounded-lg text-center opacity-0 group-hover:opacity-70 transition-opacity duration-300 w-36 max-w-xs">Follow us on X</span>
                    </a>
                    <a href="https://www.youtube.com/channel/UCDGqgoqam13s-e8BAw5xkCQ" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:-translate-y-2 group">
                        <Icon icon="mdi:youtube" width={30} height={30} className="text-[#FF0000]" />
                        <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black p-2 rounded-lg text-center opacity-0 group-hover:opacity-70 transition-opacity duration-300 w-36 max-w-xs">Subscribe to us on YouTube</span>
                    </a>
                    <a href="https://ke.linkedin.com/company/growthpad-consulting" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:-translate-y-2 group">
                        <Icon icon="mdi:linkedin" width={30} height={30} className="text-[#0077B5]" />
                        <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black p-2 rounded-lg text-center opacity-0 group-hover:opacity-70 transition-opacity duration-300 w-36 max-w-xs">Connect with us on LinkedIn</span>
                    </a>
                    <a href="https://www.facebook.com/growthpadconsulting/" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:-translate-y-2 group">
                        <Icon icon="mdi:facebook" width={30} height={30} className="text-[#4267B2]" />
                        <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black p-2 rounded-lg text-center opacity-0 group-hover:opacity-70 transition-opacity duration-300 w-36 max-w-xs">Follow us on Facebook</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
