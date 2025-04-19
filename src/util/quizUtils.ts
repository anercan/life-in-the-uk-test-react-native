export const isDailyQuiz = (quizType) => {
    return quizType === 'DAILY';
}

export const isRegularQuiz = (quizType) => {
    return quizType === 'REGULAR';
}

export const isReviewMode = (quizType) => {
    return quizType === 'REVIEW';
}

export const getQuestionCount = (userQuiz) => {
    if (userQuiz) {
        if (userQuiz?.state === 'COMPLETED') {
            return 0;
        }
        let corrects = userQuiz?.correctQuestionList ? userQuiz?.correctQuestionList?.length : 0;
        let wrongs = userQuiz?.wrongQuestionList ? userQuiz?.wrongQuestionList?.length : 0;
        let questionOrder = (corrects + wrongs) - 1;
        return questionOrder < 0 ? 0 : questionOrder;
    } else {
        return 0;
    }
}
