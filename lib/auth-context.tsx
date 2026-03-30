import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    phoneNumber: string | null;
    login: (phone: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAuthStatus();
    }, []);

    const loadAuthStatus = async () => {
        try {
            const savedPhone = await AsyncStorage.getItem('user_phone');
            if (savedPhone) {
                setPhoneNumber(savedPhone);
                setIsAuthenticated(true);
            }
        } catch (e) {
            console.error('Failed to load auth status', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (phone: string) => {
        try {
            await AsyncStorage.setItem('user_phone', phone);
            setPhoneNumber(phone);
            setIsAuthenticated(true);
        } catch (e) {
            console.error('Failed to save auth status', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_phone');
            setPhoneNumber(null);
            setIsAuthenticated(false);
        } catch (e) {
            console.error('Failed to clear auth status', e);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, phoneNumber, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
