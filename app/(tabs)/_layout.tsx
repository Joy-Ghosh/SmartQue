import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolateColor,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/styles';
import { QueueProvider, useQueue } from '@/lib/queue-context';
import { ScrollProvider } from '@/lib/scroll-context';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

// ── Tactile Pressable Component ──────────────────────────────────────────────
function AnimatedPressable({ onPress, children, style, disabled = false }: any) {
    const scale = useSharedValue(1);
    
    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => { scale.value = withSpring(0.92, { damping: 12, stiffness: 200 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
            onPress={onPress}
            style={style}
        >
            <Animated.View style={scaleStyle}>
                {children}
            </Animated.View>
        </Pressable>
    );
}

const TABS = [
    { name: 'index', label: 'Home', icon: 'home' },
    { name: 'search', label: 'Explore', icon: 'compass' },
    { name: 'token', label: 'Emergency', activeLabel: 'Ticket', icon: 'medkit', activeIcon: 'ticket' },
    { name: 'profile', label: 'Profile', icon: 'person' },
];

function TabItem({ isSelected, onPress, tab, hasActiveToken }: { isSelected: boolean, onPress: () => void, tab: typeof TABS[0], hasActiveToken: boolean }) {
    const progress = useSharedValue(isSelected ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isSelected ? 1 : 0, { damping: 14, stiffness: 150 });
    }, [isSelected]);

    const isDynamicTab = tab.name === 'token';
    const currentLabel = (isDynamicTab && hasActiveToken) ? tab.activeLabel : tab.label;
    const currentIcon = (isDynamicTab && hasActiveToken) ? tab.activeIcon : tab.icon;
    
    // Use design system colors
    const activeColor = isDynamicTab && !hasActiveToken ? Colors.error500 : Colors.primary500;
    const inactiveColor = Colors.gray400;

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['transparent', isDynamicTab && !hasActiveToken ? 'rgba(220, 38, 38, 0.08)' : 'rgba(38, 101, 140, 0.12)']
            ),
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            width: interpolate(progress.value, [0, 1], [0, 80], Extrapolate.CLAMP),
            transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1]) }]
        };
    });

    return (
        <AnimatedPressable onPress={onPress} style={styles.tabPressable}>
            <Animated.View style={[styles.tabContainer, animatedContainerStyle]}>
                <Ionicons 
                    name={isSelected ? currentIcon as any : `${currentIcon}-outline` as any} 
                    size={22} 
                    color={isSelected ? activeColor : inactiveColor} 
                />
                <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
                    <Text style={[styles.tabLabel, { color: activeColor }]} numberOfLines={1}>
                        {currentLabel}
                    </Text>
                </Animated.View>
            </Animated.View>
        </AnimatedPressable>
    );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const { activeBooking } = useQueue();
    const hasActiveToken = !!activeBooking;

    return (
        <View style={styles.dockContainer} pointerEvents="box-none">
            <View style={styles.dockAnimatedWrapper}>
                <View style={[styles.glassDock, { paddingBottom: Math.max(insets.bottom, 12), height: 75 + (insets.bottom > 0 ? insets.bottom * 0.4 : 0) }]}>
                    {state.routes.map((route: any, index: number) => {
                        const tabDefinition = TABS.find(t => t.name === route.name);
                        if (!tabDefinition) return null;

                        const isSelected = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isSelected && !event.defaultPrevented) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TabItem 
                                key={route.key} 
                                isSelected={isSelected} 
                                onPress={onPress} 
                                tab={tabDefinition} 
                                hasActiveToken={hasActiveToken}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <ScrollProvider>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="search" />
                <Tabs.Screen name="token" />
                <Tabs.Screen name="profile" />
            </Tabs>
        </ScrollProvider>
    );
}

const styles = StyleSheet.create({
    dockContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        overflow: 'visible', // Ensure shadow is not clipped
    },
    dockAnimatedWrapper: {
        width: WINDOW_WIDTH,
        backgroundColor: 'transparent',
        ...Colors.shadows.sticky, // Use design system sticky shadow (upward)
    },
    glassDock: {
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20, // Finalized 20px padding as requested
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed to between to respect the side padding
        backgroundColor: Colors.bgCard,
        borderTopWidth: 1,
        borderLeftWidth: 0, // Remove side borders for clean blending
        borderRightWidth: 0,
        borderColor: Colors.borderLight,
    },
    tabPressable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        minWidth: 44,
        height: 48,
    },
    labelContainer: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontFamily: Typography.fontFamily.bold,
        fontSize: 13,
        marginLeft: 8,
    }
});
