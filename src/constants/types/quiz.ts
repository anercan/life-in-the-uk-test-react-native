import {PremiumType, UserQuizState} from "constants/types/index";

export interface AnswerResponse {
    id: number;
    content: string;
    imgUrl?: string;
}

export interface QuestionResponse {
    id: number;
    content: string;
    imgUrl?: string;
    correctAnswerId: number;
    explanation?: string;
    priority: number;
    attributes?: Record<string, string>;
    answersList: AnswerResponse[];
}

export interface QuestionResponseForReview {
    id: number;
    content: string;
    explanation?: string;
}

export interface UserWrongAnswerResponse {
    wrongAnswer: AnswerResponse;
    question: QuestionResponseForReview;
}

export interface UserQuizResponse {
    state: UserQuizState;
    correctQuestionList: number[];
    wrongQuestionList: UserWrongAnswerResponse[];
}

export interface QuizResponseWithUserQuizData {
    id: number;
    name: string;
    attributes?: Record<string, string>;
    questionList: QuestionResponse[];
    userQuiz?: UserQuizResponse;
    availablePremiumTypes?: PremiumType[];
}
