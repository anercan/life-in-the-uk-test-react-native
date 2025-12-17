import useApiCaller from "../hooks/useApiCaller";
import {QuizResponseWithUserQuizData} from "constants/types/quiz";

export const useQuizService = (navigator?: any) => {
    const {apiCaller, loading} = useApiCaller(navigator);

    const getQuizGroupListWithUserData = () => {
        return apiCaller('quiz-group/get-quiz-groups-with-user-quiz-data', 'POST', {pageSize: 25, page: 0});
    }

    const getQuizListWithUserData = (quizGroupId: number) => {
        return apiCaller('quiz/get-quizzes-with-user-data', 'POST', {pageSize: 25, page: 0, quizGroupId: quizGroupId})
    }

    const getQuizById: (quizId: number) => Promise<QuizResponseWithUserQuizData> = (quizId: number) => {
        return apiCaller(`quiz/get-quiz-with-id/${quizId}`, "GET");
    };

    const getDailyQuiz = () => {
        return apiCaller(`quiz/get-user-daily-quiz`, "POST");
    };

    const saveDailyQuiz = (correctId?: number, wrongId?: number) => {
        return apiCaller(`quiz/save-user-daily-quiz`, "POST", {
            correctQuestionId: correctId,
            wrongQuestionId: wrongId,
        });
    };

    const updateUserQuiz = (payload: any) => {
        return apiCaller(`user-quiz/create-update-user-quiz`, "POST", payload);
    };

    const getUserQuizList = () => {
        return apiCaller('user-quiz/get-user-quiz-list')
    }

    const getUserQuizAnalyses = () => {
        return apiCaller('profile/get-user-quiz-analyses')
    }

    const getCompletedQuizStatistics = (quizId: number) => {
        return apiCaller('user-quiz/get-completed-quiz-statics?quizId=' + quizId);
    }

    return {
        loading,
        getQuizGroupListWithUserData,
        getQuizListWithUserData,
        getQuizById,
        getDailyQuiz,
        saveDailyQuiz,
        updateUserQuiz,
        getUserQuizList,
        getUserQuizAnalyses,
        getCompletedQuizStatistics
    };
};
