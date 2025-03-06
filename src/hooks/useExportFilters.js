import { useState } from "react";

export default function useExportFilters(candidates) {

    const [filterStatus, setFilterStatus] = useState("all");
    const [dateRange, setDateRange] = useState([{
        startDate: null,
        endDate: null,
        key: "selection",
    }]);

    const filteredCandidates = candidates
        .filter((candidate) => {
            if (filterStatus !== "all") {
                console.log(`Filtering by status: ${filterStatus}`);
                console.log(`Candidate status: ${candidate.status || "Pending"}`);
                const result = (candidate.status || "Pending") === filterStatus;
                console.log(`Status filter result: ${result}`);
                return result;
            }
            console.log('No status filter applied');
            return true;
        })
        .filter((candidate) => {

            // If no date range selected, show all candidates
            if (!dateRange[0].startDate || !dateRange[0].endDate) {
                // console.log('No date range selected - returning true');
                // console.log('--- Date Filter End ---');
                return true;
            }

            // Handle missing or invalid timestamp
            if (!candidate.created_at) {
                console.log('Missing created_at - returning false');
                console.log('--- Date Filter End ---');
                return false;
            }

            const createdAt = new Date(candidate.created_at);
            console.log(`Parsed createdAt: ${createdAt}`);

            // Verify the date is valid
            if (isNaN(createdAt.getTime())) {
                console.log('Invalid date parsed - returning false');
                console.log('--- Date Filter End ---');
                return false;
            }

            // Normalize dates to handle time portion correctly
            const start = new Date(dateRange[0].startDate);
            start.setHours(0, 0, 0, 0); // Start of day
            const end = new Date(dateRange[0].endDate);
            end.setHours(23, 59, 59, 999); // End of day
            const created = new Date(createdAt);

            console.log(`Normalized start: ${start}`);
            console.log(`Normalized end: ${end}`);
            console.log(`Normalized created: ${created}`);

            const result = created >= start && created <= end;
            console.log(`Date comparison result: ${result}`);
            console.log(`Details: ${created} >= ${start} && ${created} <= ${end}`);
            console.log('--- Date Filter End ---');

            return result;
        });

    return { filterStatus, setFilterStatus, dateRange, setDateRange, filteredCandidates };
}