// src/utils/scoreUtils.js
export function calculateScore(answers, questions = []) {
    let totalScore = 0;
    let maxPossibleScore = 0;

    answers.forEach((answerArray, idx) => {
        const question = questions[idx];
        const answer = answerArray;

        if (question?.points) {
            if ("base" in question.points) {
                // Multi-select logic
                if (answer.includes("None")) {
                    totalScore += 0;
                } else {
                    const count = answer.length;
                    const base = question.points.base || 5;
                    const extra = question.points.extra || 2;
                    const max = question.points.max || 10;
                    totalScore += Math.min(base + (count - 1) * extra, max);
                }
                maxPossibleScore += question.points.max || 10;
            } else {
                // Single-select logic
                const selectedAnswer = answer[0];
                if (selectedAnswer && selectedAnswer in question.points) {
                    totalScore += question.points[selectedAnswer];
                }
                maxPossibleScore += Math.max(...Object.values(question.points).map(Number).filter(n => !isNaN(n))) || 10;
            }
        } else {
            // Fallback logic (temporary)
            console.warn(`Fallback scoring used for question ${idx + 1} - no points defined in database`);
            switch (idx) {
                case 0: // Q1: Languages
                    if (answer.includes("None")) totalScore += 0;
                    else {
                        const languageCount = answer.length;
                        totalScore += Math.min(5 + (languageCount - 1) * 2, 10);
                    }
                    maxPossibleScore += 10;
                    break;
                case 1: // Q2: High school grade
                    totalScore +=
                        answer[0] === "A" ? 10 : answer[0] === "B" ? 7 : answer[0] === "C" ? 4 : answer[0] === "D" ? 2 : 0;
                    maxPossibleScore += 10;
                    break;
                case 2: // Q3: Masters degree
                    totalScore += answer[0] === "Yes" ? 10 : 0;
                    maxPossibleScore += 10;
                    break;
                case 3: // Q4: Degree classification
                    totalScore +=
                        answer[0] === "First class"
                            ? 10
                            : answer[0] === "Second class upper division"
                                ? 7
                                : answer[0] === "Second class lower division"
                                    ? 4
                                    : answer[0] === "Third class"
                                        ? 2
                                        : 0;
                    maxPossibleScore += 10;
                    break;
                case 4: // Q5: Tech skills
                    totalScore += answer[0] === "Both" ? 10 : answer[0] ? 5 : 0;
                    maxPossibleScore += 10;
                    break;
                case 5: // Q6: Coding proficiency
                    totalScore +=
                        answer[0] === "Proficient" ? 10 : answer[0] === "Intermediate" ? 7 : answer[0] === "Beginner" ? 3 : 0;
                    maxPossibleScore += 10;
                    break;
                case 6: // Q7: Years of experience
                    totalScore +=
                        answer[0] === "5+"
                            ? 10
                            : answer[0] === "4"
                                ? 8
                                : answer[0] === "3"
                                    ? 6
                                    : answer[0] === "2"
                                        ? 4
                                        : answer[0] === "1"
                                            ? 2
                                            : 0;
                    maxPossibleScore += 10;
                    break;
                case 7: // Q8: Customer feedback
                    totalScore +=
                        answer[0] ===
                        "Listen to the customer's feedback and tell them that you can understand why they are upset and that it must be very inconvenient for them."
                            ? 10
                            : answer[0] ===
                            "Apologize to the customer and ask them to hold while you contact the project manager to establish where she is."
                                ? 7
                                : answer[0] === "Apologize to the customer and say you will arrange for a re-scheduled appointment."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 8: // Q9: Product knowledge
                    totalScore +=
                        answer[0] ===
                        "Take some time to read the information provided with the product e.g., product briefs, catalog etc."
                            ? 10
                            : answer[0] === "Contact your supervisor and ask for a meeting to walk you through the products/services."
                                ? 7
                                : answer[0] ===
                                "Ask a colleague who has already read about the product to give you a brief summary of the information you need."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 9: // Q10: Service disappointment
                    totalScore +=
                        answer[0] === "“I am sorry to hear that. What is it about the service that disappointed you today?”"
                            ? 10
                            : answer[0] ===
                            "“I understand your frustration; this is an unexpectedly busy hour. We are doing our best.”"
                                ? 7
                                : answer[0] ===
                                "“I am really sorry you feel that way. Would you like to get the manager so that you can talk to him?”"
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 10: // Q11: Team productivity
                    totalScore +=
                        answer[0] === "Set a goal to increase productivity by 5% next month and provide an incentive."
                            ? 10
                            : answer[0] ===
                            "Speak openly to the team leaders - tell them that they perform well but can do better and ask them to improve."
                                ? 7
                                : answer[0] ===
                                "Give a motivational speech in which you focus on how competent the team leaders are."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 11: // Q12: Years in role
                    totalScore +=
                        answer[0] === "10+ years"
                            ? 10
                            : answer[0] === "5-10 years"
                                ? 8
                                : answer[0] === "3-5 years"
                                    ? 6
                                    : answer[0] === "2-3 years"
                                        ? 4
                                        : 2;
                    maxPossibleScore += 10;
                    break;
                case 12: // Q13: Projects managed
                    totalScore +=
                        answer[0] === "6+"
                            ? 10
                            : answer[0] === "5"
                                ? 8
                                : answer[0] === "4"
                                    ? 6
                                    : answer[0] === "3"
                                        ? 4
                                        : answer[0] === "2"
                                            ? 2
                                            : 0;
                    maxPossibleScore += 10;
                    break;
                case 13: // Q14: Multiple tasks
                    totalScore +=
                        answer[0] === "Communicate with stakeholders to clarify priorities and delegate tasks."
                            ? 10
                            : answer[0] === "Work overtime to complete all tasks."
                                ? 7
                                : answer[0] === "Request deadline extensions."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 14: // Q15: Disagreement
                    totalScore +=
                        answer[0] === "Listen to their concerns, present data, and seek alignment."
                            ? 10
                            : answer[0] === "Escalate the issue to senior management."
                                ? 7
                                : answer[0] === "Avoid confrontation to maintain harmony."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                case 15: // Q16: Certification
                    totalScore += answer[0] === "Yes" ? 10 : 0;
                    maxPossibleScore += 10;
                    break;
                case 16: // Q17: Leadership training
                    totalScore += answer[0] === "Yes" ? 10 : 0;
                    maxPossibleScore += 10;
                    break;
                case 17: // Q18: Management experience
                    totalScore +=
                        answer[0] === "6+ years"
                            ? 10
                            : answer[0] === "3-5 years"
                                ? 7
                                : answer[0] === "2-3 years"
                                    ? 5
                                    : answer[0] === "1-2 years"
                                        ? 3
                                        : 0;
                    maxPossibleScore += 10;
                    break;
                case 18: // Q19: Urgent decision
                    totalScore +=
                        answer[0] === "Assess the situation, gather input from stakeholders, and then act."
                            ? 10
                            : answer[0] === "Immediately take charge and implement a solution."
                                ? 7
                                : answer[0] === "Delegate the issue to a team member."
                                    ? 4
                                    : 2;
                    maxPossibleScore += 10;
                    break;
                default:
                    maxPossibleScore += 10;
                    break;
            }
        }
    });

    return Math.min(totalScore, maxPossibleScore);
}