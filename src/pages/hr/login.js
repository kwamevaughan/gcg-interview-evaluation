// src/pages/hr/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function HRLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
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
        setTimeout(() => router.push("/hr/jobs"), 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-[#f05d23] bg-opacity-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all duration-500 hover:shadow-2xl">
                <Toaster position="top-right" reverseOrder={false} />
                <div className="mb-8 text-center">
                    <Image
                        src="/assets/images/logo-tagline-orange.svg"
                        alt="Growthpad Consulting Group Logo"
                        width={220}
                        height={110}
                        className="mx-auto animate-fade-in"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-[#231812]">HR Login</h2>
                    <p className="mt-2 text-sm text-gray-600">Welcome back to Growthpad HR Portal</p>
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
                        <div className="flex items-center">
                            <Icon
                                icon="mdi:lock-outline"
                                className="absolute left-3 text-[#231812] h-5 w-5"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:border-transparent transition-all duration-200 text-[#231812] placeholder-gray-400"
                                placeholder="Enter your password"
                                required
                            />
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
                            className="flex-1 py-3 px-4 bg-[#f05d23] text-white font-semibold rounded-lg shadow-md hover:bg-[#d94f1e] focus:outline-none focus:ring-2 focus:ring-[#f05d23] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Icon icon="mdi:login" className="h-5 w-5" />
                            Sign In
                        </button>
                        <a
                            href="/"
                            className="flex-1 py-3 px-4 bg-[#231812] cursor-pointer text-white font-semibold rounded-lg shadow-md hover:bg-[#4a2e24] focus:outline-none focus:ring-2 focus:ring-[#231812] focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Icon icon="mdi:arrow-left" className="h-5 w-5" />
                            Return
                        </a>
                    </div>
                </form>
                <p className="mt-2 text-center text-xs text-gray-500">
                    Powered by <span className="text-[#f05d23] font-medium">Growthpad Consulting Group</span>
                </p>
            </div>
        </div>
    );
}