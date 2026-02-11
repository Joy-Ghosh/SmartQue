import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
    useAnimatedScrollHandler,
    runOnJS,
    SharedValue
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Stop Waiting in Lines',
        description: 'Check live queue status of doctors nearby before you step out.',
        icon: 'cafe' as const,
        color: Colors.primary,
    },
    {
        id: '2',
        title: 'Time Your Arrival',
        description: 'We calculate traffic + queue speed to tell you exactly when to leave.',
        icon: 'time' as const,
        color: Colors.secondary,
    },
    {
        id: '3',
        title: 'Book & Relax',
        description: 'Get your digital token instantly. No calling, no chaos.',
        icon: 'ticket' as const,
        color: Colors.smartAmber,
    },
];

const SlideItem = ({ item, index, scrollX }: { item: typeof SLIDES[0], index: number, scrollX: SharedValue<number> }) => {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [20, 0, 20],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }, { translateY }],
            opacity,
        };
    });

    return (
        <View style={styles.slideContainer}>
            <Animated.View style={[styles.cardWrapper, animatedStyle]}>
                <GlassView intensity={80} style={styles.slideCard} border>
                    <View style={[styles.iconBubble, { backgroundColor: item.color + '15' }]}>
                        <Ionicons name={item.icon} size={64} color={item.color} />
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </GlassView>
            </Animated.View>
        </View>
    );
};

const Pagination = ({ scrollX }: { scrollX: SharedValue<number> }) => {
    return (
        <View style={styles.paginationContainer}>
            {SLIDES.map((_, i) => {
                const animatedDotStyle = useAnimatedStyle(() => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const widthAnim = interpolate(
                        scrollX.value,
                        inputRange,
                        [8, 32, 8],
                        Extrapolation.CLAMP
                    );
                    const opacity = interpolate(
                        scrollX.value,
                        inputRange,
                        [0.4, 1, 0.4],
                        Extrapolation.CLAMP
                    );
                    return {
                        width: widthAnim,
                        opacity,
                        backgroundColor: Colors.primary
                    };
                });
                return <Animated.View key={i} style={[styles.dot, animatedDotStyle]} />;
            })}
        </View>
    );
};

export default function WalkthroughScreen() {
    const router = useRouter();
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
        runOnJS(setCurrentIndex)(Math.round(event.contentOffset.x / width));
    });

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(onboarding)/login');
        }
    };

    const handleSkip = () => {
        router.push('/(onboarding)/login');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#F0F9FF']}
                style={StyleSheet.absoluteFill}
            />
            {/* Background Decorations */}
            <View style={[styles.blob, { top: -100, right: -100, backgroundColor: Colors.primary + '10' }]} />
            <View style={[styles.blob, { bottom: -100, left: -100, backgroundColor: Colors.secondary + '10' }]} />

            <Pressable style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                style={styles.flatList}
            />

            <View style={styles.footer}>
                <Pagination scrollX={scrollX} />

                <Pressable
                    style={[
                        styles.nextButton,
                        currentIndex === SLIDES.length - 1 && styles.getStartedButton
                    ]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    <Ionicons
                        name={currentIndex === SLIDES.length - 1 ? "rocket-outline" : "arrow-forward"}
                        size={20}
                        color="#fff"
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    skipText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.textSecondary,
    },
    flatList: {
        flex: 1,
    },
    slideContainer: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardWrapper: {
        width: width * 0.85,
        height: height * 0.55,
    },
    slideCard: {
        flex: 1,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        ...Colors.shadows.lg,
    },
    iconBubble: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    getStartedButton: {
        backgroundColor: Colors.secondary,
        shadowColor: Colors.secondary,
        paddingHorizontal: 32,
    },
    nextButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: '#fff',
    },
});
