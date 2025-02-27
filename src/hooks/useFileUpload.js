// src/hooks/useFileUpload.js
import { useState } from "react";
import toast from "react-hot-toast";

export const useFileUpload = (formData, setFormData) => {
    const [isDraggingResume, setIsDraggingResume] = useState(false);
    const [isDraggingCoverLetter, setIsDraggingCoverLetter] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ resume: 0, coverLetter: 0 });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, [type]: file }));
            toast.success(`${type === "resume" ? "Resume" : "Cover Letter"} selected: ${file.name}`);
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, [type]: file }));
            toast.success(`${type === "resume" ? "Resume" : "Cover Letter"} dropped: ${file.name}`);
        }
        if (type === "resume") setIsDraggingResume(false);
        else setIsDraggingCoverLetter(false);
    };

    const handleDragOver = (e, type) => {
        e.preventDefault();
        if (type === "resume") setIsDraggingResume(true);
        else setIsDraggingCoverLetter(true);
    };

    const handleDragLeave = (e, type) => {
        e.preventDefault();
        if (type === "resume") setIsDraggingResume(false);
        else setIsDraggingCoverLetter(false);
    };

    const removeFile = (type) => {
        setFormData((prev) => ({ ...prev, [type]: null }));
        setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
        toast.success(`${type === "resume" ? "Resume" : "Cover Letter"} removed`);
    };

    return {
        isDraggingResume,
        isDraggingCoverLetter,
        uploadProgress,
        setUploadProgress,
        handleFileChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        removeFile,
    };
};