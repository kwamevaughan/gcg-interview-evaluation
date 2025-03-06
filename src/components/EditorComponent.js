"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Safely import Jodit
const JoditEditor = dynamic(() => 
    import("jodit-react").then((mod) => {
        // Fallback to default export or named export
        return mod.default || mod.JoditEditor;
    }), 
    { 
        ssr: false,
        loading: () => <p>Loading editor...</p>
    }
);

export default function EditorComponent({
    initialValue = "",
    onBlur,
    mode = "light",
}) {
    const [content, setContent] = useState(initialValue);
    const editorRef = useRef(null);

    // Comprehensive configuration with fallback mechanisms
    const config = {
        readonly: false,
        height: 400,
        width: '100%',
        theme: mode === "dark" ? "dark" : "default",
        placeholder: "Type your email content here...",
        
        // Enhanced HTML handling
        allowHTML: true,
        enter: 'P',
        
        // Disable problematic features
        usePopup: false,
        useAceEditor: false,
        
        // Custom event handling
        events: {
            // Attempt to set initial content safely
            afterInit: (editor) => {
                try {
                    if (initialValue) {
                        // Multiple methods to set content
                        editor.value = initialValue;
                    }
                } catch (error) {
                    console.error("Error in afterInit:", error);
                }
            }
        }
    };

    // Effect to manage content updates
    useEffect(() => {
        console.log("Initial value update:", initialValue);
        
        // Update local state
        setContent(initialValue);
        
        // Attempt to update editor if initialized
        try {
            const currentEditor = editorRef.current?.editor;
            if (currentEditor) {
                currentEditor.value = initialValue;
            }
        } catch (error) {
            console.error("Content update error:", error);
        }
    }, [initialValue]);

    // Handle content changes
    const handleBlur = (newContent) => {
        console.log("Editor content on blur:", newContent);
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
                className={`shadow-md rounded-lg ${
                    mode === "dark"
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-gray-50 text-black"
                }`}
            />
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-sm text-gray-500">
                    <div>Debug - Content Length: {content?.length || 0}</div>
                    <div>Debug - First 200 chars: {content?.substring(0, 200) || 'No content'}</div>
                </div>
            )}
        </div>
    );
}