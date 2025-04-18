export const isDailyQuiz = (quizType) => {
    return quizType === 'DAILY';
}

export const isRegularQuiz = (quizType) => {
    return quizType === 'REGULAR';
}

export const isReviewMode = (quizType) => {
    return quizType === 'REVIEW';
}
