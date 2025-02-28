// src/hooks/useFormData.js
import { useState } from "react";
import toast from "react-hot-toast";

export const useFormData = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        opening: "", // Added for completeness
        answers: [], // Initialize as array instead of object
        resume: null,
        coverLetter: null,
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionToggle = (questionIndex, option) => {
        setFormData((prev) => {
            const newAnswers = [...prev.answers]; // Clone answers array
            newAnswers[questionIndex] = newAnswers[questionIndex] || []; // Ensure sub-array exists
            const currentAnswers = newAnswers[questionIndex];
            let updatedAnswers;
            if (currentAnswers.includes(option)) {
                updatedAnswers = currentAnswers.filter((ans) => ans !== option); // Remove option
            } else {
                updatedAnswers = questionIndex === 0 ? [...currentAnswers, option] : [option]; // Multi-select for Q1, single-select for others
            }
            newAnswers[questionIndex] = updatedAnswers;
            return { ...prev, answers: newAnswers };
        });
        toast(`${option} ${formData.answers[questionIndex]?.includes(option) ? "deselected" : "selected"}`, { duration: 1000 });
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Return base64 without data URI prefix
            reader.onerror = (error) => reject(error);
        });

    return {
        formData,
        setFormData,
        submissionStatus,
        setSubmissionStatus,
        handleChange,
        handleOptionToggle,
        fileToBase64,
    };
};