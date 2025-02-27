// src/components/Step3Documents.js
import DragDropZone from "./DragDropZone";
import { Icon } from "@iconify/react";

export default function Step3Documents({
                                           formData,
                                           setFormData,
                                           isSubmitting,
                                           uploadProgress,
                                           setUploadProgress,
                                           mode,
                                           ...fileUploadProps
                                       }) {
    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div
                className={`shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${
                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                }`}
            >
                <div className="flex items-center justify-center mb-6">
                    <Icon icon="mdi:upload" className="w-8 h-8 text-[#f05d23] mr-2" />
                    <h2 className="text-3xl font-bold text-center">Submit Your Documents</h2>
                </div>
                <p
                    className={`text-center mb-8 italic ${
                        mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                    Please upload both your resume and cover letter to complete your application. Both fields are required.
                </p>
                <div className="space-y-6">
                    <DragDropZone
                        type="resume"
                        file={formData.resume}
                        isDragging={fileUploadProps.isDraggingResume}
                        uploadProgress={uploadProgress}
                        isSubmitting={isSubmitting}
                        setFormData={setFormData}
                        setUploadProgress={setUploadProgress}
                        mode={mode}
                        required // Indicate it's mandatory
                        {...fileUploadProps}
                    />
                    <DragDropZone
                        type="coverLetter"
                        file={formData.coverLetter}
                        isDragging={fileUploadProps.isDraggingCoverLetter}
                        uploadProgress={uploadProgress}
                        isSubmitting={isSubmitting}
                        setFormData={setFormData}
                        setUploadProgress={setUploadProgress}
                        mode={mode}
                        required // Indicate it's mandatory
                        {...fileUploadProps}
                    />
                </div>
            </div>
        </div>
    );
}