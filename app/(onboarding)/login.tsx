import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const isValid = phoneNumber.length === 10;

    const handleGetOTP = () => {
        if (isValid) {
            router.push({ pathname: '/(onboarding)/otp', params: { phone: phoneNumber } });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Soft background decoration */}
            <View style={styles.topBlob} />
            <View style={styles.bottomBlob} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Icon mark */}
                    <View style={styles.iconWrap}>
                        <LinearGradient
                            colors={Colors.gradients.primary}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="pulse" size={28} color="#fff" />
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>Welcome to SmartQ</Text>
                    <Text style={styles.subtitle}>Enter your mobile number to skip the waiting room forever.</Text>

                    {/* Phone Input Card */}
                    <View style={[styles.inputCard, isFocused && styles.inputCardFocused]}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.prefixContainer}>
                                <Text style={styles.flag}>🇮🇳</Text>
                                <Text style={styles.prefix}>+91</Text>
                            </View>
                            <View style={styles.divider} />
                            <TextInput
                                style={styles.input}
                                placeholder="00000 00000"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="number-pad"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                autoFocus
                            />
                            {phoneNumber.length > 0 && (
                                <Pressable onPress={() => setPhoneNumber('')}>
                                    <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                                </Pressable>
                            )}
                        </View>
                    </View>

                    <GradientButton
                        title={isValid ? 'Get OTP' : `${phoneNumber.length}/10 digits`}
                        onPress={handleGetOTP}
                        disabled={!isValid}
                        icon="arrow-forward"
                        style={{ marginTop: 20, borderRadius: 16 }}
                    />

                    <Text style={styles.footerText}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.link}>Terms</Text>
                        {' '}&{' '}
                        <Text style={styles.link}>Privacy Policy</Text>.
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    topBlob: {
        position: 'absolute',
        top: -120,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: Colors.primaryBg,
        opacity: 0.8,
    },
    bottomBlob: {
        position: 'absolute',
        bottom: -80,
        left: -60,
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: Colors.secondaryBg,
        opacity: 0.6,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 28,
        justifyContent: 'center',
    },
    iconWrap: {
        alignSelf: 'flex-start',
        marginBottom: 28,
    },
    iconGradient: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30,
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 36,
    },
    inputCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1.5,
        borderColor: Colors.border,
        ...Colors.shadows.sm,
    },
    inputCardFocused: {
        borderColor: Colors.primary,
        ...Colors.shadows.md,
    },
    label: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flag: {
        fontSize: 20,
    },
    prefix: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: Colors.text,
    },
    divider: {
        width: 1.5,
        height: 22,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
    input: {
        flex: 1,
        fontFamily: 'Inter_700Bold',
        fontSize: 20,
        color: Colors.text,
        letterSpacing: 2,
    },
    footerText: {
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 24,
        lineHeight: 18,
    },
    link: {
        color: Colors.primary,
        fontFamily: 'Inter_600SemiBold',
    },
});
