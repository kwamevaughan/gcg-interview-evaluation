// src/hooks/useQuestions.js
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export const useQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("order");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterPoints, setFilterPoints] = useState("all");

    useEffect(() => {
        fetchQuestions();
    }, [sortField, sortDirection]);

    const fetchQuestions = async () => {
        const { data, error } = await supabase
            .from("interview_questions")
            .select("*")
            .order(sortField, { ascending: sortDirection === "asc" });
        if (error) {
            console.error("Error fetching questions:", error);
            toast.error("Failed to load questions.");
        } else {
            setQuestions(data);
        }
    };

    const addQuestion = async (text, options, points) => {
        const optionsArray = Array.isArray(options) ? options : options.split("\n").map((opt) => opt.trim()).filter((opt) => opt); // Fallback for older data
        let pointsObject = {};
        try {
            pointsObject = points ? JSON.parse(points) : {};
        } catch (error) {
            toast.error("Invalid points format. Use JSON like: {\"Option 1\": 10, \"Option 2\": 5}");
            return false;
        }

        if (!text || optionsArray.length === 0) {
            toast.error("Please provide a question and at least one option.");
            return false;
        }

        const { data, error } = await supabase
            .from("interview_questions")
            .insert([{ text, options: optionsArray, points: pointsObject, order: questions.length }])
            .select();

        if (error) {
            console.error("Error adding question:", error);
            toast.error("Failed to add question: " + error.message);
            return false;
        } else {
            toast.success(`Question "${data[0].text}" added successfully!`, { icon: "✅" });
            fetchQuestions();
            return true;
        }
    };

    const editQuestion = async (id, text, options, points) => {
        const optionsArray = Array.isArray(options) ? options : options.split("\n").map((opt) => opt.trim()).filter((opt) => opt); // Fallback for older data
        let pointsObject = {};
        try {
            pointsObject = points ? JSON.parse(points) : {};
        } catch (error) {
            toast.error("Invalid points format. Use JSON like: {\"Option 1\": 10, \"Option 2\": 5}");
            return false;
        }

        if (!text || optionsArray.length === 0) {
            toast.error("Please provide a question and at least one option.");
            return false;
        }

        const { data, error } = await supabase
            .from("interview_questions")
            .update({ text, options: optionsArray, points: pointsObject, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select();

        if (error) {
            console.error("Error editing question:", error);
            toast.error("Failed to update question: " + error.message);
            return false;
        } else {
            toast.success(`Question "${data[0].text}" updated successfully!`, { icon: "✅" });
            fetchQuestions();
            return true;
        }
    };

    const deleteQuestion = async (id, text) => {
        const { error } = await supabase.from("interview_questions").delete().eq("id", id);
        if (error) {
            console.error("Error deleting question:", error);
            toast.error("Failed to delete question: " + error.message);
            return false;
        } else {
            toast.success(`Question "${text}" deleted successfully!`, { icon: "🗑️" });
            fetchQuestions();
            return true;
        }
    };

    const moveQuestion = async (fromIndex, toIndex) => {
        const updatedQuestions = [...questions];
        const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
        updatedQuestions.splice(toIndex, 0, movedQuestion);

        const reorderedQuestions = updatedQuestions.map((q, idx) => ({
            ...q,
            order: idx,
        }));

        setQuestions(reorderedQuestions);

        const updates = reorderedQuestions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            points: q.points || {},
            order: q.order,
            created_at: q.created_at,
            updated_at: q.updated_at,
        }));

        const { error } = await supabase.from("interview_questions").upsert(updates);
        if (error) {
            console.error("Error reordering questions:", error);
            toast.error("Failed to reorder questions: " + error.message);
            fetchQuestions();
            return false;
        }
        return true;
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const filteredQuestions = questions
        .filter((q) => q.text.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((q) => {
            if (filterPoints === "hasPoints") return q.points && Object.keys(q.points).length > 0;
            if (filterPoints === "noPoints") return !q.points || Object.keys(q.points).length === 0;
            return true;
        });

    return {
        questions: filteredQuestions,
        searchQuery,
        setSearchQuery,
        sortField,
        sortDirection,
        handleSort,
        filterPoints,
        setFilterPoints,
        fetchQuestions,
        addQuestion,
        editQuestion,
        deleteQuestion,
        moveQuestion,
    };
};