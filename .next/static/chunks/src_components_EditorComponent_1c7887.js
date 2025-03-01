(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_components_EditorComponent_1c7887.js", {

"[project]/src/components/EditorComponent.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/EditorComponent.js
__turbopack_esm__({
    "default": (()=>EditorComponent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$editorjs$2f$dist$2f$editorjs$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@editorjs/editorjs/dist/editorjs.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$header$2f$dist$2f$header$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@editorjs/header/dist/header.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$list$2f$dist$2f$editorjs$2d$list$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@editorjs/list/dist/editorjs-list.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$paragraph$2f$dist$2f$paragraph$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@editorjs/paragraph/dist/paragraph.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
function EditorComponent({ emailData, setEmailData, setIsSaving, mode }) {
    _s();
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false); // Track initial mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditorComponent.useEffect": ()=>{
            if (!isMounted.current) {
                initializeEditor();
                isMounted.current = true;
            }
            return ({
                "EditorComponent.useEffect": ()=>{
                    cleanupEditor();
                }
            })["EditorComponent.useEffect"];
        }
    }["EditorComponent.useEffect"], []); // Empty dependency array to run only once on mount
    const initializeEditor = ()=>{
        console.log("Initializing EditorJS with body:", emailData.body);
        const holderElement = document.getElementById("editorjs");
        if (!holderElement) {
            console.error("Element with ID 'editorjs' is missing.");
            return;
        }
        cleanupEditor();
        try {
            editorRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$editorjs$2f$dist$2f$editorjs$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"]({
                holder: "editorjs",
                tools: {
                    header: {
                        class: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$header$2f$dist$2f$header$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
                        inlineToolbar: true
                    },
                    list: {
                        class: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$list$2f$dist$2f$editorjs$2d$list$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
                        inlineToolbar: true
                    },
                    paragraph: {
                        class: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$editorjs$2f$paragraph$2f$dist$2f$paragraph$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
                        inlineToolbar: true,
                        config: {
                            preserveBlank: true
                        }
                    }
                },
                data: {
                    blocks: emailData.body ? parseHtmlToBlocks(emailData.body) : [
                        {
                            type: "paragraph",
                            data: {
                                text: "Start typing your email here..."
                            }
                        }
                    ]
                },
                onChange: async ()=>{
                    await handleEditorChange();
                }
            });
            console.log("EditorJS initialized successfully.");
        } catch (error) {
            console.error("Error initializing EditorJS:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Failed to load email editor. Please try again.");
        }
    };
    const cleanupEditor = ()=>{
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
    const parseHtmlToBlocks = (html)=>{
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const paragraphs = doc.querySelectorAll("p");
        const blocks = Array.from(paragraphs).map((p)=>({
                type: "paragraph",
                data: {
                    text: p.innerHTML || p.textContent
                }
            }));
        return blocks.length > 0 ? blocks : [
            {
                type: "paragraph",
                data: {
                    text: html || "Start typing your email here..."
                }
            }
        ];
    };
    const handleEditorChange = async ()=>{
        if (!editorRef.current) return;
        try {
            setIsSaving(true);
            const content = await editorRef.current.save();
            console.log("Editor content saved:", content);
            const html = content.blocks.map((block)=>{
                switch(block.type){
                    case "header":
                        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                    case "list":
                        const items = block.data.items.map((item)=>`<li>${item}</li>`).join("");
                        return block.data.style === "ordered" ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
                    case "paragraph":
                        return `<p>${block.data.text || ""}</p>`;
                    default:
                        return "";
                }
            }).join("\n");
            setEmailData((prev)=>({
                    ...prev,
                    body: html
                }));
            setIsSaving(false);
        } catch (error) {
            console.error("Error saving content from EditorJS:", error);
            setIsSaving(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"].error("Error saving email content.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "editorjs",
        className: `border rounded-lg p-2 min-h-[200px] ${mode === "dark" ? "border-gray-600 bg-gray-700" : ""}`
    }, void 0, false, {
        fileName: "[project]/src/components/EditorComponent.js",
        lineNumber: 133,
        columnNumber: 9
    }, this);
}
_s(EditorComponent, "SDPHTuGdlP9n60RjEH9GYRKaFXo=");
_c = EditorComponent;
var _c;
__turbopack_refresh__.register(_c, "EditorComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_components_EditorComponent_1c7887.js.map