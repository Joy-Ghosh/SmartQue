import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassView } from '@/components/ui/GlassView';

export default function OTPScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const isComplete = otp.every(digit => digit.length === 1);

    const handleVerify = () => {
        if (isComplete) {
            router.push('/(onboarding)/permissions');
        }
    };

    useEffect(() => {
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background, '#F0F9FF']}
                style={StyleSheet.absoluteFill}
            />

            <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="shield-checkmark-outline" size={32} color={Colors.success} />
                        </View>
                        <Text style={styles.title}>Verify it's you</Text>
                        <Text style={styles.subtitle}>
                            Enter the 4-digit code sent to {'\n'}
                            <Text style={styles.phone}>+91 {phone}</Text>
                        </Text>
                    </View>

                    <GlassView intensity={60} style={styles.otpCard} border>
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[
                                        styles.otpInput,
                                        digit ? styles.otpInputFilled : null
                                    ]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                />
                            ))}
                        </View>
                    </GlassView>

                    <GradientButton
                        title="Verify & Continue"
                        onPress={handleVerify}
                        disabled={!isComplete}
                        style={{ marginTop: 24 }}
                    />

                    <Pressable style={styles.resendBtn}>
                        <Text style={styles.resendText}>
                            Didn't receive code? <Text style={styles.resendLink}>Resend</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backBtn: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadows.sm,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        ...Colors.shadows.md,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    phone: {
        fontFamily: 'Inter_700Bold',
        color: Colors.text,
    },
    otpCard: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    otpContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    otpInput: {
        width: 60,
        height: 60,
        backgroundColor: Colors.background,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        textAlign: 'center',
        fontFamily: 'Inter_700Bold',
        fontSize: 24,
        color: Colors.text,
    },
    otpInputFilled: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    resendBtn: {
        marginTop: 24,
        alignItems: 'center',
    },
    resendText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.textMuted,
    },
    resendLink: {
        color: Colors.primary,
        fontFamily: 'Inter_700Bold',
    },
});
