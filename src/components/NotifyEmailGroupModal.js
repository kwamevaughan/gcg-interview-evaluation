import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const NotifyEmailGroupModal = ({ isOpen, onClose, jobTitle, jobId, expiresOn, mode }) => {
    const [emailGroups, setEmailGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetch("/api/email-groups")
                .then((res) => res.json())
                .then((data) => setEmailGroups(data))
                .catch(() => toast.error("Failed to load email groups"));
        }
    }, [isOpen]);

    const handleNotify = async () => {
        if (!selectedGroup) {
            toast.error("Please select an email group");
            return;
        }

        const notifyingToast = toast.loading("Notifying group...");
        try {
            const response = await fetch("/api/notify-email-group", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId: selectedGroup, jobTitle, jobId, expiresOn }), // Add expiresOn
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to notify");

            toast.success("Group notified successfully!", { id: notifyingToast });
            onClose();
        } catch (error) {
            toast.error(error.message, { id: notifyingToast });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className={`p-6 rounded-lg shadow-lg max-w-md w-full ${
                    mode === "dark" ? "bg-gray-800" : "bg-white"
                }`}
            >
                <h2
                    className={`text-xl font-bold mb-4 ${
                        mode === "dark" ? "text-white" : "text-[#231812]"
                    }`}
                >
                    Notify Email Group
                </h2>
                <p
                    className={`mb-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                    Job "{jobTitle}" has been posted. Would you like to notify an email group?
                </p>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className={`w-full p-2 border rounded mb-4 ${
                        mode === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-[#231812]"
                    }`}
                >
                    <option value="">Select a group</option>
                    {emailGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded ${
                            mode === "dark"
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleNotify}
                        className="px-4 py-2 bg-[#f05d23] text-white rounded hover:bg-[#d94f1e]"
                    >
                        Notify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotifyEmailGroupModal;