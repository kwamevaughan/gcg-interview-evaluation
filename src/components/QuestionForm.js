// src/components/QuestionForm.js
"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TiptapToolbar from "./TiptapToolbar";

export default function QuestionForm({ mode, question, onSubmit, onCancel }) {
    const [text, setText] = useState(question?.text || "");
    const [options, setOptions] = useState(question?.options.join("\n") || "");
    const [optionPoints, setOptionPoints] = useState(question?.points || {});
    const [isMultiSelect, setIsMultiSelect] = useState(
        question?.points && "base" in question.points
    );
    const [basePoints, setBasePoints] = useState(
        question?.points && "base" in question.points ? question.points.base : 5
    );
    const [extraPoints, setExtraPoints] = useState(
        question?.points && "extra" in question.points ? question.points.extra : 2
    );
    const [maxPoints, setMaxPoints] = useState(
        question?.points && "max" in question.points ? question.points.max : 10
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Ensure the initial paragraph has a minimum height
                paragraph: {
                    HTMLAttributes: {
                        class: "",
                    },
                },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: question?.text || "<p>Type your question here...</p>", // Placeholder for new questions
        onUpdate: ({ editor }) => {
            setText(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (question && editor) {
            editor.commands.setContent(question.text || "<p>Type your question here...</p>");
            setText(question.text || "");
            setOptions(question.options.join("\n") || "");
            setOptionPoints(question.points || {});
            setIsMultiSelect(question.points && "base" in question.points);
            setBasePoints(question.points && "base" in question.points ? question.points.base : 5);
            setExtraPoints(question.points && "extra" in question.points ? question.points.extra : 2);
            setMaxPoints(question.points && "max" in question.points ? question.points.max : 10);
        }
    }, [question, editor]);

    useEffect(() => {
        if (editor && editor.isEditable) {
            // Delay focus slightly to ensure editor is fully rendered
            const timer = setTimeout(() => {
                editor.chain().focus().run();
            }, 50);
            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [editor]);

    const handleOptionChange = (e) => {
        const newOptions = e.target.value;
        setOptions(newOptions);
        const optionsArray = newOptions
            .split("\n")
            .map((opt) => opt.trim())
            .filter((opt) => opt);
        const updatedPoints = {};
        optionsArray.forEach((opt) => {
            updatedPoints[opt] = optionPoints[opt] || 0;
        });
        setOptionPoints(updatedPoints);
    };

    const handlePointChange = (option, value) => {
        setOptionPoints((prev) => ({
            ...prev,
            [option]: parseInt(value) || 0,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const optionsArray = options
            .split("\n")
            .map((opt) => opt.trim())
            .filter((opt) => opt);
        let pointsData = {};
        if (isMultiSelect) {
            pointsData = { base: basePoints, extra: extraPoints, max: maxPoints };
        } else {
            pointsData = optionsArray.reduce((acc, opt) => {
                acc[opt] = parseInt(optionPoints[opt]) || 0;
                return acc;
            }, {});
        }

        if (!text || text === "<p>Type your question here...</p>" || optionsArray.length === 0) {
            toast.error("Please provide a question and at least one option.");
            return;
        }

        const success = question
            ? await onSubmit(question.id, text, optionsArray, JSON.stringify(pointsData))
            : await onSubmit(text, optionsArray, JSON.stringify(pointsData));
        if (success) {
            onCancel();
        }
    };

    const optionsArray = options
        .split("\n")
        .map((opt) => opt.trim())
        .filter((opt) => opt);

    return (
        <div
            className={`p-6 rounded-lg shadow-lg mb-8 border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex justify-between items-center mb-4">
                <h4
                    className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}
                >
                    {question ? "Edit Question" : "Add New Question"}
                </h4>
                <div className="relative group">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-[#f05d23] font-bold hover:text-gray-700 focus:outline-none p-2 transition-all duration-100 ease-in-out transform hover:scale-105"
                    >
                        <Icon icon="mdi:close" width={30} height={30} />
                    </button>
                    <span
                        className="absolute left-1/2 transform -translate-x-1/2 bottom-full text-xs text-white bg-black rounded px-4 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                    >
                        Cancel
                    </span>
                </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <label
                        className={`block text-sm font-medium mb-2 ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                        }`}
                    >
                        Question Text <span className="text-red-500">*</span>
                    </label>
                    <TiptapToolbar editor={editor} mode={mode} />
                    <EditorContent
                        editor={editor}
                        className={`border rounded-lg p-3 min-h-[150px] ${
                            mode === "dark"
                                ? "bg-gray-700 text-gray-200 border-gray-600 caret-white"
                                : "bg-white text-[#231812] border-gray-300 caret-black"
                        }`}
                        onClick={() => editor?.chain().focus().run()}
                    />
                </div>
                <div>
                    <label
                        className={`block text-sm font-medium mb-2 ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                        }`}
                    >
                        Options (one per line) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={options}
                        onChange={handleOptionChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 min-h-[150px] ${
                            mode === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300 text-[#231812]"
                        }`}
                        placeholder="Enter each option on a new line...\nE.g.,\nYes\nNo, with a comma\nMaybe"
                        required
                    />
                    <label
                        className={`inline-flex items-center gap-2 mt-4 mb-4 cursor-pointer hover:text-[#f05d23] ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={isMultiSelect}
                            onChange={(e) => setIsMultiSelect(e.target.checked)}
                            className="hidden"
                        />
                        <span>Allow multiple selections</span>
                        <Icon
                            icon={isMultiSelect ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
                            width={20}
                            height={20}
                        />
                    </label>
                    {isMultiSelect ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <label
                                    className={`flex-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}
                                >
                                    Base Points (first selection)
                                </label>
                                <input
                                    type="number"
                                    value={basePoints}
                                    onChange={(e) => setBasePoints(parseInt(e.target.value) || 0)}
                                    className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                        mode === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-gray-50 border-gray-300 text-[#231812]"
                                    }`}
                                    min="0"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label
                                    className={`flex-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}
                                >
                                    Extra Points (per additional selection)
                                </label>
                                <input
                                    type="number"
                                    value={extraPoints}
                                    onChange={(e) => setExtraPoints(parseInt(e.target.value) || 0)}
                                    className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                        mode === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-gray-50 border-gray-300 text-[#231812]"
                                    }`}
                                    min="0"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label
                                    className={`flex-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}
                                >
                                    Max Points
                                </label>
                                <input
                                    type="number"
                                    value={maxPoints}
                                    onChange={(e) => setMaxPoints(parseInt(e.target.value) || 0)}
                                    className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                        mode === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-gray-50 border-gray-300 text-[#231812]"
                                    }`}
                                    min="0"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {optionsArray.map((option) => (
                                <div key={option} className="flex items-center gap-4">
                                    <span
                                        className={`flex-1 ${
                                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                                        }`}
                                    >
                                        {option}
                                    </span>
                                    <input
                                        type="number"
                                        value={optionPoints[option] || ""}
                                        onChange={(e) => handlePointChange(option, e.target.value)}
                                        className={`w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition duration-200 ${
                                            mode === "dark"
                                                ? "bg-gray-700 border-gray-600 text-white"
                                                : "bg-gray-50 border-gray-300 text-[#231812]"
                                        }`}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 shadow-md flex items-center justify-center gap-2"
                    >
                        <Icon icon={question ? "mdi:pencil" : "mdi:plus"} width={20} height={20} />
                        {question ? "Update Question" : "Add Question"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 shadow-md flex items-center justify-center gap-2"
                    >
                        <Icon icon="mdi:close" width={20} height={20} />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}