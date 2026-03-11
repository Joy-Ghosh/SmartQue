import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Animated, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { GlassView } from '@/components/ui/GlassView';

// Mock Data
const MOCK_CARDS = [
  { id: '1', type: 'visa', number: '•••• 4242', expiry: '12/26', default: true, gradient: Colors.gradients.hero },
  { id: '2', type: 'mastercard', number: '•••• 8831', expiry: '04/28', default: false, gradient: Colors.gradients.dark },
  { id: '3', type: 'apple-pay', number: 'Apple Pay', default: false, gradient: Colors.gradients.primary },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cards, setCards] = useState(MOCK_CARDS);

  const setAsDefault = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCards(cards.map(c => ({
      ...c,
      default: c.id === id
    })));
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa': return 'card';
      case 'mastercard': return 'card-outline';
      case 'apple-pay': return 'logo-apple';
      default: return 'card-outline';
    }
  };

  const getCardName = (type: string) => {
    switch (type) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'apple-pay': return 'Apple Pay';
      default: return 'Card';
    }
  };

  return (
    <View style={styles.container}>
      {/* Background blobs for aesthetics */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <Text style={styles.sectionTitle}>Saved Cards & Wallets</Text>
        
        <View style={styles.cardsList}>
          {cards.map((card) => (
            <Pressable 
              key={card.id} 
              style={({ pressed }) => [styles.cardPressable, pressed && { transform: [{ scale: 0.98 }] }]}
              onPress={() => setAsDefault(card.id)}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.cardItem, card.default && styles.cardActive]}
              >
                {/* Subtle glass overlay inside the gradient */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }]} />
                
                <View style={styles.cardTop}>
                  <View style={styles.cardTypeWrap}>
                    <Ionicons name={getCardIcon(card.type)} size={24} color="#fff" />
                    <Text style={styles.cardTypeName}>{getCardName(card.type)}</Text>
                  </View>
                  
                  {card.default && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  {card.expiry && <Text style={styles.cardExpiry}>{card.expiry}</Text>}
                </View>

                {/* Decorative circles */}
                <View style={[styles.cardCircle, { top: -20, right: -20, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                <View style={[styles.cardCircle, { bottom: -30, left: -10, backgroundColor: 'rgba(255,255,255,0.05)', width: 80, height: 80 }]} />
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.addCardBtn, pressed && { opacity: 0.7 }]}>
          <View style={styles.addCardIconWrap}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.addCardText}>Add New Card</Text>
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Insurance Providers</Text>
        
        <GlassView intensity={60} style={styles.insuranceCard} border>
          <View style={styles.insuranceIconWrap}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.secondary} />
          </View>
          <View style={styles.insuranceInfo}>
            <Text style={styles.insuranceName}>Blue Cross Blue Shield</Text>
            <Text style={styles.insurancePlan}>HMO Plan ••••••7102</Text>
          </View>
          <Pressable style={styles.insuranceEditBtn}>
            <Text style={styles.insuranceEditText}>Edit</Text>
          </Pressable>
        </GlassView>
        
        <Pressable style={({ pressed }) => [styles.addInsuranceBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.addInsuranceText}>+ Link New Insurance</Text>
        </Pressable>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
          <Text style={styles.securityText}>Your payment information is securely encrypted and processed by Stripe.</Text>
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
  blob1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.secondary + '20',
    zIndex: -1,
  },
  blob2: {
    position: 'absolute',
    top: 200,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primary + '15',
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardsList: {
    gap: 16,
    marginBottom: 24,
  },
  cardPressable: {
    borderRadius: 20,
  },
  cardItem: {
    height: 120,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Colors.shadows.md,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#fff',
    ...Colors.shadows.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTypeName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.text,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumber: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#fff',
    letterSpacing: 1,
  },
  cardExpiry: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cardCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addCardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 32,
  },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  insuranceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insuranceInfo: {
    flex: 1,
  },
  insuranceName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  insurancePlan: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  insuranceEditBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
  },
  insuranceEditText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
  addInsuranceBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  addInsuranceText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.secondaryDark,
  },
  securityFooter: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 20,
  },
  securityText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  }
});
