import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function JobListings({ mode, jobs, onJobDeleted }) {
    const handleDelete = (id, title) => {
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 flex-1">
                                <p className="text-xl font-medium text-gray-900">Delete Job Opening?</p>
                                <p className="mt-2 text-base text-gray-500">
                                    Are you sure you want to delete the job opening "{title}"?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const { error } = await supabase.from("job_openings").delete().eq("id", id);
                                if (error) {
                                    toast.error("Failed to delete job opening.");
                                    console.error("Delete error:", error);
                                } else {
                                    toast.success("Job opening deleted successfully!", { icon: "🗑️" });
                                    onJobDeleted();
                                }
                            }}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors focus:outline-none"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors focus:outline-none"
                        >
                            No
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    };

    return (
        <div
            className={`p-4 sm:p-6 rounded-lg shadow-lg mb-8 border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800 border-[#f05d23]" : "bg-white border-[#f05d23]"
            }`}
        >
            <div className="max-h-[500px] overflow-y-auto">
                {/* Table for larger screens */}
                <table className="w-full hidden sm:table">
                    <thead className="sticky top-0 z-10">
                    <tr className={`${mode === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <th
                            className={`p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold ${
                                mode === "dark" ? "text-gray-200" : "text-gray-600"
                            }`}
                        >
                            Title
                        </th>
                        <th
                            className={`p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold ${
                                mode === "dark" ? "text-gray-200" : "text-gray-600"
                            }`}
                        >
                            Expires On
                        </th>
                        <th
                            className={`p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold ${
                                mode === "dark" ? "text-gray-200" : "text-gray-600"
                            }`}
                        >
                            Status
                        </th>
                        <th
                            className={`p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold ${
                                mode === "dark" ? "text-gray-200" : "text-gray-600"
                            }`}
                        >
                            Actions
                        </th>
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
                            <td
                                className={`p-2 sm:p-4 text-xs sm:text-sm ${
                                    mode === "dark" ? "text-gray-300" : "text-gray-800"
                                }`}
                            >
                                {job.title}
                            </td>
                            <td
                                className={`p-2 sm:p-4 text-xs sm:text-sm ${
                                    mode === "dark" ? "text-gray-300" : "text-gray-800"
                                }`}
                            >
                                {new Date(job.expires_on).toLocaleDateString()}
                            </td>
                            <td
                                className={`p-2 sm:p-4 text-xs sm:text-sm ${
                                    mode === "dark" ? "text-gray-300" : "text-gray-800"
                                }`}
                            >
                                {job.is_expired ? "Expired" : "Active"}
                            </td>
                            <td className="p-2 sm:p-4 text-xs sm:text-sm flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("openJobModal", { detail: job.title })
                                        )
                                    }
                                    className="px-2 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-1 text-xs sm:text-sm"
                                >
                                    <Icon icon="mdi:eye" width={14} height={14} />
                                    View
                                </button>
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("editJobModal", { detail: job })
                                        )
                                    }
                                    className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-1 text-xs sm:text-sm"
                                >
                                    <Icon icon="mdi:pencil" width={14} height={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id, job.title)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-1 text-xs sm:text-sm"
                                >
                                    <Icon icon="mdi:trash-can" width={14} height={14} />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Card layout for mobile */}
                <div className="sm:hidden space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className={`p-4 rounded-lg border ${
                                mode === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-300"
                                    : "bg-gray-50 border-gray-200 text-gray-800"
                            }`}
                        >
                            <div className="text-sm font-semibold mb-2">{job.title}</div>
                            <div className="text-xs mb-1">
                                <span className="font-medium">Expires:</span>{" "}
                                {new Date(job.expires_on).toLocaleDateString()}
                            </div>
                            <div className="text-xs mb-2">
                                <span className="font-medium">Status:</span>{" "}
                                {job.is_expired ? "Expired" : "Active"}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("openJobModal", { detail: job.title })
                                        )
                                    }
                                    className="px-2 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-1 text-xs"
                                >
                                    <Icon icon="mdi:eye" width={14} height={14} />
                                    View
                                </button>
                                <button
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new CustomEvent("editJobModal", { detail: job })
                                        )
                                    }
                                    className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-1 text-xs"
                                >
                                    <Icon icon="mdi:pencil" width={14} height={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id, job.title)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-1 text-xs"
                                >
                                    <Icon icon="mdi:trash-can" width={14} height={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No jobs message */}
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