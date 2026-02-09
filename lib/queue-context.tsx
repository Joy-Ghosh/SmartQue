import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface ActiveBooking {
  clinicId: string;
  clinicName: string;
  doctorName: string;
  tokenNumber: number;
  servingToken: number;
  transportMode: 'car' | 'bike' | 'walk';
  travelTime: number;
  avgWaitTime: number;
  isEmergency: boolean;
  bookedAt: number;
}

interface QueueContextValue {
  activeBooking: ActiveBooking | null;
  setActiveBooking: (booking: ActiveBooking | null) => void;
  updateServingToken: (token: number) => void;
  snoozeBooking: () => void;
  cancelBooking: () => void;
  pastBookings: ActiveBooking[];
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [pastBookings, setPastBookings] = useState<ActiveBooking[]>([]);

  const updateServingToken = (token: number) => {
    setActiveBooking((prev) => {
      if (!prev) return null;
      if (token >= prev.tokenNumber) {
        setPastBookings((old) => [prev, ...old]);
        return null;
      }
      return { ...prev, servingToken: token };
    });
  };

  const snoozeBooking = () => {
    setActiveBooking((prev) => {
      if (!prev) return null;
      return { ...prev, tokenNumber: prev.tokenNumber + 2 };
    });
  };

  const cancelBooking = () => {
    setActiveBooking((prev) => {
      if (prev) {
        setPastBookings((old) => [{ ...prev }, ...old]);
      }
      return null;
    });
  };

  const value = useMemo(
    () => ({
      activeBooking,
      setActiveBooking,
      updateServingToken,
      snoozeBooking,
      cancelBooking,
      pastBookings,
    }),
    [activeBooking, pastBookings],
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
