// src/utils/scoreUtils.js
export function calculateScore(answers) {
    let totalScore = 0;

    const q1Answers = answers[0] || [];
    if (q1Answers.includes("None")) totalScore += 0;
    else {
        const languageCount = q1Answers.length;
        totalScore += Math.min(5 + (languageCount - 1) * 2, 10);
    }

    const q2Answer = answers[1]?.[0];
    totalScore += q2Answer === "A" ? 10 : q2Answer === "B" ? 7 : q2Answer === "C" ? 4 : q2Answer === "D" ? 2 : 0;

    totalScore += answers[2]?.[0] === "Yes" ? 10 : 0;

    const q4Answer = answers[3]?.[0];
    totalScore +=
        q4Answer === "First class"
            ? 10
            : q4Answer === "Second class upper division"
                ? 7
                : q4Answer === "Second class lower division"
                    ? 4
                    : q4Answer === "Third class"
                        ? 2
                        : 0;

    const q5Answer = answers[4]?.[0];
    totalScore += q5Answer === "Both" ? 10 : q5Answer ? 5 : 0;

    const q6Answer = answers[5]?.[0];
    totalScore +=
        q6Answer === "Proficient" ? 10 : q6Answer === "Intermediate" ? 7 : q6Answer === "Beginner" ? 3 : 0;

    const q7Answer = answers[6]?.[0];
    totalScore +=
        q7Answer === "5+" ? 10 : q7Answer === "4" ? 8 : q7Answer === "3" ? 6 : q7Answer === "2" ? 4 : q7Answer === "1" ? 2 : 0;

    const q8Answer = answers[7]?.[0];
    totalScore +=
        q8Answer === "Listen to the customer's feedback and tell them that you can understand why they are upset and that it must be very inconvenient for them."
            ? 10
            : q8Answer === "Apologize to the customer and ask them to hold while you contact the project manager to establish where she is."
                ? 7
                : q8Answer === "Apologize to the customer and say you will arrange for a re-scheduled appointment."
                    ? 4
                    : 2;

    const q9Answer = answers[8]?.[0];
    totalScore +=
        q9Answer === "Take some time to read the information provided with the product e.g., product briefs, catalog etc."
            ? 10
            : q9Answer === "Contact your supervisor and ask for a meeting to walk you through the products/services."
                ? 7
                : q9Answer === "Ask a colleague who has already read about the product to give you a brief summary of the information you need."
                    ? 4
                    : 2;

    const q10Answer = answers[9]?.[0];
    totalScore +=
        q10Answer === "“I am sorry to hear that. What is it about the service that disappointed you today?”"
            ? 10
            : q10Answer === "“I understand your frustration; this is an unexpectedly busy hour. We are doing our best.”"
                ? 7
                : q10Answer === "“I am really sorry you feel that way. Would you like to get the manager so that you can talk to him?”"
                    ? 4
                    : 2;

    const q11Answer = answers[10]?.[0];
    totalScore +=
        q11Answer === "Set a goal to increase productivity by 5% next month and provide an incentive."
            ? 10
            : q11Answer === "Speak openly to the team leaders - tell them that they perform well but can do better and ask them to improve."
                ? 7
                : q11Answer === "Give a motivational speech in which you focus on how competent the team leaders are."
                    ? 4
                    : 2;

    const q12Answer = answers[11]?.[0];
    totalScore +=
        q12Answer === "10+ years" ? 10 : q12Answer === "5-10 years" ? 8 : q12Answer === "3-5 years" ? 6 : q12Answer === "2-3 years" ? 4 : 2;

    const q13Answer = answers[12]?.[0];
    totalScore +=
        q13Answer === "6+" ? 10 : q13Answer === "5" ? 8 : q13Answer === "4" ? 6 : q13Answer === "3" ? 4 : q13Answer === "2" ? 2 : 0;

    const q14Answer = answers[13]?.[0];
    totalScore +=
        q14Answer === "Communicate with stakeholders to clarify priorities and delegate tasks."
            ? 10
            : q14Answer === "Work overtime to complete all tasks."
                ? 7
                : q14Answer === "Request deadline extensions."
                    ? 4
                    : 2;

    const q15Answer = answers[14]?.[0];
    totalScore +=
        q15Answer === "Listen to their concerns, present data, and seek alignment."
            ? 10
            : q15Answer === "Escalate the issue to senior management."
                ? 7
                : q15Answer === "Avoid confrontation to maintain harmony."
                    ? 4
                    : 2;

    totalScore += answers[15]?.[0] === "Yes" ? 10 : 0;
    totalScore += answers[16]?.[0] === "Yes" ? 10 : 0;

    const q18Answer = answers[17]?.[0];
    totalScore +=
        q18Answer === "6+ years" ? 10 : q18Answer === "3-5 years" ? 7 : q18Answer === "2-3 years" ? 5 : q18Answer === "1-2 years" ? 3 : 0;

    const q19Answer = answers[18]?.[0];
    totalScore +=
        q19Answer === "Assess the situation, gather input from stakeholders, and then act."
            ? 10
            : q19Answer === "Immediately take charge and implement a solution."
                ? 7
                : q19Answer === "Delegate the issue to a team member."
                    ? 4
                    : 2;

    return Math.min(totalScore, 190);
}