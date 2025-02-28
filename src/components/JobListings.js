// src/components/JobListings.js
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function JobListings({ mode, jobs, onJobDeleted }) {
    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the job opening: "${title}"?`)) {
            const { error } = await supabase.from("job_openings").delete().eq("id", id);
            if (error) {
                toast.error("Failed to delete job opening.");
                console.error("Delete error:", error);
            } else {
                toast.success("Job opening deleted successfully!", { icon: "🗑️" });
                onJobDeleted();
            }
        }
    };

    return (
        <div
            className={`p-6 rounded-lg shadow-lg mb-8 border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                    <tr className={`${mode === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <th className="p-4 text-left text-sm font-semibold">Title</th>
                        <th className="p-4 text-left text-sm font-semibold">Expires On</th>
                        <th className="p-4 text-left text-sm font-semibold">Status</th>
                        <th className="p-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobs.map((job) => (
                        <tr
                            key={job.id}
                            className={`border-b hover:bg-opacity-80 transition duration-200 ${
                                mode === "dark"
                                    ? "border-gray-700 hover:bg-gray-700"
                                    : "border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <td className="p-4 text-sm">{job.title}</td>
                            <td className="p-4 text-sm">
                                {new Date(job.expires_on).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-sm">{job.is_expired ? "Expired" : "Active"}</td>
                            <td className="p-4 text-sm flex gap-2">
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("openJobModal", {detail: job.title})
                                        )
                                    }
                                    className="px-3 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2"
                                >
                                    <Icon icon="mdi:eye" width={16} height={16}/>
                                    View
                                </button>
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("editJobModal", {detail: job})
                                        )
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-2"
                                >
                                    <Icon icon="mdi:pencil" width={16} height={16}/>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id, job.title)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-2"
                                >
                                    <Icon icon="mdi:trash-can" width={16} height={16}/>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {jobs.length === 0 && (
                    <p
                        className={`text-center p-4 italic ${
                            mode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        No job openings available.
                    </p>
                )}
            </div>
        </div>
    );
}