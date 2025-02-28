// src/components/EditorComponent.js
"use client";

import { useEffect, useRef } from "react";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import toast from "react-hot-toast";

export default function EditorComponent({ emailData, setEmailData, setIsSaving, mode }) {
    const editorRef = useRef(null);
    const isMounted = useRef(false); // Track initial mount

    useEffect(() => {
        if (!isMounted.current) {
            initializeEditor();
            isMounted.current = true;
        }

        return () => {
            cleanupEditor();
        };
    }, []); // Empty dependency array to run only once on mount

    const initializeEditor = () => {
        console.log("Initializing EditorJS with body:", emailData.body);

        const holderElement = document.getElementById("editorjs");
        if (!holderElement) {
            console.error("Element with ID 'editorjs' is missing.");
            return;
        }

        cleanupEditor();

        try {
            editorRef.current = new EditorJS({
                holder: "editorjs",
                tools: {
                    header: { class: Header, inlineToolbar: true },
                    list: { class: List, inlineToolbar: true },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                        config: {
                            preserveBlank: true, // Preserve blank lines
                        },
                    },
                },
                data: {
                    blocks: emailData.body
                        ? parseHtmlToBlocks(emailData.body)
                        : [
                            {
                                type: "paragraph",
                                data: { text: "Start typing your email here..." },
                            },
                        ],
                },
                onChange: async () => {
                    await handleEditorChange();
                },
            });
            console.log("EditorJS initialized successfully.");
        } catch (error) {
            console.error("Error initializing EditorJS:", error);
            toast.error("Failed to load email editor. Please try again.");
        }
    };

    const cleanupEditor = () => {
        if (editorRef.current && typeof editorRef.current.destroy === "function") {
            try {
                editorRef.current.destroy();
                editorRef.current = null;
                console.log("EditorJS instance destroyed.");
            } catch (error) {
                console.error("Error destroying EditorJS instance:", error);
            }
        }
    };

    const parseHtmlToBlocks = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const paragraphs = doc.querySelectorAll("p");
        const blocks = Array.from(paragraphs).map(p => ({
            type: "paragraph",
            data: { text: p.innerHTML || p.textContent },
        }));
        return blocks.length > 0 ? blocks : [
            {
                type: "paragraph",
                data: { text: html || "Start typing your email here..." },
            },
        ];
    };

    const handleEditorChange = async () => {
        if (!editorRef.current) return;

        try {
            setIsSaving(true);
            const content = await editorRef.current.save();
            console.log("Editor content saved:", content);

            const html = content.blocks
                .map((block) => {
                    switch (block.type) {
                        case "header":
                            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                        case "list":
                            const items = block.data.items.map((item) => `<li>${item}</li>`).join("");
                            return block.data.style === "ordered" ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
                        case "paragraph":
                            return `<p>${block.data.text || ""}</p>`;
                        default:
                            return "";
                    }
                })
                .join("\n");
            setEmailData((prev) => ({ ...prev, body: html }));
            setIsSaving(false);
        } catch (error) {
            console.error("Error saving content from EditorJS:", error);
            setIsSaving(false);
            toast.error("Error saving email content.");
        }
    };

    return (
        <div id="editorjs" className={`border rounded-lg p-2 min-h-[200px] ${mode === "dark" ? "border-gray-600 bg-gray-700" : ""}`}></div>
    );
}