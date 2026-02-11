import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map View Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        color: Colors.textMuted,
    },
});
