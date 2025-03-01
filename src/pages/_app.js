// src/pages/_app.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const [mode, setMode] = useState("light");
    const router = useRouter();

    // Toggle dark mode and persist in localStorage
    const toggleMode = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("mode", newMode);
    };

    useEffect(() => {
        // Load saved mode or system preference on mount
        const savedMode = localStorage.getItem("mode");
        if (savedMode) {
            setMode(savedMode);
        } else {
            const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setMode(systemMode);
            localStorage.setItem("mode", systemMode);
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            const systemMode = e.matches ? "dark" : "light";
            if (!localStorage.getItem("mode")) {
                setMode(systemMode);
            }
        };
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <div className={mode === "dark" ? "dark" : ""}>
            <Component {...pageProps} mode={mode} toggleMode={toggleMode} />
            <ToastContainer position="top-right" theme={mode === "dark" ? "dark" : "light"} />
        </div>
    );
}

export default MyApp;