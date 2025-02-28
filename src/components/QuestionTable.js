// src/components/QuestionTable.js
import { Icon } from "@iconify/react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = {
    QUESTION: "question",
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
        if (window.confirm(`Are you sure you want to delete the question: "${question.text}"?`)) {
            deleteQuestion(question.id, question.text);
        }
    };

    return (
        <tr
            ref={(node) => drag(drop(node))}
            className={`border-b hover:bg-opacity-80 transition duration-200 cursor-move ${
                mode === "dark"
                    ? `border-gray-700 hover:bg-gray-700 ${isOver ? "bg-gray-600" : ""}`
                    : `border-gray-200 hover:bg-gray-50 ${isOver ? "bg-gray-200" : ""}`
            }`}
        >
            <td className="p-4 w-12">
                <Icon icon="mdi:drag" width={20} height={20} className="text-gray-500" />
            </td>
            <td className="p-4 text-sm">{question.order + 1}</td> {/* Ensure 1-based numbering */}
            <td className="p-4 text-sm">
                <div className="prose max-w-none line-clamp-2" dangerouslySetInnerHTML={{ __html: question.text }} />
            </td>
            <td className="p-4 text-sm">{question.options.join(", ")}</td>
            <td className="p-4 text-sm">{question.points ? JSON.stringify(question.points) : "None"}</td>
            <td className="p-4 text-sm flex gap-2">
                <button
                    onClick={() => onEdit(question)}
                    className="px-3 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2"
                >
                    <Icon icon="mdi:pencil" width={16} height={16} />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-2"
                >
                    <Icon icon="mdi:trash-can" width={16} height={16} />
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default function QuestionTable({ questions, mode, onEdit, moveQuestion, handleSort, sortField, sortDirection, deleteQuestion }) {
    return (
        <div className={`rounded-lg shadow-lg overflow-hidden ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                    <tr className={`${mode === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <th className="p-4 w-12"></th>
                        <th
                            className="p-4 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => handleSort("order")}
                        >
                            Order{" "}
                            {sortField === "order" && (
                                <Icon
                                    icon={sortDirection === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}
                                    width={16}
                                    height={16}
                                    className="inline"
                                />
                            )}
                        </th>
                        <th
                            className="p-4 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => handleSort("text")}
                        >
                            Question{" "}
                            {sortField === "text" && (
                                <Icon
                                    icon={sortDirection === "asc" ? "mdi:arrow-up" : "mdi:arrow-down"}
                                    width={16}
                                    height={16}
                                    className="inline"
                                />
                            )}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold">Options</th>
                        <th className="p-4 text-left text-sm font-semibold">Points</th>
                        <th className="p-4 text-left text-sm font-semibold">Actions</th>
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
                {questions.length === 0 && (
                    <p className={`text-center p-4 italic ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        No questions match your search or filter.
                    </p>
                )}
            </div>
        </div>
    );
}