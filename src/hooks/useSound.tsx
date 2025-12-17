import {useContext, useEffect, useRef, useState} from "react";
import Sound from "react-native-sound";
import {logEvent} from "util/logUtil";
import {QuizSettingsContext} from "context/QuizSettingsContext";

export const useSound = (filename: string) => {
    const sound = useRef<Sound | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const {settings} = useContext(QuizSettingsContext);

    useEffect(() => {
        sound.current = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                logEvent('errorSound_' + filename)
                return;
            }
            setIsLoaded(true);
        });

        return () => {
            sound.current?.release();
        };
    }, [filename]);

    const play = () => {
        if (settings.showCorrectAnswer && settings.playSounds && sound.current && isLoaded) {
            try {
                sound.current.play(() => {});
            } catch (e) {
                logEvent('playSoundError_' + filename, e);
            }
        }
    };

    const stop = () => {
        if (sound.current) {
            sound.current.stop();
        }
    };

    return {play, stop};
};
