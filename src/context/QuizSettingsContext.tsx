import Storage from "@react-native-async-storage/async-storage";
import React, {createContext, useEffect, useState} from "react";

export const QuizSettingsContext = createContext(null);

export const QuizSettingsProvider = ({children}) => {
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(true);
    const [showExplanationWhileSolving, setShowExplanationWhileSolving] = useState(true);
    const [filterCorrectAnswersInReview, setFilterCorrectAnswersInReview] = useState(true);
    const [skipQuestionImmediately, setSkipQuestionImmediately] = useState(false);

    useEffect(() => {
        Storage.getItem('setting.showCorrectAnswer').then(data => setShowCorrectAnswer(data ? JSON.parse(data) : showCorrectAnswer));
        Storage.getItem('setting.showExplanation').then(data => setShowExplanationWhileSolving(data ? JSON.parse(data) : showExplanationWhileSolving));
        Storage.getItem('setting.filterCorrectAnswersInReview').then(data => setFilterCorrectAnswersInReview(data ? JSON.parse(data) : filterCorrectAnswersInReview));
        Storage.getItem('setting.skipQuestionImmediatly').then(data => setSkipQuestionImmediately(data ? JSON.parse(data) : skipQuestionImmediately));
    }, []);

    const setExplanationWhileSolving = (newState: boolean) => {
        Storage.setItem('setting.showExplanation', String(newState));
        setShowExplanationWhileSolving(newState);
    }

    const setCorrectAnswer = (newState: boolean) => {
        Storage.setItem('setting.showCorrectAnswer', String(newState));
        setShowCorrectAnswer(newState);
    }

    const setFilterCorrectsInReview = (newState: boolean) => {
        Storage.setItem('setting.filterCorrectAnswersInReview', String(newState));
        setFilterCorrectAnswersInReview(newState);
    }


    const setSkipQuestion = (newState: boolean) => {
        Storage.setItem('setting.skipQuestionImmediately', String(newState));
        setSkipQuestionImmediately(newState);
    }

    return (
        <QuizSettingsContext.Provider value={{
            showExplanationWhileSolving,
            setExplanationWhileSolving,
            showCorrectAnswer,
            setCorrectAnswer,
            filterCorrectAnswersInReview,
            setFilterCorrectsInReview,
            skipQuestionImmediately,
            setSkipQuestion
        }}>
            {children}
        </QuizSettingsContext.Provider>
    );
};
