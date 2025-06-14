import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SetaProps {
    direcao: 'esquerda' | 'direita';
    onPress: () => void;
    onLongPress: () => void;
    visivel: boolean;
}

export default function Seta({ direcao, onPress, onLongPress, visivel }: SetaProps) {
    const fadeAnim = useRef(new Animated.Value(visivel ? 1 : 0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visivel ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visivel]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                Animated.spring(scaleAnim, {
                    toValue: 0.9,
                    useNativeDriver: true,
                }).start();
                onLongPress();
            },
            onPanResponderRelease: () => {
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    if (!visivel) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                    left: direcao === 'esquerda' ? 0 : undefined,
                    right: direcao === 'direita' ? 0 : undefined,
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                {...panResponder.panHandlers}
                style={styles.botao}
            >
                <MaterialIcons
                    name={direcao === 'esquerda' ? 'arrow-back' : 'arrow-forward'}
                    size={30}
                    color="#8B0000"
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        zIndex: 1,
        paddingHorizontal: 8,
    },
    botao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});