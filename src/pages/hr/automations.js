import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import useStatusChange from "@/hooks/useStatusChange";
import EmailModal from "@/components/EmailModal";
import { fetchHRData } from "../../../utils/hrData";
import { useEmailTemplates } from "@/hooks/useEmailTemplates";

export default function Automations({ mode = "light", toggleMode, initialCandidates, initialTemplates }) {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [automations, setAutomations] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState({ subject: "", body: "" });

    const { templates: emailTemplates } = useEmailTemplates(initialTemplates);

    const { handleStatusChange } = useStatusChange({
        candidates: initialCandidates,
        setCandidates: () => {},
        setFilteredCandidates: () => {},
        setSelectedCandidate: () => {},
        setEmailData,
        setIsEmailModalOpen,
    });

    useEffect(() => {
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
            return;
        }
        fetchAutomations();
        console.log("Initial email templates from server:", initialTemplates);
        console.log("Email templates from hook:", emailTemplates);
    }, [router, initialTemplates]);

    const fetchAutomations = async () => {
        const { data, error } = await supabase.from("automations").select("*");
        if (error) {
            console.error("Error fetching automations:", error.message, error.details);
            toast.error(`Failed to load automations: ${error.message}`);
        } else {
            console.log("Fetched automations:", data);
            setAutomations(data || []);
        }
    };

    const saveAutomation = async (automation) => {
        const { data, error } = await supabase.from("automations").insert([automation]).select();
        if (error) {
            console.error("Error saving automation:", error.message, error.details);
            toast.error(`Failed to save automation: ${error.message}`);
        } else {
            setAutomations([...automations, data[0]]);
            toast.success("Automation activated! 🚀", { icon: "✨" });
            setIsCreating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        document.cookie = "hr_session=; path=/; max-age=0";
        toast.success("Logged out successfully!");
        setTimeout(() => router.push("/hr/login"), 1000);
    };

    const handleSendEmail = async (emailDataWithToast) => {
        const { toastId, subject, body } = emailDataWithToast;
        try {
            const response = await fetch("/api/send-status-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, body, email: "test@example.com" }),
            });
            if (!response.ok) throw new Error("Failed to send email");
            toast.dismiss(toastId);
            toast.success("Email sent successfully!", { icon: "✅" });
            setIsEmailModalOpen(false);
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Failed to send email.");
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            <Toaster position="top-center" reverseOrder={false} />
            <HRHeader
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                mode={mode}
                toggleMode={toggleMode}
                onLogout={handleLogout}
                pageName="Automations"
                pageDescription="Set up smart workflows to save time!"
            />
            <div className="flex flex-1">
                <HRSidebar
                    isOpen={isSidebarOpen}
                    mode={mode}
                    onLogout={handleLogout}
                    toggleSidebar={toggleSidebar}
                />
                <div
                    className={`flex-1 p-6 transition-all duration-300 overflow-hidden ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-6xl mx-auto space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold mb-6 flex items-center"
                        >
                            HR Automations <Icon icon="mdi:robot" className="ml-2 text-[#f05d23]" width={32} />
                        </motion.h1>
                        <div className="grid gap-4">
                            {automations.length === 0 ? (
                                <p className="text-center text-gray-500">No automations yet. Create one to get started!</p>
                            ) : (
                                automations.map((auto) => (
                                    <AutomationCard key={auto.id} automation={auto} mode={mode} />
                                ))
                            )}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`mt-4 px-6 py-3 rounded-full flex items-center gap-2 bg-[#f05d23] text-white shadow-lg`}
                            onClick={() => setIsCreating(true)}
                        >
                            <Icon icon="mdi:plus" width={20} />
                            Create Automation
                        </motion.button>
                        {isCreating && (
                            <AutomationForm
                                onSave={saveAutomation}
                                onCancel={() => setIsCreating(false)}
                                mode={mode}
                                emailTemplates={emailTemplates}
                                handleStatusChange={handleStatusChange}
                            />
                        )}
                    </div>
                </div>
            </div>
            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                emailData={emailData}
                setEmailData={setEmailData}
                onSend={handleSendEmail}
                mode={mode}
            />
            <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}

function AutomationCard({ automation, mode }) {
    const operatorIcons = {
        ">": <Icon icon="mdi:greater-than" width={16} />,
        "<": <Icon icon="mdi:less-than" width={16} />,
        "=": <Icon icon="mdi:equal" width={16} />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg shadow-lg flex justify-between items-center ${
                mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
            }`}
        >
            <p className="text-sm flex items-center gap-1">
                <span className="font-semibold">If</span> {automation.condition_field}{' '}
                {operatorIcons[automation.condition_operator]}{' '}
                {automation.condition_value},{' '}
                <span className="font-semibold">then</span> {automation.action_type}{' '}
                <span className="text-[#f05d23]">"{automation.action_value}"</span>
            </p>
            <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={automation.active} className="text-[#f05d23]" />
                <span className="text-sm">Active</span>
            </label>
        </motion.div>
    );
}

function AutomationForm({ onSave, onCancel, mode, emailTemplates, handleStatusChange }) {
    const [condition, setCondition] = useState({ field: "score", operator: ">", value: "" });
    const [action, setAction] = useState({ type: "email", value: "" });
    const [isOperatorOpen, setIsOperatorOpen] = useState(false);

    const statusOptions = ["Pending", "Reviewed", "Shortlisted", "Rejected"];
    const operatorOptions = [
        { value: ">", icon: "mdi:greater-than" },
        { value: "<", icon: "mdi:less-than" },
        { value: "=", icon: "mdi:equal" },
    ];

    const handleSubmit = () => {
        if (!condition.value || !action.value) {
            toast.error("Please fill in all fields!");
            return;
        }
        onSave({
            condition_field: condition.field,
            condition_operator: condition.operator,
            condition_value: condition.value,
            action_type: action.type,
            action_value: action.value,
            active: true,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
        >
            <div className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"}`}>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Icon icon="mdi:rocket" className="mr-2 text-[#f05d23]" width={24} />
                    New Automation
                </h2>
                <div className="space-y-6">
                    <div>
                        <label className="block font-semibold mb-1">Condition</label>
                        <div className="flex gap-2">
                            <select
                                value={condition.field}
                                onChange={(e) => setCondition({ ...condition, field: e.target.value })}
                                className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                            >
                                <option value="score">Score</option>
                                <option value="submitted_at">Submitted At (days ago)</option>
                                <option value="status">Status</option>
                            </select>
                            <div className="relative w-20">
                                <button
                                    onClick={() => setIsOperatorOpen(!isOperatorOpen)}
                                    className={`p-2 rounded-lg border w-full flex items-center justify-center ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    <Icon icon={operatorOptions.find((opt) => opt.value === condition.operator)?.icon} width={16} />
                                </button>
                                {isOperatorOpen && (
                                    <div className={`absolute mt-1 w-full rounded-lg shadow-lg z-10 ${mode === "dark" ? "bg-gray-700" : "bg-white"}`}>
                                        {operatorOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setCondition({ ...condition, operator: opt.value });
                                                    setIsOperatorOpen(false);
                                                }}
                                                className={`p-2 w-full flex justify-center hover:${mode === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
                                            >
                                                <Icon icon={opt.icon} width={16} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={condition.value}
                                onChange={(e) => setCondition({ ...condition, value: e.target.value })}
                                className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                placeholder="e.g., 120"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Action</label>
                        <div className="flex gap-2">
                            <select
                                value={action.type}
                                onChange={(e) => setAction({ ...action, type: e.target.value, value: "" })}
                                className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                            >
                                <option value="email">Send Email</option>
                                <option value="status">Update Status</option>
                                <option value="notify">Notify Team</option>
                            </select>
                            {action.type === "email" && (
                                <select
                                    value={action.value}
                                    onChange={(e) => setAction({ ...action, value: e.target.value })}
                                    className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    <option value="">Select Template</option>
                                    {emailTemplates.map((template) => (
                                        <option key={template.id} value={template.name}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {action.type === "status" && (
                                <select
                                    value={action.value}
                                    onChange={(e) => setAction({ ...action, value: e.target.value })}
                                    className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {action.type === "notify" && (
                                <input
                                    type="text"
                                    value={action.value}
                                    onChange={(e) => setAction({ ...action, value: e.target.value })}
                                    className={`p-2 rounded-lg border flex-1 ${mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
                                    placeholder="e.g., Slack channel"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#f05d23] text-white rounded-full flex items-center gap-2"
                    >
                        <Icon icon="mdi:rocket-launch" width={20} />
                        Activate
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCancel}
                        className={`px-6 py-2 rounded-full ${mode === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                    >
                        Cancel
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;
    if (!req.cookies.hr_session) {
        return { redirect: { destination: "/hr/login", permanent: false } };
    }



    const { initialCandidates } = await fetchHRData({ fetchCandidates: true, fetchQuestions: false });
    const { data: initialTemplates, error } = await supabase.from("email_templates").select("id, name, subject, body, updated_at");
    if (error) {
        console.error("Error fetching initial templates:", error.message, error.details);
    } else {
        console.log("Fetched initial templates:", initialTemplates);
    }

    return {
        props: {
            mode: "light",
            initialCandidates,
            initialTemplates: initialTemplates || [],
        },
    };
}