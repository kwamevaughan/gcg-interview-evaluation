// src/components/Step2Questions.js
import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Step2Questions({
                                           formData,
                                           handleOptionToggle,
                                           currentPage,
                                           questionsPerPage,
                                           questions,
                                           handleNextPage,
                                           totalPages,
                                           onComplete,
                                           mode,
                                       }) {
    const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
    const borderColors = ["border-red-500", "border-blue-500", "border-green-500", "border-yellow-500", "border-purple-500"];
    const questionRefs = useRef([]);
    const containerRef = useRef(null);
    const [hasContinuedFromQ1, setHasContinuedFromQ1] = useState(formData.answers[0]?.length > 0);

    const currentQuestionIndex = currentQuestions.findIndex(
        (q) => (!formData.answers[q.id - 1] || formData.answers[q.id - 1].length === 0) && q.id !== 1
    );
    const allQuestionsAnswered = questions.every((q) => formData.answers[q.id - 1]?.length > 0);
    const isLastPage = currentPage === totalPages - 1;
    const lastQuestionId = questions[questions.length - 1].id;
    const isLastQuestionAnswered = formData.answers[lastQuestionId - 1]?.length > 0;

    useEffect(() => {
        const allCurrentPageAnswered = currentQuestions.every((q) => formData.answers[q.id - 1]?.length > 0);
        if (allCurrentPageAnswered && currentPage < totalPages - 1) {
            handleNextPage();
        } else if (isLastPage && allQuestionsAnswered) {
            const lastQuestionRef = questionRefs.current[currentQuestions.findIndex((q) => q.id === lastQuestionId)];
            if (lastQuestionRef && containerRef.current) {
                lastQuestionRef.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else if (!hasContinuedFromQ1 && currentQuestions[0]?.id === 1) {
            const q1Ref = questionRefs.current[0];
            if (q1Ref && containerRef.current) {
                q1Ref.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            const indexToFocus = currentQuestionIndex >= 0 ? currentQuestionIndex : 0;
            const currentQuestion = questionRefs.current[indexToFocus];
            if (currentQuestion && containerRef.current) {
                currentQuestion.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [formData.answers, currentQuestionIndex, currentPage, totalPages, handleNextPage, hasContinuedFromQ1, allQuestionsAnswered, lastQuestionId, isLastPage]);

    const handleContinue = () => {
        if (formData.answers[0]?.length > 0) {
            setHasContinuedFromQ1(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
            <div className="space-y-6 p-4">
                {currentQuestions.map((question, index) => {
                    const isAnswered = formData.answers[question.id - 1]?.length > 0;
                    const isLastQuestion = question.id === lastQuestionId;
                    let isCurrent = false;
                    if (question.id === 1 && !hasContinuedFromQ1) {
                        isCurrent = true;
                    } else if (hasContinuedFromQ1) {
                        if (currentQuestionIndex === -1) {
                            isCurrent = isLastQuestion && isLastPage ? true : index === 0;
                        } else {
                            isCurrent = index === currentQuestionIndex;
                        }
                    }
                    const isDisabled = !isCurrent;

                    return (
                        <div
                            key={question.id}
                            ref={(el) => (questionRefs.current[index] = el)}
                            className={`shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] transition-all duration-500 transform ${
                                mode === "dark" ? "bg-gray-800" : "bg-white"
                            } ${
                                isAnswered && !isCurrent
                                    ? "opacity-50 blur-sm scale-95 -translate-y-10 pointer-events-none"
                                    : isCurrent
                                        ? "opacity-100 scale-100 animate-fade-in"
                                        : "opacity-50 blur-sm translate-y-10 pointer-events-none"
                            }`}
                        >
                            <div className="flex items-center mb-5">
                                <Icon icon="mdi:question-mark-circle" className="w-6 h-6 text-[#f05d23] mr-2" />
                                <p
                                    className={`text-xl font-semibold ${
                                        mode === "dark" ? "text-white" : "text-[#231812]"
                                    }`}
                                >
                                    {question.text}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((option, optIndex) => {
                                    const isSelected = (formData.answers[question.id - 1] || []).includes(option);
                                    return (
                                        <button
                                            key={option}
                                            disabled={isDisabled}
                                            onClick={() => handleOptionToggle(question.id - 1, option)}
                                            className={`w-full p-3 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200 ${
                                                borderColors[optIndex % borderColors.length]
                                            } ${
                                                isSelected
                                                    ? "bg-[#f05d23] border-[#f05d23] text-white shadow-md"
                                                    : mode === "dark"
                                                        ? "bg-gray-700 text-white hover:bg-gray-600 hover:border-[#d94f1e]"
                                                        : "bg-gray-50 text-[#231812] hover:bg-gray-100 hover:border-[#d94f1e]"
                                            } ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                                        >
                                            <div className="flex items-center">
                                                {isSelected ? (
                                                    <Icon icon="mdi:check-circle" className="w-5 h-5 mr-2 flex-shrink-0" />
                                                ) : (
                                                    <Icon
                                                        icon="mdi:circle-outline"
                                                        className={`w-5 h-5 mr-2 flex-shrink-0 ${
                                                            mode === "dark" ? "text-gray-400" : "text-gray-400"
                                                        }`}
                                                    />
                                                )}
                                                <span className="flex-1">{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                                {question.id === 1 && !hasContinuedFromQ1 && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={handleContinue}
                                            disabled={!formData.answers[0]?.length}
                                            className="px-6 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] disabled:bg-gray-300 disabled:text-gray-600 transition-all duration-200 shadow-md"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                )}
                            </div>
                            {isLastQuestion && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={onComplete}
                                        disabled={!isLastQuestionAnswered}
                                        className={`px-6 py-3 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition-all duration-200 shadow-md ${
                                            !isLastQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        Upload CV
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}