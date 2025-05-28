import {capitalizeWords, getColorFromPalette, getShortenText} from "util/commonUtil";

export type QuizParams = {
    quizType: 'REGULAR' | 'DAILY' | 'REVIEW_ALL' | 'REVIEW_WRONGS' | 'REVIEW_CORRECTS' | 'FAVORITES';
    quizCardList: any[];
    quizGroupId: number;
    quizId: number;
};

export const isDailyQuiz = (quizType) => {
    return quizType === 'DAILY';
}

export const isRegularQuiz = (quizType) => {
    return quizType === 'REGULAR';
}

export const isFavoritesQuiz = (quizType) => {
    return quizType === 'FAVORITES';
}

export const isReviewMode = (quizType) => {
    return quizType === 'REVIEW_ALL' || quizType === 'REVIEW_WRONGS' || quizType === 'REVIEW_CORRECTS';
}

export const isReviewAll= (quizType) => {
    return quizType === 'REVIEW_ALL';
}

export const isReviewWrongs= (quizType) => {
    return quizType === 'REVIEW_WRONGS';
}

export const isReviewCorrects= (quizType) => {
    return quizType === 'REVIEW_CORRECTS';
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

export const getQuestions = (quizResponse,type) => {
    if (isReviewAll(type)) {
        return quizResponse?.questionList;
    } else if (isReviewWrongs(type)) {
        let wrongQuestionIds = quizResponse?.userQuiz?.wrongQuestionList.map(wrongQuestion => wrongQuestion.question.id);
        return wrongQuestionIds?.length > 0 ? quizResponse?.questionList.filter(question => wrongQuestionIds.includes(question.id)) : quizResponse?.questionList;
    } else if (isReviewCorrects(type)) {
        return quizResponse?.userQuiz?.correctQuestionList.length > 0 ? quizResponse?.questionList.filter(question => quizResponse?.userQuiz?.correctQuestionList?.includes(question.id)) : quizResponse?.questionList;
    }
    return quizResponse?.questionList;
}

export const mapWrongsToPieChartData = (wrongsMap) => {
    try {
        let incorrectDataList: any[] = [];
        const maxIncorrectKey = Object.entries(wrongsMap)?.reduce((max, entry) => Number(entry[1]) > Number(max[1]) ? entry : max)[0];
        Object.entries(wrongsMap).forEach(([key, val], index) => {
            incorrectDataList.push({
                focused: maxIncorrectKey === key,
                name: getShortenText(capitalizeWords(key), 50),
                value: val,
                color: getColorFromPalette(index),
            });
        });
        return incorrectDataList;
    } catch (e) {
        return [];
    }
}
