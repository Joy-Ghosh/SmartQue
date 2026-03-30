import React, { useEffect } from 'react';
import { TextStyle, TextInput, StyleProp } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  useDerivedValue,
  useAnimatedProps
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface CountUpProps {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  value, 
  duration = 600, 
  style, 
  suffix = "" 
}) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [value]);

  const derivedValue = useDerivedValue(() => {
    return Math.floor(animatedValue.value).toString() + suffix;
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: derivedValue.value,
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      defaultValue={derivedValue.value} // Use defaultValue for initial render
      style={[{ color: 'black' }, style]}
      animatedProps={animatedProps}
    />
  );
};
