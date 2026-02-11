import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Layout = {
    window: {
        width,
    },
    grid: {
        columns: 4,
        margin: 20,
        gutter: 20,
    },
};

/**
 * Calculates the width of a column span based on the current screen width
 * and grid settings.
 * 
 * Formula: 
 * Total Usable Width = ScreenWidth - (2 * Margin)
 * Column Width = (Total Usable Width - ((Columns - 1) * Gutter)) / Columns
 * Span Width = (Column Width * Span) + ((Span - 1) * Gutter)
 */
export const getColWidth = (span: number = 1): number => {
    const { width } = Dimensions.get('window');
    const { margin, gutter, columns } = Layout.grid;

    const totalUsableWidth = width - (margin * 2);
    const singleColumnWidth = (totalUsableWidth - ((columns - 1) * gutter)) / columns;

    return (singleColumnWidth * span) + ((span - 1) * gutter);
};
