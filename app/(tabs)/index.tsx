import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
    TextInput,
    StatusBar,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useQueue } from '@/lib/queue-context';
import { Layout } from '@/constants/layout';
import { GlassView } from '@/components/ui/GlassView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GradientButton } from '@/components/ui/GradientButton';
import { QueueVisualizer } from '@/components/ui/QueueVisualizer';

const { width } = Dimensions.get('window');

// Data for Category Grid with new brand colors
const CATEGORIES = [
    { id: 'all', name: 'All', icon: 'grid', color: '#F8FAFC', iconColor: '#64748B' },
    { id: 'general', name: 'General', icon: 'medkit', color: '#EFF6FF', iconColor: '#3B82F6' },
    { id: 'dental', name: 'Dental', icon: 'medical', color: '#F0FDFA', iconColor: '#14B8A6' },
    { id: 'dermatology', name: 'Skin', icon: 'happy', color: '#FFF7ED', iconColor: '#F97316' },
    { id: 'cardiology', name: 'Cardio', icon: 'heart', color: '#FEF2F2', iconColor: '#EF4444' },
    { id: 'pediatrics', name: 'Pediatric', icon: 'people', color: '#ECFDF5', iconColor: '#10B981' },
    { id: 'lab', name: 'Lab Tests', icon: 'flask', color: '#F3E8FF', iconColor: '#A855F7' },
    { id: 'orthopedics', name: 'Orthopedic', icon: 'fitness', color: '#F0FDF4', iconColor: '#166534' },
];

// Data for Nearby Clinics
const CLINICS = [
    {
        id: '1',
        name: 'Jay Dental Clinic',
        doctor: 'Dr. John Doe',
        specialty: 'Dentist',
        rating: 4.8,
        distance: '1.2 km',
        waitTimeMin: 10,
        services: ['dental', 'general'],
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
    },
    {
        id: '2',
        name: 'City Health Center',
        doctor: 'Dr. Sarah Smith',
        specialty: 'General',
        rating: 4.5,
        distance: '2.5 km',
        waitTimeMin: 45,
        services: ['general'],
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
    },
    {
        id: '3',
        name: 'Life Care Polyclinic',
        doctor: 'Dr. Michael Brown',
        specialty: 'Skin',
        rating: 4.2,
        distance: '3.8 km',
        waitTimeMin: 75,
        services: ['dermatology', 'general'],
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60',
    },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { activeBooking } = useQueue();
    const [selectedLocation, setSelectedLocation] = useState('New York');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter clinics based on selected category
    const filteredClinics = selectedCategory === 'all'
        ? CLINICS
        : CLINICS.filter(clinic => clinic.services.includes(selectedCategory));

    // Helper for Status Badge Logic
    const getStatus = (mins: number) => {
        if (mins < 15) return 'success';
        if (mins < 60) return 'live'; // or warning/amber
        return 'alert';
    };

    const getWaitLabel = (mins: number) => {
        if (mins < 15) return `<15m`;
        if (mins < 60) return `~${mins}m`;
        return `1h+`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background Gradient for Top Section */}
            <View style={styles.topBg}>
                <LinearGradient
                    colors={['#E0F2FE', '#F8FAFC']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
                {/* Decorative Circle 1 */}
                <View style={[styles.decorativeCircle, { top: -50, right: -50, backgroundColor: 'rgba(31, 182, 166, 0.1)' }]} />
                {/* Decorative Circle 2 */}
                <View style={[styles.decorativeCircle, { top: 100, left: -80, width: 200, height: 200, backgroundColor: 'rgba(30, 42, 94, 0.05)' }]} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 10, paddingBottom: 100 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Top Bar */}
                <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.topBar}>
                    <Pressable style={styles.locationBtn}>
                        <View style={styles.locationIconBg}>
                            <Ionicons name="location" size={18} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.locationLabel}>Current Location</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text style={styles.locationValue}>{selectedLocation}</Text>
                                <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
                            </View>
                        </View>
                    </Pressable>

                    <View style={styles.topRightActions}>
                        <Pressable style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
                            <View style={styles.notifBadge} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/(tabs)/profile')}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60' }}
                                style={styles.avatar}
                            />
                        </Pressable>
                    </View>
                </Animated.View>

                {/* 2. Hero Section: Live Token or Welcome */}
                <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.heroSection}>
                    {activeBooking ? (
                        <Pressable onPress={() => router.push('/(tabs)/token')}>
                            <GlassView style={styles.activeCard} gradientColors={Colors.gradients.primary}>
                                <View style={styles.activeCardHeader}>
                                    <View>
                                        <Text style={styles.activeLabel}>Live Token</Text>
                                        <Text style={styles.activeDoctor}>{activeBooking.doctorName}</Text>
                                        <Text style={styles.activeClinic}>{activeBooking.clinicName}</Text>
                                    </View>
                                    <View style={styles.tokenContainer}>
                                        <Text style={styles.tokenLabel}>YOU</Text>
                                        <Text style={styles.tokenNumber}>{activeBooking.tokenNumber}</Text>
                                    </View>
                                </View>

                                <View style={styles.visualizerContainer}>
                                    <QueueVisualizer
                                        total={activeBooking.tokenNumber + 5}
                                        serving={activeBooking.servingToken}
                                        userToken={activeBooking.tokenNumber}
                                        estimatedWait={Math.max(0, (activeBooking.tokenNumber - activeBooking.servingToken) * activeBooking.avgWaitTime)}
                                    />
                                </View>

                                <View style={styles.activeCardFooter}>
                                    <StatusBadge status="live" text="Tracking Live" />
                                    <View style={styles.leaveTimeContainer}>
                                        <Ionicons name="walk-outline" size={14} color="rgba(255,255,255,0.8)" />
                                        <Text style={styles.leaveTimeText}>Leave by 10:45 AM</Text>
                                    </View>
                                </View>
                            </GlassView>
                        </Pressable>
                    ) : (
                        <GlassView style={styles.heroBanner} gradientColors={['#FFFFFF', '#F1F5F9']}>
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>Skip the <Text style={{ color: Colors.primary }}>waiting room.</Text></Text>
                                <Text style={styles.heroSub}>Book appointments & track queues in real-time.</Text>
                                <GradientButton
                                    title="Find a Clinic"
                                    onPress={() => { }}
                                    style={{ alignSelf: 'flex-start', marginTop: 10 }}
                                    icon="search"
                                />
                            </View>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' }}
                                style={styles.heroImage}
                                resizeMode="contain"
                            />
                        </GlassView>
                    )}
                </Animated.View>

                {/* 3. Search Bar */}
                <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.searchSection}>
                    <GlassView style={styles.searchBar} intensity={20} border={false}>
                        <Ionicons name="search" size={20} color={Colors.textMuted} style={{ marginLeft: 4 }} />
                        <TextInput
                            placeholder="Doctor, clinic, or specialty..."
                            placeholderTextColor={Colors.textMuted}
                            style={styles.searchInput}
                        />
                        <View style={styles.filterSeparator} />
                        <Pressable style={styles.filterBtn}>
                            <Ionicons name="options-outline" size={20} color={Colors.primary} />
                        </Pressable>
                    </GlassView>
                </Animated.View>

                {/* 4. Categories */}
                <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Specialties</Text>
                </Animated.View>

                <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                    entering={FadeInDown.duration(600).delay(450)}
                >
                    {CATEGORIES.map((cat, index) => (
                        <Pressable
                            key={cat.id}
                            style={[
                                styles.categoryBtn,
                                { backgroundColor: selectedCategory === cat.id ? Colors.primary : '#fff' },
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <View style={[
                                styles.catIconWrap,
                                { backgroundColor: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : cat.color }
                            ]}>
                                <Ionicons name={cat.icon as any} size={22} color={selectedCategory === cat.id ? '#fff' : cat.iconColor} />
                            </View>
                            <Text style={[
                                styles.categoryLabel,
                                selectedCategory === cat.id && styles.selectedCategoryLabel
                            ]}>{cat.name}</Text>
                        </Pressable>
                    ))}
                </Animated.ScrollView>

                {/* 5. Nearest Clinics */}
                <View style={styles.listSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Clinics</Text>
                        <Pressable onPress={() => router.push('/clinics')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </Pressable>
                    </View>

                    <View style={styles.clinicsList}>
                        {filteredClinics.map((clinic, index) => (
                            <Animated.View
                                key={clinic.id}
                                entering={FadeInDown.duration(600).delay(500 + index * 100)}
                            >
                                <Link href={`/clinic/${clinic.id}`} asChild>
                                    <Pressable>
                                        <GlassView style={styles.clinicCard} border intensity={0} gradientColors={['#fff', '#fff']}>
                                            <Image source={{ uri: clinic.image }} style={styles.clinicImage} />
                                            <View style={styles.clinicContent}>
                                                <View style={styles.clinicHeader}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.clinicName}>{clinic.name}</Text>
                                                        <Text style={styles.doctorName}>{clinic.doctor}</Text>
                                                    </View>
                                                    <StatusBadge
                                                        status={getStatus(clinic.waitTimeMin) as any}
                                                        text={getWaitLabel(clinic.waitTimeMin)}
                                                    />
                                                </View>

                                                <View style={styles.clinicDetails}>
                                                    <Text style={styles.detailText}>{clinic.specialty}</Text>
                                                    <View style={styles.detailDot} />
                                                    <Ionicons name="star" size={12} color={Colors.smartAmber} />
                                                    <Text style={styles.detailText}>{clinic.rating}</Text>
                                                    <View style={styles.detailDot} />
                                                    <Text style={styles.detailText}>{clinic.distance}</Text>
                                                </View>
                                            </View>
                                        </GlassView>
                                    </Pressable>
                                </Link>
                            </Animated.View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    topBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 350,
        backgroundColor: '#E0F2FE',
    },
    decorativeCircle: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },

    // Top Bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    locationIconBg: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadows.sm,
    },
    locationLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        color: Colors.textMuted,
        textTransform: 'uppercase',
    },
    locationValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15,
        color: Colors.text,
    },
    topRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadows.sm,
    },
    notifBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.medicalRed,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },

    // Hero Section
    heroSection: {
        marginBottom: 24,
    },
    heroBanner: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 160,
        ...Colors.shadows.md,
    },
    heroContent: {
        flex: 1,
        paddingRight: 10,
    },
    heroTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: Colors.text,
        marginBottom: 8,
        lineHeight: 30,
    },
    heroSub: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
        lineHeight: 20,
    },
    heroImage: {
        width: 100,
        height: 100,
    },

    // Active Card
    activeCard: {
        borderRadius: 24,
        padding: 20,
        gap: 20,
        ...Colors.shadows.glow,
    },
    activeCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    activeLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activeDoctor: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        marginBottom: 2,
    },
    activeClinic: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    tokenContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 10,
        borderRadius: 12,
        minWidth: 60,
    },
    tokenLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        marginBottom: 0,
    },
    tokenNumber: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
    },
    visualizerContainer: {
        marginVertical: 4,
    },
    activeCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    leaveTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    leaveTimeText: {
        color: '#fff',
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
    },

    // Search
    searchSection: {
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        ...Colors.shadows.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: Colors.text,
    },
    filterSeparator: {
        width: 1,
        height: 20,
        backgroundColor: Colors.borderLight,
        marginHorizontal: 12,
    },
    filterBtn: {
        padding: 4,
    },

    // Categories
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: Colors.text,
    },
    seeAll: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.primary,
    },
    categoryScroll: {
        paddingRight: 20,
        gap: 12,
        paddingBottom: 24,
    },
    categoryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        ...Colors.shadows.sm,
    },
    catIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: Colors.text,
    },
    selectedCategoryLabel: {
        color: '#fff',
    },

    // Nearby List
    listSection: {
        marginBottom: 20,
    },
    clinicsList: {
        gap: 16,
    },
    clinicCard: {
        borderRadius: 20,
        padding: 12,
        ...Colors.shadows.sm,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    clinicImage: {
        width: 90,
        height: 90,
        borderRadius: 14,
        backgroundColor: Colors.borderLight,
    },
    clinicContent: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    clinicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clinicName: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: Colors.text,
        marginBottom: 2,
    },
    doctorName: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    clinicDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        color: Colors.textMuted,
    },
    detailDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: Colors.textMuted,
        marginHorizontal: 6,
    },
});
