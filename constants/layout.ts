import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Layout = {
    window: {
        width,
    },
    grid: {
        columns: 4,
        margin: 16,
        gutter: 16,
    },
    spacing: {
        space1: 4,
        space2: 8,
        space3: 12,
        space4: 16,
        space5: 20,
        space6: 24,
        space8: 32,
        space10: 40,
        space12: 48,
        space16: 64,
    },
};

/**
 * Calculates the width of a column span based on the current screen width
 * and grid settings.
 */
export const getColWidth = (span: number = 1): number => {
    const { width } = Dimensions.get('window');
    const { margin, gutter, columns } = Layout.grid;

    const totalUsableWidth = width - (margin * 2);
    const singleColumnWidth = (totalUsableWidth - ((columns - 1) * gutter)) / columns;

    return (singleColumnWidth * span) + ((span - 1) * gutter);
};
