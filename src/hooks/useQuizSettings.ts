import {useEffect, useState} from "react";
import Storage from "@react-native-async-storage/async-storage";

const useQuizSettings = () => {
    const [showExplanationWhileReview, setShowExplanationWhileReview] = useState(false);

    useEffect(() => {
        initExplanation();
    }, []);

    useEffect(() => {
        Storage.setItem('setting.showExplanation', String(showExplanationWhileReview));
    }, [showExplanationWhileReview]);

    const initExplanation = async () => {
        let explanation = await Storage.getItem('setting.showExplanation');
        setShowExplanationWhileReview(explanation ? JSON.parse(explanation) : showExplanationWhileReview);
    }

    return {showExplanationWhileReview, setShowExplanationWhileReview};
};

export default useQuizSettings;
