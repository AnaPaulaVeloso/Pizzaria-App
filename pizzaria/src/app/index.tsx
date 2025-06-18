import { View, Text, StyleSheet, Image, Animated, Easing, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function App() {
    const router = useRouter();
    const spinValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/(auth)/login");
        }, 3000);

        // Animação de rotação suave
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            })
        ).start();

        // Animação de slide lateral
        Animated.loop(
            Animated.sequence([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -1,
                    duration: 2000,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animação de fade in e scale
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();

        return () => clearTimeout(timer);
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const slide = slideAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-20, 20]
    });

    return (
        <View style={styles.container}>
            <View style={styles.backgroundCircle} />
            <Animated.View 
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateX: slide }
                        ]
                    }
                ]}
            >
                <View style={styles.whiteCircle}>
                    <Animated.Image 
                        source={require("../assets/B1.png")} 
                        style={[
                            styles.logo,
                            { transform: [{ rotate: spin }] }
                        ]}
                    />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8B0000",
    },
    backgroundCircle: {
        position: 'absolute',
        width: Dimensions.get('window').width * 2,
        height: Dimensions.get('window').width * 2,
        borderRadius: Dimensions.get('window').width,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        top: -Dimensions.get('window').width * 0.5,
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    whiteCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    },
    logo: {
        width: 1200,
        height: 360,
        borderRadius: 60,
        resizeMode: "contain",
    },
});