import Storage from "@react-native-async-storage/async-storage";
import React, {createContext, useEffect, useState} from "react";

export const QuizSettingsContext = createContext(null);

export const QuizSettingsProvider = ({children}) => {
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(true);
    const [showExplanationWhileSolving, setShowExplanationWhileSolving] = useState(true);
    const [skipQuestionImmediately, setSkipQuestionImmediately] = useState(false);
    const [playSounds, setPlaySounds] = useState(true);

    useEffect(() => {
        Storage.getItem('setting.showCorrectAnswer').then(data => setShowCorrectAnswer(data ? JSON.parse(data) : showCorrectAnswer));
        Storage.getItem('setting.showExplanation').then(data => setShowExplanationWhileSolving(data ? JSON.parse(data) : showExplanationWhileSolving));
        Storage.getItem('setting.skipQuestionImmediately').then(data => setSkipQuestionImmediately(data ? JSON.parse(data) : skipQuestionImmediately));
        Storage.getItem('setting.playSounds').then(data => setPlaySounds(data ? JSON.parse(data) : playSounds));
    }, []);

    const setExplanationWhileSolving = (newState: boolean) => {
        Storage.setItem('setting.showExplanation', String(newState));
        setShowExplanationWhileSolving(newState);
    }

    const setCorrectAnswer = (newState: boolean) => {
        Storage.setItem('setting.showCorrectAnswer', String(newState));
        setShowCorrectAnswer(newState);
    }

    const setSkipQuestion = (newState: boolean) => {
        Storage.setItem('setting.skipQuestionImmediately', String(newState));
        setSkipQuestionImmediately(newState);
    }

    const setPlaySound = (newState: boolean) => {
        Storage.setItem('setting.playSounds', String(newState));
        setPlaySounds(newState);
    }

    return (
        <QuizSettingsContext.Provider value={{
            showExplanationWhileSolving,
            setExplanationWhileSolving,
            showCorrectAnswer,
            setCorrectAnswer,
            skipQuestionImmediately,
            setSkipQuestion,
            playSounds,
            setPlaySound
        }}>
            {children}
        </QuizSettingsContext.Provider>
    );
};
