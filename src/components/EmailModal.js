// src/components/EmailModal.js
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// Client-only Editor component
const EditorComponent = dynamic(() => import('./EditorComponent'), { ssr: false });

export default function EmailModal({ candidate, isOpen, onClose, emailData, setEmailData, onSend, mode }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const handleSendClick = () => {
        if (!emailData.subject.trim()) {
            toast.error("Please add a subject to your email");
            return;
        }

        if (!emailData.body.trim()) {
            toast.error("Please add content to your email");
            return;
        }

        onSend();
    };

    if (!isOpen || !candidate) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-xl max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 animate-fade-in flex flex-col max-h-[80vh]`}>
                <div className="bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Icon icon="mdi:email" className="w-8 h-8 text-white mr-3" />
                        <h2 className="text-2xl font-bold text-white">Send Email to {candidate.full_name}</h2>
                    </div>
                    <button onClick={handleClose} className="text-white hover:text-gray-200 transition duration-200">
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-200" : "text-[#231812]"}`}>To</label>
                            <input
                                type="email"
                                value={candidate.email}
                                readOnly
                                className={`w-full p-2 border rounded-lg ${mode === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-[#231812]"}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-200" : "text-[#231812]"}`}>Subject</label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${mode === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white"}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-200" : "text-[#231812]"}`}>
                                Body
                                {isSaving && <span className="ml-2 text-xs text-gray-400">(Saving...)</span>}
                            </label>
                            <EditorComponent
                                emailData={emailData}
                                setEmailData={setEmailData}
                                setIsSaving={setIsSaving}
                                mode={mode}
                            />
                        </div>
                    </div>
                </div>
                <div className={`sticky bottom-0 ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-4 border-t rounded-b-xl shadow-md`}>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleClose}
                            className={`px-6 py-2 ${mode === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-[#231812] hover:bg-gray-300"} rounded-full transition duration-200 flex items-center gap-2 shadow-md`}
                        >
                            <Icon icon="mdi:close" width={20} height={20} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSendClick}
                            className="px-6 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2 shadow-md"
                        >
                            <Icon icon="mdi:send" width={20} height={20} />
                            Send Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}