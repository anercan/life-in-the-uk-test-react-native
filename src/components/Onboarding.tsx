import Onboarding from 'react-native-onboarding-swiper';
import Image from "components/Image";
import {useTheme} from "hooks";

const AppOnboarding = ({onDone}) => {

    const {colors,fonts} = useTheme();

    return (
        <Onboarding
            titleStyles={{fontFamily:fonts.p}}
            subTitleStyles={{fontFamily:fonts.p}}
            onDone={() => onDone()}
            onSkip={() => onDone()}
            pages={[
                {
                    backgroundColor: colors.primary,
                    image: <Image resizeMode={'contain'} style={{ width: 300, height: 250 }} source={require('/assets/images/onboard/solve.png')}/>,
                    title: 'Solve!',
                    subtitle: 'Start solving official questions'
                },
                {
                    backgroundColor: colors.primary,
                    image: <Image resizeMode={'contain'} style={{ width: 300, height: 250 }} source={require('/assets/images/onboard/compare.png')}/>,
                    title: 'Compare!',
                    subtitle: 'Compare your results with others'
                },
                {
                    backgroundColor: colors.primary,
                    image: <Image resizeMode={'contain'} style={{ width: 300, height: 250 }} source={require('/assets/images/onboard/analize.png')}/>,
                    title: 'Recognise Shortcomings!',
                    subtitle: 'Check the topics where you\'ve made the most mistakes under your profile'
                }
            ]}
        />);
}

export default AppOnboarding;
