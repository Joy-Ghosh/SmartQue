import React, { createContext, useContext } from 'react';
import Animated, { useSharedValue, SharedValue } from 'react-native-reanimated';

interface ScrollContextType {
    scrollY: SharedValue<number>;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scrollY = useSharedValue(0);

    return (
        <ScrollContext.Provider value={{ scrollY }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
};
