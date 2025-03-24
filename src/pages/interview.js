import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import Head from "next/head"; // Added for SEO

export default function InterviewPage({ mode, toggleMode, initialQuestions }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [uploadProgress, setUploadProgress] = useState({ resume: 0, coverLetter: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [questions] = useState(initialQuestions);
    const { formData, setFormData, submissionStatus, setSubmissionStatus, handleChange, handleOptionToggle, fileToBase64 } =
        useFormData();

    useEffect(() => {
        setIsClient(true);
        const opening = router.query.opening;
        if (opening && !formData.opening) {
            setFormData((prev) => ({ ...prev, opening: decodeURIComponent(opening) }));
        }
        setFormData((prev) => ({
            ...prev,
            answers: Array(initialQuestions.length).fill([]),
        }));
    }, [router.query.opening, formData.opening, setFormData, initialQuestions]);

    const fileUploadProps = useFileUpload(formData, setFormData);

    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const totalQuestions = questions.length;
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
                opening: formData.opening,
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
            <Head>
                <title>Apply Now | Growthpad Consulting Group Interview Process</title>
                <meta
                    name="description"
                    content="Start your job application with Growthpad Consulting Group. Complete our interview process, answer questions, and upload your resume and cover letter to join our Nairobi-based team."
                />
                <meta
                    name="keywords"
                    content="job application, interview process, Growthpad Consulting, Nairobi careers, apply online, submit resume, job opportunities Africa"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Growthpad Consulting Group" />
                <meta property="og:title" content="Apply Now | Growthpad Consulting Group Interview Process" />
                <meta
                    property="og:description"
                    content="Apply for a job at Growthpad Consulting Group. Complete the interview steps, submit your resume, and join our team in Nairobi and across Africa."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://careers.growthpad.co.ke/interview" />
                <meta property="og:image" content="https://careers.growthpad.co.ke/assets/images/logo-tagline-orange.svg" />
                <meta property="og:site_name" content="Growthpad Careers" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Apply Now | Growthpad Consulting Group Interview Process" />
                <meta
                    name="twitter:description"
                    content="Begin your career with Growthpad Consulting Group. Apply online through our interview process and submit your application today!"
                />
                <meta name="twitter:image" content="https://careers.growthpad.co.ke/assets/images/logo-tagline-orange.svg" />
            </Head>

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
                    {isClient && <Toaster position="top-right" reverseOrder={false} />}
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

export async function getStaticProps() {
    try {
        console.time("fetchInterviewQuestions");
        const { data: questions, error } = await supabase
            .from("interview_questions")
            .select("*")
            .order("id", { ascending: true });
        console.timeEnd("fetchInterviewQuestions");

        if (error) throw error;

        return {
            props: {
                initialQuestions: questions,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error("Error fetching questions in getStaticProps:", error);
        return {
            props: {
                initialQuestions: [],
            },
            revalidate: 60,
        };
    }
}