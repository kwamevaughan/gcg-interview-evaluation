// src/pages/hr/interview-questions.js
import { useState } from "react";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionTable from "@/components/QuestionTable";
import QuestionForm from "@/components/QuestionForm";
import SimpleFooter from "@/layouts/simpleFooter";
import { supabase } from "@/lib/supabase";

export default function HRInterviewQuestions({ mode = "light", toggleMode, initialQuestions }) {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const {
        questions,
        searchQuery,
        setSearchQuery,
        sortField,
        sortDirection,
        handleSort,
        filterPoints,
        setFilterPoints,
        addQuestion,
        editQuestion,
        deleteQuestion,
        moveQuestion,
    } = useQuestions(initialQuestions);

    const handleMoveQuestion = async (fromIndex, toIndex) => {
        const success = await moveQuestion(fromIndex, toIndex);
        if (success) {
            console.log("Questions reordered successfully!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
    };

    const startEditing = (question) => {
        console.log("Editing question:", question);
        setEditingQuestion(question);
        setIsQuestionModalOpen(true);
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setIsQuestionModalOpen(true);
    };

    const handleFormCancel = () => {
        setIsQuestionModalOpen(false);
        setEditingQuestion(null);
    };

    const totalQuestions = questions.length;
    const totalPoints = questions.reduce((sum, q) => {
        if (q.points) {
            if ("base" in q.points) {
                return sum + (q.points.max || 10);
            }
            const maxOptionPoints = Math.max(...Object.values(q.points).map(Number).filter((n) => !isNaN(n)));
            return sum + (maxOptionPoints > 0 ? maxOptionPoints : 10);
        }
        return sum + 10;
    }, 0);

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                className={`min-h-screen flex flex-col ${
                    mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
                }`}
            >
                <Toaster position="top-right" reverseOrder={false} />
                <HRHeader
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    mode={mode}
                    toggleMode={toggleMode}
                    onLogout={handleLogout}
                    pageName="Interview Questions"
                    pageDescription={`Manage interview questions (Total: ${totalQuestions}, Max Points: ${totalPoints})`}
                />
                <div className="flex flex-1">
                    <HRSidebar
                        isOpen={isSidebarOpen}
                        mode={mode}
                        onLogout={handleLogout}
                        toggleSidebar={toggleSidebar}
                    />
                    <div
                        className={`flex-1 p-6 transition-all duration-300 ${
                            isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                        }`}
                    >
                        <div className="max-w-6xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2"></div>
                                <button
                                    onClick={handleAddQuestion}
                                    className="px-4 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] flex items-center gap-2 transition duration-200 shadow-md"
                                >
                                    <Icon icon="mdi:plus" width={20} height={20} />
                                    Add Question
                                </button>
                            </div>

                            <QuestionForm
                                mode={mode}
                                question={editingQuestion}
                                onSubmit={editingQuestion ? editQuestion : addQuestion}
                                onCancel={handleFormCancel}
                                isOpen={isQuestionModalOpen}
                            />

                            <div className="mb-6 flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Icon
                                        icon="mdi:magnify"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                            mode === "dark"
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-[#231812]"
                                        }`}
                                        placeholder="Search questions..."
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label
                                        className={`text-sm font-medium ${
                                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                                        }`}
                                    >
                                        Filter by Points:
                                    </label>
                                    <select
                                        value={filterPoints}
                                        onChange={(e) => setFilterPoints(e.target.value)}
                                        className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                            mode === "dark"
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-[#231812]"
                                        }`}
                                    >
                                        <option value="all">All</option>
                                        <option value="hasPoints">Has Points</option>
                                        <option value="noPoints">No Points</option>
                                    </select>
                                </div>
                            </div>

                            <QuestionTable
                                questions={questions}
                                mode={mode}
                                onEdit={startEditing}
                                moveQuestion={handleMoveQuestion}
                                handleSort={handleSort}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                deleteQuestion={deleteQuestion}
                            />
                        </div>
                    </div>
                </div>
                <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
            </div>
        </DndProvider>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;

    if (!req.cookies.hr_session) {
        return {
            redirect: {
                destination: "/hr/login",
                permanent: false,
            },
        };
    }

    try {
        console.time("fetchInterviewQuestions");
        const { data: questions, error } = await supabase
            .from("interview_questions")
            .select("*")
            .order("order", { ascending: true });
        console.timeEnd("fetchInterviewQuestions");

        if (error) throw error;

        return {
            props: {
                initialQuestions: questions,
            },
        };
    } catch (error) {
        console.error("Error fetching interview questions:", error);
        return {
            props: {
                initialQuestions: [],
            },
        };
    }
}