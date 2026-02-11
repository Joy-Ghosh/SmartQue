import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/styles';

const SPLASH_DURATION = 2500;

export default function SplashScreen() {
    const router = useRouter();
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 12 });
        opacity.value = withTiming(1, { duration: 800 });

        textOpacity.value = withSequence(
            withTiming(0, { duration: 600 }),
            withTiming(1, { duration: 800 })
        );

        const timer = setTimeout(() => {
            router.replace('/(onboarding)/walkthrough');
        }, SPLASH_DURATION);

        return () => clearTimeout(timer);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: withTiming(textOpacity.value === 1 ? 0 : 20) }]
    }));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1E1B4B', '#312E81', '#4338CA']} // Deep Indigo Gradient
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <Animated.View style={[styles.iconContainer, logoStyle]}>
                <View style={styles.iconCircle}>
                    <Ionicons name="time" size={64} color="#fff" />
                    <View style={styles.notificationDot} />
                </View>
            </Animated.View>

            <Animated.View style={[styles.textContainer, textStyle]}>
                <Text style={styles.brandName}>SmartQ</Text>
                <Text style={styles.tagline}>Wait where you want.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 40,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    notificationDot: {
        position: 'absolute',
        top: 28,
        right: 28,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.secondary, // Cyan/Teal
        borderWidth: 2,
        borderColor: '#312E81',
    },
    textContainer: {
        alignItems: 'center',
        gap: 8,
    },
    brandName: {
        fontFamily: 'Inter_700Bold',
        fontSize: 42,
        color: '#fff',
        letterSpacing: 1,
    },
    tagline: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
});
