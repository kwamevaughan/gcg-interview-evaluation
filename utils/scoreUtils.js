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
                const max = question.points.max || 10; // Default max if not specified
                maxPossibleScore += max;
                if (answer.includes("None")) {
                    totalScore += 0;
                } else {
                    const count = answer.length;
                    const base = question.points.base || 5;
                    const extra = question.points.extra || 2;
                    totalScore += Math.min(base + (count - 1) * extra, max);
                }
            } else {
                // Single-select logic
                const maxOptionScore = Math.max(
                    ...Object.values(question.points).map(Number).filter((n) => !isNaN(n))
                ) || 10; // Default to 10 if no valid scores
                maxPossibleScore += maxOptionScore;
                const selectedAnswer = answer[0];
                if (selectedAnswer && selectedAnswer in question.points) {
                    totalScore += question.points[selectedAnswer];
                }
            }
        } else {
            console.warn(`No points defined for question ${idx + 1} (${questions[idx]?.text || "unknown"}) - skipping scoring`);
        }
    });

    return { totalScore: Math.min(totalScore, maxPossibleScore), maxPossibleScore };
}