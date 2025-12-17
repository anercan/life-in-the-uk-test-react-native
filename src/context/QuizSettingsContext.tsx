import Storage from "@react-native-async-storage/async-storage";
import React, {createContext, useEffect, useState} from "react";

export interface QuizSettings {
    showCorrectAnswer: boolean;
    showExplanationWhileSolving: boolean;
    skipQuestionImmediately: boolean;
    playSounds: boolean;
}

export interface QuizSettingsContextType {
    settings: QuizSettings;
    updateSetting: <K extends keyof QuizSettings>(
        key: K,
        value: QuizSettings[K]
    ) => void;
    updateSettings
}

export const QuizSettingsContext =
    createContext<QuizSettingsContextType | null>(null);

const DEFAULT_SETTINGS: QuizSettings = {
    showCorrectAnswer: true,
    showExplanationWhileSolving: true,
    skipQuestionImmediately: false,
    playSounds: true,
};

export const QuizSettingsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [settings, setSettings] = useState<QuizSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await Storage.getItem('quiz.settings');
            if (data) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(data) });
            }
        };
        loadSettings();
    }, []);

    const updateSetting = <K extends keyof QuizSettings>(
        key: K,
        value: QuizSettings[K]
    ) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        Storage.setItem('quiz.settings', JSON.stringify(updated));
    };

    const updateSettings = (updates: Partial<QuizSettings>) => {
        const updated = { ...settings, ...updates };
        setSettings(updated);
        Storage.setItem('quiz.settings', JSON.stringify(updated));
    };

    return (
        <QuizSettingsContext.Provider
            value={{
                settings,
                updateSetting,
                updateSettings
            }}
        >
            {children}
        </QuizSettingsContext.Provider>
    );
};

