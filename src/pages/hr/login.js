// src/pages/hr/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

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

        // Fetch user from hr_users table
        const { data: user, error: fetchError } = await supabase
            .from("hr_users")
            .select("username, password")
            .eq("username", username)
            .single();

        if (fetchError || !user) {
            toast.error("Invalid username or password.", { icon: "❌" });
            return;
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            toast.error("Invalid username or password.", { icon: "❌" });
            return;
        }

        // Set session (localStorage for simplicity; upgrade to JWT later)
        localStorage.setItem("hr_session", "authenticated");
        toast.success("Login successful! Redirecting...", { icon: "✅" });
        setTimeout(() => router.push("/hr/jobs"), 1000); // Slight delay for toast visibility
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <Toaster position="top-right" reverseOrder={false} />
                <div className="mb-6 text-center">
                    <Image
                        src="/assets/images/logo-tagline-orange.svg"
                        alt="Growthpad Consulting Group Logo"
                        width={200}
                        height={100}
                        className="mx-auto"
                    />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center text-[#231812]">HR Login..!</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#231812]">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#231812]">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23]"
                            required
                        />
                    </div>
                    <div className="mb-6 flex justify-center">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={() => setCaptchaVerified(true)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}