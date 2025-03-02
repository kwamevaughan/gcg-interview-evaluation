// src/pages/hr/login.js (Fallback)
import { useState } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Icon } from "@iconify/react";
import SimpleFooter from "@/layouts/simpleFooter";
import Footer from "@/layouts/footer";

export default function HRLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [mode] = useState("light");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!captchaVerified) {
            toast.error("Please verify the CAPTCHA.", { icon: "⚠️" });
            return;
        }

        const { data: user, error: fetchError } = await supabase
            .from("hr_users")
            .select("username, password")
            .eq("username", username)
            .single();

        if (fetchError || !user) {
            toast.error("Invalid username or password.", { icon: "❌" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            toast.error("Invalid username or password.", { icon: "❌" });
            return;
        }

        localStorage.setItem("hr_session", "authenticated");
        toast.success("Login successful! Redirecting...", { icon: "✅" });
        setTimeout(() => router.push("/hr/overview"), 1000);
    };

    return (
        <div className="min-h-screen flex pt-14 flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-[#f05d23] bg-opacity-50">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all duration-500 hover:shadow-2xl">
                    <Toaster position="top-right" reverseOrder={false} />
                    <div className="mb-8 text-center">
                        <Image
                            src="/assets/images/logo-tagline-orange.svg"
                            alt="Growthpad Consulting Group Logo"
                            width={350}
                            height={150}
                            className="mx-auto animate-fade-in"
                        />
                        <p className="mt-6 text-sm text-gray-600">Welcome back to Growthpad HR Portal</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#231812] mb-1">Username</label>
                            <div className="flex items-center">
                                <Icon
                                    icon="mdi:account-outline"
                                    className="absolute left-3 text-[#231812] h-5 w-5"
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:border-transparent transition-all duration-200 text-[#231812] placeholder-gray-400"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#231812] mb-1">Password</label>
                            <div className="flex items-center relative">
                                <Icon
                                    icon="mdi:lock-outline"
                                    className="absolute left-3 text-[#231812] h-5 w-5"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:border-transparent transition-all duration-200 text-[#231812] placeholder-gray-400"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-[#231812] hover:text-[#f05d23] focus:outline-none transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <Icon
                                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                                        className="h-5 w-5"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                onChange={() => setCaptchaVerified(true)}
                                className="transform scale-90 origin-center"
                            />
                        </div>
                        <div className="flex justify-between gap-4">
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 bg-[#f05d23] text-white font-semibold rounded-lg shadow-md hover:bg-[#d94f1e] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Icon icon="mdi:login" className="h-5 w-5" />
                                Sign In
                            </button>
                            <a
                                href="/"
                                className="flex-1 py-3 px-4 bg-[#231812] text-white font-semibold rounded-lg shadow-md hover:bg-[#4a2e24] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#231812] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Icon icon="mdi:arrow-left" className="h-5 w-5" />
                                Return
                            </a>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-xs text-gray-500">
                        Powered by{" "}
                        <a
                            href="https://growthpad.co.ke"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f05d23] font-medium hover:text-[#d94f1e] transition-colors"
                        >
                            Growthpad Consulting Group
                        </a>
                    </p>
                </div>
            </div>
            <Footer mode={mode} isSidebarOpen={false} />
        </div>
    );
}