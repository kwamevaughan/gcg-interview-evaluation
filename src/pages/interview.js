// src/pages/interview.js
import { useState } from "react";
import { questions } from "@/data/questions";
import Header from "@/layouts/header";
import toast, { Toaster } from "react-hot-toast";
import { useFormData } from "@/hooks/useFormData";
import { useFileUpload } from "@/hooks/useFileUpload";
import Step1Form from "@/components/Step1Form";
import Step2Questions from "@/components/Step2Questions";
import Step3Documents from "@/components/Step3Documents";
import Step4Confirmation from "@/components/Step4Confirmation";
import { Icon } from "@iconify/react";
import Footer from "@/layouts/footer";

export default function InterviewPage({ mode, toggleMode }) {
    const [step, setStep] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [uploadProgress, setUploadProgress] = useState({ resume: 0, coverLetter: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { formData, setFormData, submissionStatus, setSubmissionStatus, handleChange, handleOptionToggle, fileToBase64 } =
        useFormData();
    const fileUploadProps = useFileUpload(formData, setFormData);

    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const totalQuestions = questions.length; // 19
    const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

    const handleNext = async () => {
        if (step === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
            if (!formData.fullName || !formData.email || !formData.phone || !formData.linkedin) {
                toast.error("Please fill out all required fields.", { icon: "⚠️" });
                return;
            }
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email (e.g., hello@gmail.com)", { icon: "⚠️" });
                return;
            }
            if (!urlRegex.test(formData.linkedin)) {
                toast.error("Please enter a valid URL for LinkedIn (e.g., https://example.com)", { icon: "⚠️" });
                return;
            }
            setStep(2);
            toast.success("Great! Let’s move to the questions.", { icon: "🎉" });
        } else if (step === 2) {
            if (!isPageComplete()) {
                toast.error("Please answer all questions on this page.", { icon: "⚠️" });
                return;
            }
            if (currentPage < totalPages - 1) {
                handleNextPage();
            } else {
                setStep(3);
                toast.success("All questions completed! Upload your documents next.", { icon: "📝" });
            }
        } else if (step === 3) {
            setIsSubmitting(true);
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            if (!formData.resume || !formData.coverLetter) {
                toast.error("Please upload both your resume and cover letter.", { icon: "⚠️" });
                setIsSubmitting(false);
                return;
            }
            if (formData.resume && formData.resume.size > maxFileSize) {
                toast.error("Resume file size exceeds 5MB limit.", { icon: "⚠️" });
                setIsSubmitting(false);
                return;
            }
            if (formData.coverLetter && formData.coverLetter.size > maxFileSize) {
                toast.error("Cover letter file size exceeds 5MB limit.", { icon: "⚠️" });
                setIsSubmitting(false);
                return;
            }

            const dataToSend = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                linkedin: formData.linkedin,
                answers: formData.answers,
                resume: formData.resume ? await fileToBase64(formData.resume) : null,
                coverLetter: formData.coverLetter ? await fileToBase64(formData.coverLetter) : null,
            };

            console.log("Data to send:", {
                ...dataToSend,
                resume: dataToSend.resume ? "present" : "none",
                coverLetter: dataToSend.coverLetter ? "present" : "none",
            });

            const submitToast = toast.loading("Submitting your application...");

            const simulateProgress = () => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setUploadProgress({
                        resume: formData.resume ? Math.min(progress, 100) : 0,
                        coverLetter: formData.coverLetter ? Math.min(progress, 100) : 0,
                    });
                    if (progress >= 100) clearInterval(interval);
                }, 200);
                return interval;
            };

            const progressInterval = simulateProgress();

            try {
                const response = await fetch("/api/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                });
                const result = await response.json();
                if (response.ok) {
                    clearInterval(progressInterval);
                    setUploadProgress({ resume: 100, coverLetter: 100 });
                    toast.success("Submission successful!", { id: submitToast, icon: "✅" });
                    setSubmissionStatus({ success: true, score: result.score });
                    setStep(4);
                } else {
                    throw new Error(result.error || "Unknown error");
                }
            } catch (error) {
                clearInterval(progressInterval);
                toast.error(`Submission failed: ${error.message}`, { id: submitToast, icon: "❌" });
                setSubmissionStatus({ success: false, message: error.message });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (step === 2 && currentPage > 0) {
            setCurrentPage(currentPage - 1);
            toast("Going back to the previous set...", { icon: "⬅️" });
        } else if (step > 1) {
            setStep(step - 1);
            setUploadProgress({ resume: 0, coverLetter: 0 });
            toast("Returning to the previous step...", { icon: "⬅️" });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            toast("Moving to the next set of questions...", { icon: "➡️" });
        }
    };

    const handleQuestionsComplete = () => {
        setStep(3);
        setUploadProgress({ resume: 0, coverLetter: 0 });
        toast.success("All questions completed! Upload your documents next.", { icon: "📝" });
    };

    const isPageComplete = () => currentQuestions.every((q) => formData.answers[q.id - 1]?.length > 0);
    const isStep1Complete = formData.fullName && formData.email;
    const answeredQuestions = questions.filter((q) => formData.answers[q.id - 1]?.length > 0).length;

    return (
        <>
            <Header
                mode={mode}
                toggleMode={toggleMode}
                step={step}
                currentPage={currentPage}
                totalPages={totalPages}
                uploadProgress={uploadProgress}
                answeredQuestions={answeredQuestions}
                totalQuestions={totalQuestions}
                isStep1Complete={isStep1Complete}
            />
            <div
                className={`min-h-screen flex flex-col justify-center items-center ${
                    mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-100 to-gray-200"
                }`}
            >
                <div className="max-w-3xl w-full mx-auto p-6">
                    <Toaster position="top-right" reverseOrder={false} />
                    {step === 1 && <Step1Form formData={formData} handleChange={handleChange} mode={mode} />}
                    {step === 2 && (
                        <Step2Questions
                            formData={formData}
                            handleOptionToggle={handleOptionToggle}
                            currentPage={currentPage}
                            questionsPerPage={questionsPerPage}
                            questions={questions}
                            handleNextPage={handleNextPage}
                            totalPages={totalPages}
                            onComplete={handleQuestionsComplete}
                            mode={mode}
                        />
                    )}
                    {step === 3 && (
                        <Step3Documents
                            formData={formData}
                            setFormData={setFormData}
                            isSubmitting={isSubmitting}
                            uploadProgress={uploadProgress}
                            setUploadProgress={setUploadProgress}
                            mode={mode}
                            {...fileUploadProps}
                        />
                    )}
                    {step === 4 && <Step4Confirmation formData={formData} submissionStatus={submissionStatus} mode={mode} />}
                    {step !== 4 && (
                        <div className="mt-8 flex justify-between items-center gap-4">
                            <button
                                onClick={handleBack}
                                disabled={step === 1 || isSubmitting}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-500 disabled:text-gray-300 transition-all duration-200 shadow-md ${
                                    mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-400 text-white"
                                }`}
                            >
                                <Icon icon="mdi:arrow-left" className="mr-2 w-5 h-5" />
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={(step === 2 && !isPageComplete()) || isSubmitting}
                                className={`flex items-center justify-center px-4 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] disabled:bg-gray-300 disabled:text-gray-600 transition-all duration-200 shadow-md`}
                            >
                                {step === 3 ? (
                                    <>
                                        Submit
                                        <Icon icon="mdi:send" className="ml-2 w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <Icon icon="mdi:arrow-right" className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer mode={mode} />
        </>
    );
}