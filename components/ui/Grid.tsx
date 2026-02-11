import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Layout } from '@/constants/layout';

interface ContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

interface RowProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

export const Row: React.FC<RowProps> = ({ children, style, align, justify }) => {
    return (
        <View style={[
            styles.row,
            align && { alignItems: align },
            justify && { justifyContent: justify },
            style
        ]}>
            {children}
        </View>
    );
};

interface ColProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    span?: number; // 1 to 4
}

export const Col: React.FC<ColProps> = ({ children, style, span = 1 }) => {
    // Use flex-basis or width? Width makes more sense for a strict grid.
    // Although in React Native flex is often better. 
    // But for a strict "Stretch" grid where we want exact alignment, width calculations might be safer 
    // to exact match the design specs, especially with gaps.

    // Actually, simpler approach for 4-column grid with gap:
    // If we rely on Row having negative margin and Col having padding/margin, we can use flex.
    // But to adhere strictly to "width: auto" from Figma usually implies flex.
    // "Type: Stretch" means they fill available space.

    // Let's use the explicit width calculation for precision matching the Figma grid logic provided in the prompt context.
    // But for flexibility, flex: span is often more robust in RN.
    // Let's stick to flex with gap for modern RN? 
    // No, the prompt specified specific gutter/margin.

    // Let's use flexbox with gap for rows if RN version supports it (0.71+ does). project is 0.73+.
    // Wait, package.json says "react-native": "0.81.5", so gap is supported.

    // However, the standard grid implementation often uses negative margins on Row.
    // Let's implement using the standard negative margin technique to support precise gutters everywhere.

    const widthPercent = (span / Layout.grid.columns) * 100;

    return (
        <View style={[
            styles.col,
            {
                width: `${widthPercent}%`,
                paddingHorizontal: Layout.grid.gutter / 2
            },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Layout.grid.margin,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -Layout.grid.gutter / 2, // Negative margin to offset column padding
    },
    col: {
        // paddingHorizontal is applied inline
    }
});
