import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { Motion } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: any;
  activeScale?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  style, 
  activeScale = Motion.scale.tap,
  ...props 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(activeScale, { 
      duration: Motion.duration.urgent,
      easing: Motion.easing.standard
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { 
      damping: 10, 
      stiffness: 200 
    });
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};
