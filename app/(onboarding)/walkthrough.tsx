import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    SlideInRight,
    SlideOutLeft,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';
import { GradientButton } from '@/components/ui/GradientButton';

const { width } = Dimensions.get('window');

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'fr', label: 'Français' },
];

export default function WalkthroughScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedLang, setSelectedLang] = useState<string | null>(null);

    const nextStep = () => {
        if (step < 5) {
            setStep(s => s + 1);
        }
    };

    const handleLanguageSelect = (langId: string) => {
        setSelectedLang(langId);
        setTimeout(() => {
            nextStep();
        }, 400);
    };

    const handleFinishNormal = () => {
        router.replace('/(tabs)');
    };

    const handleFinishEmergency = () => {
        Alert.alert(
            "Emergency Care",
            "Are you experiencing a life-threatening medical emergency?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Call 911", style: "destructive", onPress: () => {
                        Linking.openURL('tel:911');
                    }
                }
            ]
        );
    };

    // Pulse animation for Radar step
    const pulseScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.8);

    useEffect(() => {
        if (step === 3) {
            pulseScale.value = withRepeat(withTiming(1.6, { duration: 1500 }), -1, false);
            pulseOpacity.value = withRepeat(withTiming(0, { duration: 1500 }), -1, false);
        }
    }, [step]);

    const animatedPulse = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
        opacity: pulseOpacity.value,
    }));

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View key="step1" entering={FadeIn.duration(400)} exiting={SlideOutLeft} style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="hand-right-outline" size={80} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>Health speaks your language.</Text>
                        <Text style={styles.subtitle}>Choose your preferred language to continue.</Text>

                        <View style={styles.optionsContainer}>
                            {LANGUAGES.map(lang => (
                                <Pressable
                                    key={lang.id}
                                    style={[
                                        styles.langButton,
                                        selectedLang === lang.id && styles.langButtonActive
                                    ]}
                                    onPress={() => handleLanguageSelect(lang.id)}
                                >
                                    <Text style={[
                                        styles.langButtonText,
                                        selectedLang === lang.id && styles.langButtonTextActive
                                    ]}>{lang.label}</Text>
                                    {selectedLang === lang.id && (
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    </Animated.View>
                );
            case 2:
                return (
                    <Animated.View key="step2" entering={SlideInRight} exiting={SlideOutLeft} style={styles.content}>
                        <View style={styles.illustrationWrap}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="home-outline" size={40} color={Colors.primary} />
                            </View>
                            <View style={styles.dashedLine} />
                            <View style={[styles.iconCircle, { backgroundColor: Colors.secondary + '20' }]}>
                                <Ionicons name="medical-outline" size={40} color={Colors.secondary} />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
                            <Text style={styles.title}>Skip the waiting room.</Text>
                            <Text style={styles.subtitle}>Book your spot before you even leave the house.</Text>
                        </View>
                        <GradientButton title="Next" onPress={nextStep} style={{ width: '100%' }} />
                    </Animated.View>
                );
            case 3:
                return (
                    <Animated.View key="step3" entering={SlideInRight} exiting={SlideOutLeft} style={styles.content}>
                        <View style={styles.illustrationWrapCenter}>
                            <Ionicons name="map-outline" size={100} color={Colors.textMuted} />
                            <View style={styles.dotContainer}>
                                <Animated.View style={[styles.pulseCircle, animatedPulse]} />
                                <View style={styles.centerDot} />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
                            <Text style={styles.title}>Find the shortest lines near you.</Text>
                            <Text style={styles.subtitle}>We need your location to show live queue times at nearby clinics and guide you there.</Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <GradientButton title="Enable Location" onPress={nextStep} style={{ width: '100%' }} />
                            <Pressable onPress={nextStep} style={styles.textLink}>
                                <Text style={styles.textLinkText}>Maybe later</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                );
            case 4:
                return (
                    <Animated.View key="step4" entering={SlideInRight} exiting={SlideOutLeft} style={styles.content}>
                        <View style={styles.illustrationWrapCenter}>
                            <Ionicons name="phone-portrait-outline" size={120} color={Colors.textSecondary} />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>0 min wait</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 60 }}>
                            <Text style={styles.title}>Never wait in the lobby again.</Text>
                            <Text style={styles.subtitle}>Allow alerts so we can tell you the exact minute you need to leave your house.</Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <GradientButton title="Allow Live Alerts" onPress={nextStep} style={{ width: '100%' }} />
                            <Pressable onPress={nextStep} style={styles.textLink}>
                                <Text style={styles.textLinkText}>Skip for now</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                );
            case 5:
                return (
                    <Animated.View key="step5" entering={SlideInRight} exiting={FadeOut} style={styles.content}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={styles.iconContainerCenter}>
                                <Ionicons name="pulse" size={60} color={Colors.primary} />
                            </View>
                            <Text style={[styles.title, { textAlign: 'center' }]}>How can we help you right now?</Text>
                            <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 40 }]}>
                                Let us get you the care you need immediately.
                            </Text>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.triageCard,
                                    styles.triageCardPrimary,
                                    pressed && { transform: [{ scale: 0.98 }] }
                                ]}
                                onPress={handleFinishNormal}
                            >
                                <View style={[styles.triageIconWrap, { backgroundColor: '#fff' }]}>
                                    <Ionicons name="calendar-outline" size={28} color={Colors.primary} />
                                </View>
                                <View style={styles.triageTextWrap}>
                                    <Text style={[styles.triageTitle, { color: '#fff' }]}>Schedule a Visit</Text>
                                    <Text style={[styles.triageSub, { color: 'rgba(255,255,255,0.8)' }]}>Standard booking flow</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={24} color="#fff" />
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.triageCard,
                                    styles.triageCardDanger,
                                    pressed && { transform: [{ scale: 0.98 }] }
                                ]}
                                onPress={handleFinishEmergency}
                            >
                                <View style={[styles.triageIconWrap, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                                    <Ionicons name="medical" size={28} color={Colors.medicalRed} />
                                </View>
                                <View style={styles.triageTextWrap}>
                                    <Text style={[styles.triageTitle, { color: Colors.medicalRed }]}>Emergency Care</Text>
                                    <Text style={[styles.triageSub, { color: Colors.textSecondary }]}>Immediate ER routing</Text>
                                </View>
                                <Ionicons name="warning-outline" size={24} color={Colors.medicalRed} />
                            </Pressable>
                        </View>
                    </Animated.View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#F8FAFC']}
                style={StyleSheet.absoluteFill}
            />
            {/* Soft geometric blobs */}
            <View style={[styles.blob, { top: -100, right: -50, backgroundColor: Colors.primary + '08' }]} />
            <View style={[styles.blob, { bottom: -100, left: -50, backgroundColor: Colors.secondary + '08' }]} />

            <View style={styles.inner}>
                {/* Minimalist Progress Indicator */}
                <View style={styles.progressHeader}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <View
                            key={i}
                            style={[
                                styles.progressSeg,
                                i === step && styles.progressSegActive,
                                i < step && styles.progressSegDone
                            ]}
                        />
                    ))}
                </View>

                {renderStep()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    inner: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 40,
        justifyContent: 'center',
    },
    progressSeg: {
        height: 4,
        width: 20,
        backgroundColor: Colors.borderLight,
        borderRadius: 2,
    },
    progressSegActive: {
        backgroundColor: Colors.primary,
        width: 32,
    },
    progressSegDone: {
        backgroundColor: Colors.primary + '50',
    },
    content: {
        flex: 1,
    },
    iconContainer: {
        marginBottom: 32,
        marginTop: 40,
    },
    iconContainerCenter: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 32,
        color: Colors.text,
        marginBottom: 16,
        lineHeight: 40,
    },
    subtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    optionsContainer: {
        marginTop: 40,
        gap: 12,
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        backgroundColor: '#fff',
    },
    langButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    langButtonText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.text,
    },
    langButtonTextActive: {
        color: '#fff',
        fontFamily: 'Inter_600SemiBold',
    },
    illustrationWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashedLine: {
        flex: 1,
        height: 2,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
        marginHorizontal: 12,
    },
    illustrationWrapCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        marginTop: 20,
        position: 'relative',
    },
    dotContainer: {
        position: 'absolute',
        top: 60,
        right: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        borderWidth: 3,
        borderColor: '#fff',
    },
    pulseCircle: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
    },
    actionContainer: {
        gap: 16,
    },
    textLink: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    textLinkText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.textMuted,
    },
    notificationBadge: {
        position: 'absolute',
        top: 20,
        right: 40,
        backgroundColor: Colors.medicalRed,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        ...Colors.shadows.md,
    },
    badgeText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: '#fff',
    },
    triageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        ...Colors.shadows.sm,
    },
    triageCardPrimary: {
        backgroundColor: Colors.primary,
    },
    triageCardDanger: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
    },
    triageIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    triageTextWrap: {
        flex: 1,
    },
    triageTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        marginBottom: 4,
    },
    triageSub: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
});
