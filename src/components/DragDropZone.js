// src/components/DragDropZone.js
import { Icon } from "@iconify/react";

export default function DragDropZone({
                                         type,
                                         file,
                                         isDragging,
                                         uploadProgress,
                                         isSubmitting,
                                         handleFileChange,
                                         handleDrop,
                                         handleDragOver,
                                         handleDragLeave,
                                         removeFile,
                                         mode,
                                         required, // New prop to indicate mandatory status
                                     }) {
    return (
        <div
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={(e) => handleDragOver(e, type)}
            onDragLeave={(e) => handleDragLeave(e, type)}
            className={`p-6 flex justify-center border-2 border-dashed rounded-xl transition-all duration-300 transform ${
                isDragging
                    ? "border-[#f05d23] bg-orange-50 scale-105"
                    : mode === "dark"
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-white"
            }`}
        >
            {!file ? (
                <div className="text-center">
                    <span
                        className={`inline-flex justify-center items-center w-12 h-12 rounded-full mb-4 ${
                            mode === "dark" ? "bg-gray-600 text-[#f05d23]" : "bg-gray-100 text-[#f05d23]"
                        }`}
                    >
                        <Icon icon="mdi:upload" className="w-6 h-6" />
                    </span>
                    <div
                        className={`text-sm ${
                            mode === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        <span className={`font-medium ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                            {type === "resume" ? "Resume" : "Cover Letter"}{" "}
                            <span className="text-red-500">*</span> - Drop your file here or{" "}
                        </span>
                        <input
                            type="file"
                            name={type}
                            accept=".pdf,.docx"
                            onChange={(e) => handleFileChange(e, type)}
                            className="hidden"
                            id={`${type}-upload`}
                            required={required}
                        />
                        <label
                            htmlFor={`${type}-upload`}
                            className="font-semibold text-[#f05d23] hover:text-[#d94f1e] cursor-pointer transition"
                        >
                            browse
                        </label>
                    </div>
                    <p className={`mt-1 text-xs ${mode === "dark" ? "text-gray-500" : "text-gray-400"}`}>PDF or DOCX, max 5MB</p>
                </div>
            ) : (
                <div
                    className={`w-full p-4 border rounded-xl shadow-sm ${
                        mode === "dark" ? "bg-gray-600 border-gray-500" : "bg-gray-50 border-gray-300"
                    }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-x-3">
                            <span
                                className={`w-10 h-10 flex justify-center items-center border rounded-lg ${
                                    mode === "dark" ? "border-gray-500 text-[#f05d23]" : "border-gray-200 text-[#f05d23]"
                                }`}
                            >
                                {file.name.endsWith(".pdf") ? (
                                    <Icon icon="mdi:file-pdf" className="w-5 h-5" />
                                ) : (
                                    <Icon icon="mdi:file-word" className="w-5 h-5" />
                                )}
                            </span>
                            <div>
                                <p
                                    className={`text-sm font-medium truncate max-w-[200px] ${
                                        mode === "dark" ? "text-white" : "text-[#231812]"
                                    }`}
                                >
                                    {file.name}
                                </p>
                                <p
                                    className={`text-xs ${
                                        mode === "dark" ? "text-gray-400" : "text-gray-500"
                                    }`}
                                >
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeFile(type)}
                            className={`transition ${
                                mode === "dark" ? "text-gray-300 hover:text-[#f05d23]" : "text-gray-500 hover:text-[#f05d23]"
                            }`}
                        >
                            <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                        </button>
                    </div>
                    {isSubmitting && (
                        <div className="flex items-center gap-x-3">
                            <div
                                className={`w-full h-2 rounded-full overflow-hidden ${
                                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                                }`}
                            >
                                <div
                                    className="h-full bg-[#f05d23] rounded-full transition-all duration-500"
                                    style={{ width: `${uploadProgress[type]}%` }}
                                />
                            </div>
                            <div className="w-10 text-end">
                                <span
                                    className={`text-sm ${
                                        mode === "dark" ? "text-white" : "text-[#231812]"
                                    }`}
                                >
                                    {uploadProgress[type]}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}