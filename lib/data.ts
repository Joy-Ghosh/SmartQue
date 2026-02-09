export interface Clinic {
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

export const clinics: Clinic[] = [
  {
    id: '1',
    name: 'City Dental Clinic',
    type: 'dentist',
    address: '15, MG Road, Andheri East',
    avgWaitTimePerPatient: 10,
    currentQueueLength: 4,
    lat: 19.1136,
    lng: 72.8697,
    distance: 1.2,
    rating: 4.8,
    image: 'tooth',
  },
  {
    id: '2',
    name: 'Lotus Medical Centre',
    type: 'general',
    address: '42, Bandra West, Mumbai',
    avgWaitTimePerPatient: 8,
    currentQueueLength: 12,
    lat: 19.0596,
    lng: 72.8295,
    distance: 2.5,
    rating: 4.6,
    image: 'medkit',
  },
  {
    id: '3',
    name: 'SkinCare Plus',
    type: 'skin',
    address: '78, Juhu Lane, Mumbai',
    avgWaitTimePerPatient: 15,
    currentQueueLength: 3,
    lat: 19.0883,
    lng: 72.8263,
    distance: 3.8,
    rating: 4.9,
    image: 'body',
  },
  {
    id: '4',
    name: 'ClearVision Eye Care',
    type: 'eye',
    address: '23, Powai, Mumbai',
    avgWaitTimePerPatient: 12,
    currentQueueLength: 8,
    lat: 19.1176,
    lng: 72.9060,
    distance: 5.1,
    rating: 4.7,
    image: 'eye',
  },
  {
    id: '5',
    name: 'HealthFirst Labs',
    type: 'labs',
    address: '56, Dadar, Mumbai',
    avgWaitTimePerPatient: 5,
    currentQueueLength: 15,
    lat: 19.0178,
    lng: 72.8478,
    distance: 4.2,
    rating: 4.5,
    image: 'flask',
  },
  {
    id: '6',
    name: 'Sharma Dental Studio',
    type: 'dentist',
    address: '9, Malad West, Mumbai',
    avgWaitTimePerPatient: 12,
    currentQueueLength: 6,
    lat: 19.1874,
    lng: 72.8484,
    distance: 1.8,
    rating: 4.4,
    image: 'tooth',
  },
];

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Aditi Kulkarni',
    specialty: 'Dentist',
    clinicId: '1',
    experience: 12,
    patients: 500,
    reviews: 340,
    rating: 4.8,
    fee: 499,
    status: 'In Cabin',
    availableSlots: ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM'],
  },
  {
    id: '2',
    name: 'Dr. Rahul Mehta',
    specialty: 'General Physician',
    clinicId: '2',
    experience: 8,
    patients: 350,
    reviews: 210,
    rating: 4.6,
    fee: 399,
    status: 'In Cabin',
    availableSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '4:00 PM'],
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    clinicId: '3',
    experience: 15,
    patients: 800,
    reviews: 520,
    rating: 4.9,
    fee: 599,
    status: 'Available',
    availableSlots: ['11:00 AM', '2:30 PM', '4:00 PM'],
  },
  {
    id: '4',
    name: 'Dr. Suresh Iyer',
    specialty: 'Ophthalmologist',
    clinicId: '4',
    experience: 10,
    patients: 420,
    reviews: 280,
    rating: 4.7,
    fee: 549,
    status: 'In Cabin',
    availableSlots: ['9:30 AM', '12:00 PM', '3:00 PM'],
  },
  {
    id: '5',
    name: 'Dr. Amit Verma',
    specialty: 'Pathologist',
    clinicId: '5',
    experience: 6,
    patients: 200,
    reviews: 150,
    rating: 4.5,
    fee: 299,
    status: 'Available',
    availableSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'],
  },
  {
    id: '6',
    name: 'Dr. Nikhil Joshi',
    specialty: 'Dentist',
    clinicId: '6',
    experience: 7,
    patients: 280,
    reviews: 190,
    rating: 4.4,
    fee: 449,
    status: 'On Break',
    availableSlots: ['1:00 PM', '2:30 PM', '4:30 PM'],
  },
];

export const user: UserProfile = {
  name: 'Rahul Sharma',
  firstName: 'Rahul',
  location: 'Andheri, Mumbai',
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
