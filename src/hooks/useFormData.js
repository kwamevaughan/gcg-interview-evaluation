// src/hooks/useFormData.js
import { useState } from "react";
import toast from "react-hot-toast";

export const useFormData = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        answers: {},
        resume: null,
        coverLetter: null,
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionToggle = (questionIndex, option) => {
        const currentAnswers = formData.answers[questionIndex] || [];
        let newAnswers;
        if (currentAnswers.includes(option)) {
            newAnswers = currentAnswers.filter((ans) => ans !== option);
        } else {
            newAnswers = questionIndex === 0 ? [...currentAnswers, option] : [option];
        }
        setFormData((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionIndex]: newAnswers },
        }));
        toast(`${option} ${newAnswers.includes(option) ? "selected" : "deselected"}`, { duration: 1000 });
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
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