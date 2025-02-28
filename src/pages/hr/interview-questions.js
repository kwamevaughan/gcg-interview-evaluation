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

export default function HRInterviewQuestions({ mode = "light", toggleMode }) {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [isAdding, setIsAdding] = useState(false);
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
    } = useQuestions();

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
        setEditingQuestion(question);
    };

    const handleFormCancel = () => {
        setIsAdding(false);
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
                        <div className="max-w-5xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:comment-question-outline" className="w-6 h-6 text-[#f05d23]" />
                                    <div>
                                        <h3
                                            className={`text-xl font-bold ${
                                                mode === "dark" ? "text-white" : "text-[#231812]"
                                            }`}
                                        >
                                            Interview Questions
                                        </h3>
                                        <p
                                            className={`text-sm ${
                                                mode === "dark" ? "text-gray-300" : "text-gray-600"
                                            }`}
                                        >
                                            Total Questions: {totalQuestions} | Max Points: {totalPoints}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="px-4 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] flex items-center gap-2 transition duration-200 shadow-md"
                                >
                                    <Icon icon="mdi:plus" width={20} height={20} />
                                    Add Question
                                </button>
                            </div>

                            {(isAdding || editingQuestion) && (
                                <QuestionForm
                                    mode={mode}
                                    question={editingQuestion}
                                    onSubmit={editingQuestion ? editQuestion : addQuestion}
                                    onCancel={handleFormCancel}
                                />
                            )}

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
                <footer
                    className={`p-4 text-center text-sm shadow-inner ${
                        mode === "dark" ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"
                    }`}
                >
                    © {new Date().getFullYear()} Growthpad Consulting Group. All rights reserved.
                </footer>
            </div>
        </DndProvider>
    );
}