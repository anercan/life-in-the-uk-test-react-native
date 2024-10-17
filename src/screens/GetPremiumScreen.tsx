import React, {useCallback, useContext} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import useTheme from "../hooks/useTheme";
import {useFocusEffect} from "@react-navigation/native";
import {TitleContext} from "../context/TitleContext";

const {width,height} = Dimensions.get('window');

const GetPremiumScreen = ({navigation}) => {

    const {fonts} = useTheme();

    const { setTitle } = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle('Subscription');
        }, [])
    )

    const handleUpgrade = () => {
        console.log('User wants to upgrade');
        /* apiCaller('user-management/update-premium-info', 'POST', {})
        .then((response) => {
            login(response);
        })
        .catch(() => alert('Login Failed'));*/
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#fff',
        },
        card: {
            height: height / 2,
            width: width / 1.3, // Adjust height as needed
            backgroundColor: '#3d3c3c',
            borderRadius: 10,
            margin: 10,
            marginBottom:40,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 4,
        },
        headerText: {
            fontSize: 24,
            fontWeight: 'bold',
            marginVertical: 20,
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: fonts.medium,
        },
        priceText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: '#e2e2e2',
            fontFamily: fonts.medium,
        },
        featureList: {
            backgroundColor: '#535353',
            borderRadius: 10,
            marginTop: 20,
            paddingTop:5,
            marginHorizontal:5,
            marginBottom:100
        },
        featureItem: {
            marginBottom: 10,
        },
        featureText: {
            fontSize: 17,
            textAlign: 'center',
            fontFamily: fonts.thin,
            color: '#ffffff'
        },
        upgradeButton: {
            backgroundColor: '#013971',
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 10,
            shadowColor: '#959595',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 4,
        },
        upgradeButtonText: {
            color: '#fff',
            fontSize: 18,
            fontFamily: fonts.medium,
        },
        footerText: {
            marginTop: 5,
            fontSize: 14,
            color: '#888',
            textAlign: 'center',
        },
    });

    const premiumFeatures = [
        'Access to Premium+ questions',
        'Get detailed statical data',
        'Compare your test results with others',
        'Early access to new features',
        'Ad-free experience',
        'Cancellation available anytime!'
    ];

    const renderFeature = ({item}) => (
        <View style={styles.featureItem}>
            <Text style={styles.featureText}>• {item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.headerText}>Unlock Premium+</Text>

                <FlatList
                    data={premiumFeatures}
                    renderItem={renderFeature}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.featureList}
                />
                <Text style={styles.priceText}>For Just 2.99£ Monthly!</Text>
            </View>
            <TouchableOpacity  accessible={true}
                               accessibilityLabel="Unlock Premium Subscription"
                               style={styles.upgradeButton}
                               onPress={handleUpgrade}>
                <Text style={styles.upgradeButtonText}>Unlock Premium+</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>Terms and Conditions apply</Text>
        </View>
    );
};

export default GetPremiumScreen;
