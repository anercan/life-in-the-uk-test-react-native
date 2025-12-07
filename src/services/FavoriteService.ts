import useApiCaller from "../hooks/useApiCaller";

export const useFavoriteService = (navigator?: any) => {
    const {apiCaller} = useApiCaller(navigator);

    const getFavoriteIds = () => {
        return apiCaller("favorite/get-user-question-ids", "GET");
    };

    const getFavoriteQuestions = () => {
        return apiCaller("favorite/get-user-questions", "GET");
    };

    const addOrRemove = (questionId: number, isAdd: boolean) => {
        return apiCaller("favorite/add-or-remove", "POST", {
            add: isAdd,
            questionId,
        });
    };

    return {
        getFavoriteIds,
        getFavoriteQuestions,
        addOrRemove
    };
};
