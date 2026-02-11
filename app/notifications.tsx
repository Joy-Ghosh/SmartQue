import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, StatusBar } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock Notification Data
const NOTIFICATIONS = [
    {
        id: '1',
        type: 'alert',
        title: 'Queue Alert',
        message: 'Your turn for Dr. John Doe is coming up in 15 mins. Please arrive at the clinic soon.',
        time: '2 mins ago',
        read: false,
    },
    {
        id: '2',
        type: 'success',
        title: 'Booking Confirmed',
        message: 'Your appointment with Dr. Sarah Smith has been confirmed for tomorrow at 10:00 AM.',
        time: '1 hour ago',
        read: true,
    },
    {
        id: '3',
        type: 'info',
        title: 'Health Tip',
        message: 'Stay hydrated! Drinking water is essential for your health.',
        time: '5 hours ago',
        read: true,
    },
    {
        id: '4',
        type: 'info',
        title: 'Welcome to SmartQ',
        message: 'Thanks for joining! Find nearby clinics and skip the waiting room.',
        time: '1 day ago',
        read: true,
    },
];

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return 'alert-circle';
            case 'success': return 'checkmark-circle';
            case 'info': return 'information-circle';
            default: return 'notifications';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'alert': return Colors.medicalRed;
            case 'success': return Colors.success;
            case 'info': return Colors.primary;
            default: return Colors.textMuted;
        }
    };

    const renderItem = ({ item, index }: { item: typeof NOTIFICATIONS[0], index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <Pressable style={[styles.notificationCard, !item.read && styles.unreadCard]}>
                <View style={[styles.iconContainer, { backgroundColor: `${getColor(item.type)}20` }]}>
                    <Ionicons name={getIcon(item.type) as any} size={24} color={getColor(item.type)} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Notifications',
                    headerTitleStyle: {
                        fontFamily: 'Inter_700Bold',
                        fontSize: 18,
                        color: Colors.text,
                    },
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} style={{ marginLeft: 0, padding: 8 }}>
                            <Ionicons name="arrow-back" size={24} color={Colors.text} />
                        </Pressable>
                    ),
                }}
            />
            <StatusBar barStyle="dark-content" />

            <FlatList
                data={NOTIFICATIONS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: 20,
        gap: 16,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        ...Colors.shadows.sm,
        alignItems: 'flex-start',
    },
    unreadCard: {
        backgroundColor: '#F8FAFC', // Slightly different bg for unread? Or keep white but add dot
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    title: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: Colors.text,
    },
    time: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textMuted,
    },
    message: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.medicalRed,
        position: 'absolute',
        top: 16,
        right: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        gap: 10,
    },
    emptyText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: Colors.textMuted,
    },
});
