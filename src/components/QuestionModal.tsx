import React, {useEffect, useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {useTheme} from "hooks";

type ReviewModalProps = {
    visible: boolean;
    question?: string;
    positiveText: string
    onCloseText: string;
    positiveAction: () => void;
    onClose: () => void;
};

const QuestionModal: React.FC<ReviewModalProps> = (props: ReviewModalProps) => {
    const [visibility, setVisibility] = useState(false);
    const {fonts, colors} = useTheme();

    useEffect(() => {
        setVisibility(props.visible)
    }, [props.visible]);

    const onCloseAction = () => {
        props.onClose();
        setVisibility(false);
    };

    const positiveActionInternal = () => {
        props.onClose();
        props.positiveAction();
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.25)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        card: {
            backgroundColor: colors.secondaryBackground,
            width: 300,
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
        },
        title: {
            fontFamily: fonts.medium,
            fontSize: 16,
            textAlign: 'center',
            color: colors.text,
            marginBottom: 20,
        },
        buttonGroup: {
            flexDirection: 'row',
            gap: 16,
        },
        button: {
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderRadius: 12,
            minWidth: 100,
            alignItems: 'center',
        },
        yesButton: {
            backgroundColor: '#5b935d',
        },
        noButton: {
            backgroundColor: '#9c666e',
        },
        selected: {
            transform: [{scale: 1.05}],
        },
        buttonText: {
            color: colors.gray,
            fontFamily: fonts.medium,
            fontSize: 15,
        },
    });

    return (
        <Modal transparent animationType="fade" visible={visibility}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{props.question}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.yesButton,
                            ]}
                            onPress={() => positiveActionInternal()}
                        >
                            <Text style={styles.buttonText}>{props.positiveText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.noButton,
                            ]}
                            onPress={() => onCloseAction()}
                        >
                            <Text style={styles.buttonText}>{props.onCloseText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default QuestionModal;


