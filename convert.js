const fs = require('fs');

const csv = fs.readFileSync('assets/dataset/smartQ clinic dataset - Sheet1.csv', 'utf-8');
const lines = csv.trim().split('\n').slice(1);

const clinics = [];
const doctors = [];

const images = [
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1586773860383-dab5f3bc1bc8?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1551076805-e166946c9eb9?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1587373950294-d4dff8a38ec1?w=800&auto=format&fit=crop&q=60'
];

const getClinicImage = (specialty, index) => {
  return images[index % images.length];
};

const doctorNames = [
  'Dr. Aditi Kulkarni', 'Dr. Rahul Mehta', 'Dr. Priya Sharma', 'Dr. Suresh Iyer',
  'Dr. Amit Verma', 'Dr. Nikhil Joshi', 'Dr. Sneha Patil', 'Dr. Vikram Singh',
  'Dr. Ananya Roy', 'Dr. Rohan Desai'
];

lines.forEach((line, index) => {
  const parts = line.split(',');
  if (parts.length < 16) return;
  const [
    name, specialty, area, rating, reviews,
    bStart, cOpen, cClose, state, servingToken,
    qLen, avgConsult, phone, walkin, emergency, accuracy
  ] = parts;
  
  const id = String(index + 1);
  const baseFee = Math.floor(Math.random() * 5 + 3) * 100;
  
  clinics.push({
    id,
    name,
    type: specialty.toLowerCase(),
    address: area + ', Kolkata',
    avgWaitTimePerPatient: parseInt(avgConsult),
    currentQueueLength: parseInt(qLen),
    lat: 22.5726 + (Math.random() - 0.5) * 0.1,
    lng: 88.3639 + (Math.random() - 0.5) * 0.1,
    distance: parseFloat((Math.random() * 5 + 1).toFixed(1)),
    rating: parseFloat(rating),
    image: getClinicImage(specialty, index),
    state,
    bookingStartTime: bStart,
    clinicOpenTime: cOpen,
    clinicCloseTime: cClose,
    servingToken: parseInt(servingToken),
    emergencySupported: emergency === 'TRUE',
    pricing: {
      consultation: baseFee,
      platformFee: 49,
      emergencyPremium: 300,
      total: baseFee + 49
    }
  });
  
  doctors.push({
    id,
    name: doctorNames[index % doctorNames.length],
    specialty,
    clinicId: id,
    experience: Math.floor(Math.random() * 15) + 5,
    patients: parseInt(reviews) * 3,
    reviews: parseInt(reviews),
    rating: parseFloat(rating),
    fee: baseFee,
    status: state === 'live' ? 'In Cabin' : (state === 'closed' ? 'Available' : 'On Break'),
    availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM']
  });
});

const out = `export interface Clinic {
  id: string;
  name: string;
  type: string;
  address: string;
  avgWaitTimePerPatient: number;
  currentQueueLength: number;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  image: string;
  state?: string;
  bookingStartTime?: string;
  clinicOpenTime?: string;
  clinicCloseTime?: string;
  servingToken?: number;
  emergencySupported?: boolean;
  pricing: {
    consultation: number;
    platformFee: number;
    emergencyPremium: number;
    total: number;
  }
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicId: string;
  experience: number;
  patients: number;
  reviews: number;
  rating: number;
  fee: number;
  status: 'In Cabin' | 'On Break' | 'Available';
  availableSlots: string[];
}

export interface UserProfile {
  name: string;
  firstName: string;
  location: string;
  currentTransportMode: 'car' | 'bike' | 'walk';
}

export const categories = [
  { id: 'all', label: 'All', icon: 'apps' as const },
  { id: 'dentist', label: 'Dentist', icon: 'medical' as const },
  { id: 'skin', label: 'Skin', icon: 'body' as const },
  { id: 'general', label: 'General', icon: 'fitness' as const },
  { id: 'eye', label: 'Eye', icon: 'eye' as const },
  { id: 'labs', label: 'Labs', icon: 'flask' as const },
];

export const clinics: Clinic[] = ${JSON.stringify(clinics, null, 2)};

export const doctors: Doctor[] = ${JSON.stringify(doctors, null, 2)};

export const user: UserProfile = {
  name: 'Rahul Sharma',
  firstName: 'Rahul',
  location: 'Kolkata, WB',
  currentTransportMode: 'car',
};

export const transportModes = [
  { id: 'car' as const, label: 'Car', time: 20, icon: 'car-sport' as const },
  { id: 'bike' as const, label: 'Bike', time: 15, icon: 'bicycle' as const },
  { id: 'walk' as const, label: 'Walk', time: 40, icon: 'walk' as const },
];

export function getClinicDoctor(clinicId: string): Doctor | undefined {
  return doctors.find((d) => d.clinicId === clinicId);
}

export function getQueueBadge(queueLength: number): { label: string; color: string; bgColor: string } {
  if (queueLength < 5) {
    return { label: 'Fast Moving', color: '#10B981', bgColor: '#ECFDF5' };
  }
  if (queueLength > 10) {
    return { label: 'High Wait', color: '#EF4444', bgColor: '#FEF2F2' };
  }
  return { label: 'Moderate', color: '#F59E0B', bgColor: '#FFFBEB' };
}
`;

fs.writeFileSync('lib/data.ts', out);
