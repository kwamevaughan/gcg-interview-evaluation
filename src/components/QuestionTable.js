import { Icon } from "@iconify/react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ItemType = {
    QUESTION: "question",
};

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};

const DraggableQuestion = ({ question, index, moveQuestion, mode, onEdit, deleteQuestion }) => {
    const [, drag] = useDrag({
        type: ItemType.QUESTION,
        item: { index },
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemType.QUESTION,
        hover(item) {
            if (item.index !== index) {
                moveQuestion(item.index, index);
                item.index = index;
            }
        },
    });

    const handleDelete = () => {
        const cleanText = stripHtmlTags(question.text); // Strip HTML tags
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 flex-1">
                                <p className="text-xl font-medium text-gray-900">Delete Question?</p>
                                <p className="mt-2 text-base text-gray-500">
                                    Are you sure you want to delete the question "{cleanText}"?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                deleteQuestion(question.id, question.text);
                                toast.success("Question deleted successfully!", { icon: "🗑️" });
                            }}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors focus:outline-none"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors focus:outline-none"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    return (
        <tr
            ref={(node) => drag(drop(node))}
            className={`border-b hover:bg-opacity-80 transition duration-200 cursor-move ${
                mode === "dark"
                    ? `border-gray-700 hover:bg-gray-700 ${isOver ? "bg-gray-600" : ""} text-gray-200`
                    : `border-gray-200 hover:bg-gray-50 ${isOver ? "bg-gray-200" : ""} text-gray-800`
            }`}
        >
            <td className="p-2 sm:p-4 w-8 sm:w-12">
                <Icon
                    icon="mdi:drag"
                    width={16}
                    height={16}
                    className={mode === "dark" ? "text-gray-400" : "text-gray-500"}
                />
            </td>
            <td className="p-2 sm:p-4 text-xs sm:text-sm">{question.order + 1}</td>
            <td className="p-2 sm:p-4 text-xs sm:text-sm">
                <div
                    className={`prose max-w-none line-clamp-2 ${
                        mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                    dangerouslySetInnerHTML={{ __html: question.text }}
                />
            </td>
            <td className="p-2 sm:p-4 text-xs sm:text-sm">{question.options.join("; ")}</td>
            <td className="p-2 sm:p-4 text-xs sm:text-sm">
                {question.points ? JSON.stringify(question.points) : "None"}
            </td>
            <td className="p-2 sm:p-4 text-xs sm:text-sm flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => onEdit(question)}
                    className="px-2 sm:px-3 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                    <Icon icon="mdi:pencil" width={14} height={14} className="text-white" />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                    <Icon icon="mdi:trash-can" width={14} height={14} className="text-white" />
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default function QuestionTable({
                                          questions,
                                          mode,
                                          onEdit,
                                          moveQuestion,
                                          handleSort,
                                          sortField,
                                          sortDirection,
                                          deleteQuestion,
                                      }) {
    const handleMobileDelete = (question) => {
        const cleanText = stripHtmlTags(question.text); // Strip HTML tags
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 flex-1">
                                <p className="text-xl font-medium text-gray-900">Delete Question?</p>
                                <p className="mt-2 text-base text-gray-500">
                                    Are you sure you want to delete the question "{cleanText}"?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                deleteQuestion(question.id, question.text);
                                toast.success("Question deleted successfully!", { icon: "🗑️" });
                            }}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors focus:outline-none"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors focus:outline-none"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    return (
        <div
            className={`border-t-4 border-[#f05d23] rounded-lg shadow-lg overflow-hidden ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="max-h-[500px] overflow-y-auto">
                {/* Table for larger screens */}
                <table className="w-full hidden sm:table">
                    <thead className="sticky top-0 z-10">
                    <tr
                        className={`${
                            mode === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        <th className="p-2 sm:p-4 w-8 sm:w-12"></th>
                        <th
                            className="flex p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => handleSort("order")}
                        >
                            Order{" "}
                            {sortField === "order" && (
                                <Icon
                                    icon={sortDirection === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}
                                    width={14}
                                    height={14}
                                    className={`inline ${
                                        mode === "dark" ? "text-gray-200" : "text-gray-800"
                                    }`}
                                />
                            )}
                        </th>
                        <th
                            className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => handleSort("text")}
                        >
                            Question{" "}
                            {sortField === "text" && (
                                <Icon
                                    icon={sortDirection === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}
                                    width={14}
                                    height={14}
                                    className={`inline ${
                                        mode === "dark" ? "text-gray-200" : "text-gray-800"
                                    }`}
                                />
                            )}
                        </th>
                        <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold">Options</th>
                        <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold">Points</th>
                        <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((question, index) => (
                        <DraggableQuestion
                            key={question.id}
                            question={question}
                            index={index}
                            moveQuestion={moveQuestion}
                            mode={mode}
                            onEdit={onEdit}
                            deleteQuestion={deleteQuestion}
                        />
                    ))}
                    </tbody>
                </table>

                {/* Card layout for mobile */}
                <div className="sm:hidden space-y-4 p-2">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className={`p-3 rounded-lg border ${
                                mode === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-gray-50 border-gray-200 text-gray-800"
                            }`}
                        >
                            <div className="flex items-center mb-2">
                                <Icon
                                    icon="mdi:drag"
                                    width={16}
                                    height={16}
                                    className={`mr-2 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
                                />
                                <span className="text-xs font-semibold">{question.order + 1}</span>
                            </div>
                            <div className="text-xs mb-1">
                                <span className="font-medium">Question:</span>
                                <div
                                    className="prose max-w-none line-clamp-2 inline ml-1"
                                    dangerouslySetInnerHTML={{ __html: question.text }}
                                />
                            </div>
                            <div className="text-xs mb-1">
                                <span className="font-medium">Options:</span> {question.options.join("; ")}
                            </div>
                            <div className="text-xs mb-2">
                                <span className="font-medium">Points:</span>{" "}
                                {question.points ? JSON.stringify(question.points) : "None"}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => onEdit(question)}
                                    className="px-2 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-1 text-xs"
                                >
                                    <Icon icon="mdi:pencil" width={14} height={14} className="text-white" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleMobileDelete(question)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-1 text-xs"
                                >
                                    <Icon icon="mdi:trash-can" width={14} height={14} className="text-white" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No questions message */}
                {questions.length === 0 && (
                    <p
                        className={`text-center p-4 italic ${
                            mode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        No questions match your search or filter.
                    </p>
                )}
            </div>
        </div>
    );
}