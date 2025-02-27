// src/components/Step1Form.js
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Step1Form({ formData, handleChange, mode }) {
    const [errors, setErrors] = useState({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;

    const validateField = (name, value) => {
        let error = "";
        if (name === "fullName" && !value.trim()) {
            error = "Full name is required";
        } else if (name === "email") {
            if (!value.trim()) {
                error = "Email is required";
            } else if (!emailRegex.test(value)) {
                error = "Please enter a valid email (e.g., hello@gmail.com)";
            }
        } else if (name === "linkedin" && value.trim() && !linkedinRegex.test(value)) {
            error = "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/johndoe)";
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);
        validateField(name, value);
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div
                className={`shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${
                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                }`}
            >
                <div className="flex items-center justify-center mb-6">
                    <Icon icon="mdi:handshake" className="w-8 h-8 text-[#f05d23] mr-2" />
                    <h2 className="text-3xl font-bold text-center">Let’s Get Started</h2>
                </div>
                <p
                    className={`text-center mb-8 italic ${
                        mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                    Welcome to Growthpad! Tell us a bit about yourself to begin your journey.
                </p>
                <div className="space-y-6">
                    <div className="relative">
                        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <div className="flex items-center">
                            <Icon icon="mdi:user" className="absolute left-3 text-[#f05d23] w-5 h-5" />
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="e.g., John Doe"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                    mode === "dark"
                                        ? `bg-gray-700 text-white border-gray-600 ${
                                            errors.fullName ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                        : `bg-gray-50 text-[#231812] border-gray-300 ${
                                            errors.fullName ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                }`}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                                <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" /> {errors.fullName}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <div className="flex items-center">
                            <Icon icon="mdi:email" className="absolute left-3 text-[#f05d23] w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g., john.doe@example.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                    mode === "dark"
                                        ? `bg-gray-700 text-white border-gray-600 ${
                                            errors.email ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                        : `bg-gray-50 text-[#231812] border-gray-300 ${
                                            errors.email ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                                <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" /> {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Phone
                        </label>
                        <div className="flex items-center">
                            <Icon icon="mdi:phone" className="absolute left-3 text-[#f05d23] w-5 h-5" />
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g., +254 701 850 850"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                    mode === "dark"
                                        ? "bg-gray-700 text-white border-gray-600 focus:border-[#f05d23]"
                                        : "bg-gray-50 text-[#231812] border-gray-300 focus:border-[#f05d23]"
                                }`}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                            LinkedIn Profile
                        </label>
                        <div className="flex items-center">
                            <Icon icon="mdi:linkedin" className="absolute left-3 text-[#f05d23] w-5 h-5" />
                            <input
                                type="text"
                                name="linkedin"
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                placeholder="e.g., https://linkedin.com/in/johndoe"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                    mode === "dark"
                                        ? `bg-gray-700 text-white border-gray-600 ${
                                            errors.linkedin ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                        : `bg-gray-50 text-[#231812] border-gray-300 ${
                                            errors.linkedin ? "border-red-500" : "focus:border-[#f05d23]"
                                        }`
                                }`}
                            />
                        </div>
                        {errors.linkedin && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                                <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" /> {errors.linkedin}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}