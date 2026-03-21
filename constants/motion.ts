/**
 * SmartQ — Guided Motion System v1
 *
 * This system defines the global animation DNA for the app.
 * Philosophy: Calm -> Inform -> Guide -> Act.
 * Source: USER_REQUEST "Global Animation System"
 */
import { Easing } from 'react-native-reanimated';

export const Motion = {
    // ── Duration Tokens ──────────────────────────────────────────────────────
    duration: {
        urgent: 120,    // immediate alerts (fast)
        action: 300,    // interaction feedback (base)
        reveal: 600,    // page/card entry (slow)
    },

    // ── Easing Tokens ────────────────────────────────────────────────────────
    easing: {
        standard:   Easing.bezier(0.4, 0, 0.2, 1), // cubic-bezier(0.4, 0, 0.2, 1)
        accelerate: Easing.in(Easing.ease),
        decelerate: Easing.out(Easing.ease),
    },

    // ── Interaction Tokens ───────────────────────────────────────────────────
    scale: {
        tap:   0.97,
        hover: 1.02,
        focus: 1.05,
    },

    // ── Spacing/Translation Tokens ───────────────────────────────────────────
    spacing: {
        small:  8,   // upward reveal
        medium: 16,  // section reveal
        large:  40,  // page level translation
    },

    // ── Layout Behavior ──────────────────────────────────────────────────────
    stagger: 40, // standard delay between list items
};

export default Motion;
