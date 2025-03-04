"use client";

import { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";

export default function EditorComponent({
                                            initialValue,
                                            onBlur,
                                            mode,
                                            holderId = "jodit-editor",
                                        }) {
    const editorRef = useRef(null);
    const [content, setContent] = useState(initialValue || "");

    const config = {
        readonly: false,
        height: 300,
        theme: mode === "dark" ? "dark" : "default",
        placeholder: "Type your question here...",
    };

    useEffect(() => {
        console.log("EditorComponent mounted with initialValue:", initialValue);
        setContent(initialValue || "");
        return () => {
            console.log("EditorComponent unmounted");
        };
    }, [initialValue]);

    const handleBlur = (newContent) => {
        console.log("Jodit content blurred with:", newContent);
        setContent(newContent);
        onBlur(newContent);
    };

    return (
        <div className="w-full">
            <JoditEditor
                ref={editorRef}
                value={content}
                config={config}
                onBlur={handleBlur}
                className={`shadow-md rounded-lg p-4 ${
                    mode === "dark"
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-gray-50 text-black"
                }`}
            />
        </div>
    );
}