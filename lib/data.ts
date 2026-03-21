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

export const clinics: Clinic[] = [
  {
    "id": "1",
    "name": "City Dental Clinic",
    "type": "dental",
    "address": "Ballygunge, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 18,
    "lat": 22.57544038714942,
    "lng": 88.3531915146855,
    "distance": 2.1,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "7:00",
    "clinicOpenTime": "10:00",
    "clinicCloseTime": "19:00",
    "servingToken": 12,
    "emergencySupported": false,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "2",
    "name": "Life Care Polyclinic",
    "type": "general",
    "address": "Salt Lake, Kolkata",
    "avgWaitTimePerPatient": 10,
    "currentQueueLength": 22,
    "lat": 22.530604147579083,
    "lng": 88.40524323898889,
    "distance": 4.5,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "11:00",
    "clinicCloseTime": "20:00",
    "servingToken": 15,
    "emergencySupported": true,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "3",
    "name": "Sunrise Heart Clinic",
    "type": "cardio",
    "address": "Park Street, Kolkata",
    "avgWaitTimePerPatient": 12,
    "currentQueueLength": 0,
    "lat": 22.52909219091577,
    "lng": 88.32135361860045,
    "distance": 3.1,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
    "state": "closed",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "15:00",
    "clinicCloseTime": "22:00",
    "servingToken": 0,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "4",
    "name": "Kids Care Pediatric",
    "type": "pediatric",
    "address": "New Town, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 14,
    "lat": 22.523178665845606,
    "lng": 88.3948073738152,
    "distance": 3.1,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "7:30",
    "clinicOpenTime": "12:00",
    "clinicCloseTime": "18:00",
    "servingToken": 8,
    "emergencySupported": true,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "5",
    "name": "SkinPlus Clinic",
    "type": "dermatology",
    "address": "Gariahat, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 30,
    "lat": 22.621420321223482,
    "lng": 88.37030616302309,
    "distance": 3.9,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1586773860383-dab5f3bc1bc8?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "10:00",
    "clinicOpenTime": "14:00",
    "clinicCloseTime": "21:00",
    "servingToken": 20,
    "emergencySupported": false,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "6",
    "name": "OrthoCare Center",
    "type": "orthopedic",
    "address": "Behala, Kolkata",
    "avgWaitTimePerPatient": 11,
    "currentQueueLength": 10,
    "lat": 22.545761673053214,
    "lng": 88.40834450081312,
    "distance": 4.8,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "13:00",
    "clinicCloseTime": "19:00",
    "servingToken": 5,
    "emergencySupported": false,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "7",
    "name": "Apollo Emergency Unit",
    "type": "emergency",
    "address": "EM Bypass, Kolkata",
    "avgWaitTimePerPatient": 6,
    "currentQueueLength": 40,
    "lat": 22.617812173445067,
    "lng": 88.31467511198214,
    "distance": 1.8,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "0:00",
    "clinicOpenTime": "0:00",
    "clinicCloseTime": "23:59",
    "servingToken": 25,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "8",
    "name": "Medico Eye Clinic",
    "type": "ophthalmology",
    "address": "Rajarhat, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 12,
    "lat": 22.563864676167267,
    "lng": 88.40167758405619,
    "distance": 6,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "12:00",
    "clinicCloseTime": "18:00",
    "servingToken": 6,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "9",
    "name": "Care & Cure ENT",
    "type": "ent",
    "address": "Dum Dum, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 25,
    "lat": 22.599083718690952,
    "lng": 88.32753739739378,
    "distance": 2,
    "rating": 4.1,
    "image": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "13:00",
    "clinicCloseTime": "20:00",
    "servingToken": 18,
    "emergencySupported": false,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "10",
    "name": "Healthy Smile Dental",
    "type": "dental",
    "address": "Tollygunge, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 16,
    "lat": 22.5741635749567,
    "lng": 88.3280142277194,
    "distance": 5.9,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1551076805-e166946c9eb9?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "7:30",
    "clinicOpenTime": "10:30",
    "clinicCloseTime": "18:30",
    "servingToken": 10,
    "emergencySupported": false,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "11",
    "name": "Pulse Diagnostic Center",
    "type": "general",
    "address": "Howrah, Kolkata",
    "avgWaitTimePerPatient": 10,
    "currentQueueLength": 0,
    "lat": 22.530604373011908,
    "lng": 88.40541878549668,
    "distance": 5.7,
    "rating": 4,
    "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60",
    "state": "closed",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "11:00",
    "clinicCloseTime": "19:00",
    "servingToken": 0,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "12",
    "name": "Fortis Emergency Care",
    "type": "emergency",
    "address": "Anandapur, Kolkata",
    "avgWaitTimePerPatient": 5,
    "currentQueueLength": 50,
    "lat": 22.611292958552045,
    "lng": 88.34289882248558,
    "distance": 3.9,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "0:00",
    "clinicOpenTime": "0:00",
    "clinicCloseTime": "23:59",
    "servingToken": 30,
    "emergencySupported": true,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "13",
    "name": "SkinCare Advanced",
    "type": "dermatology",
    "address": "Park Circus, Kolkata",
    "avgWaitTimePerPatient": 6,
    "currentQueueLength": 28,
    "lat": 22.576068673436428,
    "lng": 88.38945008096395,
    "distance": 5.4,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "10:00",
    "clinicOpenTime": "15:00",
    "clinicCloseTime": "21:00",
    "servingToken": 22,
    "emergencySupported": false,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "14",
    "name": "Bone & Joint Clinic",
    "type": "orthopedic",
    "address": "Barasat, Kolkata",
    "avgWaitTimePerPatient": 10,
    "currentQueueLength": 15,
    "lat": 22.529598838943038,
    "lng": 88.38628066439226,
    "distance": 1.2,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "14:00",
    "clinicCloseTime": "20:00",
    "servingToken": 7,
    "emergencySupported": false,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "15",
    "name": "Child Wellness Center",
    "type": "pediatric",
    "address": "Kestopur, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 17,
    "lat": 22.595357744646535,
    "lng": 88.3658613511781,
    "distance": 1.3,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1587373950294-d4dff8a38ec1?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "12:30",
    "clinicCloseTime": "19:00",
    "servingToken": 9,
    "emergencySupported": true,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "16",
    "name": "Green Leaf Clinic",
    "type": "general",
    "address": "Bagbazar, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 20,
    "lat": 22.583635359567726,
    "lng": 88.33928067940127,
    "distance": 3.8,
    "rating": 4.1,
    "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "11:30",
    "clinicCloseTime": "19:30",
    "servingToken": 14,
    "emergencySupported": false,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "17",
    "name": "SmileCraft Dental",
    "type": "dental",
    "address": "Kasba, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 15,
    "lat": 22.56185000074441,
    "lng": 88.3747720407082,
    "distance": 5.6,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "7:00",
    "clinicOpenTime": "10:00",
    "clinicCloseTime": "18:00",
    "servingToken": 11,
    "emergencySupported": false,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "18",
    "name": "Urban Skin Studio",
    "type": "dermatology",
    "address": "Alipore, Kolkata",
    "avgWaitTimePerPatient": 6,
    "currentQueueLength": 32,
    "lat": 22.5997462042247,
    "lng": 88.385413297773,
    "distance": 4.6,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "10:00",
    "clinicOpenTime": "14:00",
    "clinicCloseTime": "22:00",
    "servingToken": 26,
    "emergencySupported": false,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "19",
    "name": "HeartBeat Clinic",
    "type": "cardio",
    "address": "Esplanade, Kolkata",
    "avgWaitTimePerPatient": 11,
    "currentQueueLength": 0,
    "lat": 22.59908934423978,
    "lng": 88.35482232291407,
    "distance": 2.3,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800&auto=format&fit=crop&q=60",
    "state": "closed",
    "bookingStartTime": "9:30",
    "clinicOpenTime": "16:00",
    "clinicCloseTime": "22:30",
    "servingToken": 0,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "20",
    "name": "Little Steps Pediatric",
    "type": "pediatric",
    "address": "Lake Town, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 19,
    "lat": 22.56362886261071,
    "lng": 88.36510284586586,
    "distance": 2.7,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1586773860383-dab5f3bc1bc8?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "12:00",
    "clinicCloseTime": "18:00",
    "servingToken": 10,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "21",
    "name": "Vision Plus Eye Care",
    "type": "ophthalmology",
    "address": "Ultadanga, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 23,
    "lat": 22.61525488359988,
    "lng": 88.35387838381092,
    "distance": 5.6,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "11:30",
    "clinicCloseTime": "18:30",
    "servingToken": 16,
    "emergencySupported": false,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "22",
    "name": "ENT Care Hub",
    "type": "ent",
    "address": "Sealdah, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 24,
    "lat": 22.59799876771856,
    "lng": 88.37714068725556,
    "distance": 4.7,
    "rating": 4,
    "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "13:00",
    "clinicCloseTime": "20:00",
    "servingToken": 17,
    "emergencySupported": false,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "23",
    "name": "Rapid Care Emergency",
    "type": "emergency",
    "address": "New Alipore, Kolkata",
    "avgWaitTimePerPatient": 5,
    "currentQueueLength": 60,
    "lat": 22.602306929142443,
    "lng": 88.3773039239903,
    "distance": 5.7,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "0:00",
    "clinicOpenTime": "0:00",
    "clinicCloseTime": "23:59",
    "servingToken": 35,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "24",
    "name": "Joint Relief Center",
    "type": "orthopedic",
    "address": "Dhakuria, Kolkata",
    "avgWaitTimePerPatient": 10,
    "currentQueueLength": 13,
    "lat": 22.56327691253821,
    "lng": 88.32582573600564,
    "distance": 5.2,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "13:30",
    "clinicCloseTime": "19:00",
    "servingToken": 6,
    "emergencySupported": false,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "25",
    "name": "Metro Health Clinic",
    "type": "general",
    "address": "Shyambazar, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 16,
    "lat": 22.622548392459723,
    "lng": 88.34784083037981,
    "distance": 1.1,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1551076805-e166946c9eb9?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "11:00",
    "clinicCloseTime": "20:00",
    "servingToken": 8,
    "emergencySupported": false,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "26",
    "name": "Prime Dental Care",
    "type": "dental",
    "address": "Santoshpur, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 27,
    "lat": 22.535143897805487,
    "lng": 88.3833959803934,
    "distance": 1.1,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "7:00",
    "clinicOpenTime": "10:30",
    "clinicCloseTime": "18:30",
    "servingToken": 19,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "27",
    "name": "Elite Skin Clinic",
    "type": "dermatology",
    "address": "Bhawanipore, Kolkata",
    "avgWaitTimePerPatient": 6,
    "currentQueueLength": 29,
    "lat": 22.584132862256187,
    "lng": 88.34289677640345,
    "distance": 2.3,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "10:00",
    "clinicOpenTime": "14:00",
    "clinicCloseTime": "22:00",
    "servingToken": 23,
    "emergencySupported": false,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "28",
    "name": "CarePoint Polyclinic",
    "type": "general",
    "address": "Jadavpur, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 12,
    "lat": 22.581079318642786,
    "lng": 88.3738217650764,
    "distance": 4.7,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "11:00",
    "clinicCloseTime": "19:00",
    "servingToken": 7,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "29",
    "name": "HeartWell Clinic",
    "type": "cardio",
    "address": "Ruby, Kolkata",
    "avgWaitTimePerPatient": 12,
    "currentQueueLength": 0,
    "lat": 22.525051061719168,
    "lng": 88.35215317121119,
    "distance": 3.5,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?w=800&auto=format&fit=crop&q=60",
    "state": "closed",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "15:00",
    "clinicCloseTime": "22:00",
    "servingToken": 0,
    "emergencySupported": true,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "30",
    "name": "TinyCare Pediatric",
    "type": "pediatric",
    "address": "Barrackpore, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 18,
    "lat": 22.600793513324664,
    "lng": 88.33679603625166,
    "distance": 1.6,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1587373950294-d4dff8a38ec1?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "12:00",
    "clinicCloseTime": "18:00",
    "servingToken": 9,
    "emergencySupported": true,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "31",
    "name": "VisionCare Eye",
    "type": "ophthalmology",
    "address": "Baranagar, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 21,
    "lat": 22.613345499875376,
    "lng": 88.36381679558956,
    "distance": 3.5,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "11:30",
    "clinicCloseTime": "18:30",
    "servingToken": 15,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "32",
    "name": "ENT Specialists Hub",
    "type": "ent",
    "address": "Howrah Maidan, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 26,
    "lat": 22.54822893836779,
    "lng": 88.3868505967538,
    "distance": 2.7,
    "rating": 4.1,
    "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "13:00",
    "clinicCloseTime": "20:00",
    "servingToken": 18,
    "emergencySupported": false,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "33",
    "name": "Emergency Plus Hospital",
    "type": "emergency",
    "address": "Park Street, Kolkata",
    "avgWaitTimePerPatient": 5,
    "currentQueueLength": 70,
    "lat": 22.560241444790964,
    "lng": 88.33272255276238,
    "distance": 5.2,
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "0:00",
    "clinicOpenTime": "0:00",
    "clinicCloseTime": "23:59",
    "servingToken": 40,
    "emergencySupported": true,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "34",
    "name": "Lakeview Clinic",
    "type": "general",
    "address": "Lake Gardens, Kolkata",
    "avgWaitTimePerPatient": 9,
    "currentQueueLength": 18,
    "lat": 22.57097212880218,
    "lng": 88.37177362149731,
    "distance": 2.1,
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "11:30",
    "clinicCloseTime": "19:30",
    "servingToken": 10,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "35",
    "name": "Bright Smile Dental",
    "type": "dental",
    "address": "Behala, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 28,
    "lat": 22.575266067547332,
    "lng": 88.32011248070633,
    "distance": 2,
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1586773860383-dab5f3bc1bc8?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "7:30",
    "clinicOpenTime": "10:30",
    "clinicCloseTime": "18:30",
    "servingToken": 21,
    "emergencySupported": false,
    "pricing": {
      "consultation": 300,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 349
    }
  },
  {
    "id": "36",
    "name": "SkinGlow Clinic",
    "type": "dermatology",
    "address": "Kasba, Kolkata",
    "avgWaitTimePerPatient": 6,
    "currentQueueLength": 30,
    "lat": 22.54416317652894,
    "lng": 88.36597030163054,
    "distance": 1.3,
    "rating": 4.5,
    "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "10:00",
    "clinicOpenTime": "14:30",
    "clinicCloseTime": "21:30",
    "servingToken": 24,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "37",
    "name": "HeartCare Center",
    "type": "cardio",
    "address": "EM Bypass, Kolkata",
    "avgWaitTimePerPatient": 11,
    "currentQueueLength": 0,
    "lat": 22.56782147618016,
    "lng": 88.3714008700956,
    "distance": 4.9,
    "rating": 4.7,
    "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60",
    "state": "closed",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "15:30",
    "clinicCloseTime": "22:30",
    "servingToken": 0,
    "emergencySupported": true,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  },
  {
    "id": "38",
    "name": "Happy Kids Clinic",
    "type": "pediatric",
    "address": "Garia, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 20,
    "lat": 22.599209248448577,
    "lng": 88.3912296632064,
    "distance": 1.8,
    "rating": 4.4,
    "image": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop&q=60",
    "state": "booking_open",
    "bookingStartTime": "8:00",
    "clinicOpenTime": "12:00",
    "clinicCloseTime": "18:00",
    "servingToken": 11,
    "emergencySupported": true,
    "pricing": {
      "consultation": 400,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 449
    }
  },
  {
    "id": "39",
    "name": "Clear Vision Eye",
    "type": "ophthalmology",
    "address": "Dum Dum, Kolkata",
    "avgWaitTimePerPatient": 7,
    "currentQueueLength": 22,
    "lat": 22.563416298851596,
    "lng": 88.37004082128162,
    "distance": 3.9,
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "8:30",
    "clinicOpenTime": "11:30",
    "clinicCloseTime": "18:30",
    "servingToken": 14,
    "emergencySupported": false,
    "pricing": {
      "consultation": 700,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 749
    }
  },
  {
    "id": "40",
    "name": "ENT Wellness Center",
    "type": "ent",
    "address": "Ultadanga, Kolkata",
    "avgWaitTimePerPatient": 8,
    "currentQueueLength": 25,
    "lat": 22.56452128821742,
    "lng": 88.40070859902556,
    "distance": 1,
    "rating": 4.1,
    "image": "https://images.unsplash.com/photo-1551076805-e166946c9eb9?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "9:00",
    "clinicOpenTime": "13:00",
    "clinicCloseTime": "20:00",
    "servingToken": 17,
    "emergencySupported": false,
    "pricing": {
      "consultation": 600,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 649
    }
  },
  {
    "id": "41",
    "name": "City Emergency Hub",
    "type": "emergency",
    "address": "New Town, Kolkata",
    "avgWaitTimePerPatient": 5,
    "currentQueueLength": 65,
    "lat": 22.556142001166037,
    "lng": 88.32584554804397,
    "distance": 4.8,
    "rating": 4.8,
    "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60",
    "state": "live",
    "bookingStartTime": "0:00",
    "clinicOpenTime": "0:00",
    "clinicCloseTime": "23:59",
    "servingToken": 38,
    "emergencySupported": true,
    "pricing": {
      "consultation": 500,
      "platformFee": 49,
      "emergencyPremium": 300,
      "total": 549
    }
  }
];

export const doctors: Doctor[] = [
  {
    "id": "1",
    "name": "Dr. Aditi Kulkarni",
    "specialty": "Dental",
    "clinicId": "1",
    "experience": 8,
    "patients": 360,
    "reviews": 120,
    "rating": 4.6,
    "fee": 600,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "2",
    "name": "Dr. Rahul Mehta",
    "specialty": "General",
    "clinicId": "2",
    "experience": 15,
    "patients": 294,
    "reviews": 98,
    "rating": 4.3,
    "fee": 600,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "3",
    "name": "Dr. Priya Sharma",
    "specialty": "Cardio",
    "clinicId": "3",
    "experience": 14,
    "patients": 630,
    "reviews": 210,
    "rating": 4.8,
    "fee": 700,
    "status": "Available",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "4",
    "name": "Dr. Suresh Iyer",
    "specialty": "Pediatric",
    "clinicId": "4",
    "experience": 7,
    "patients": 450,
    "reviews": 150,
    "rating": 4.5,
    "fee": 600,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "5",
    "name": "Dr. Amit Verma",
    "specialty": "Dermatology",
    "clinicId": "5",
    "experience": 19,
    "patients": 261,
    "reviews": 87,
    "rating": 4.4,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "6",
    "name": "Dr. Nikhil Joshi",
    "specialty": "Orthopedic",
    "clinicId": "6",
    "experience": 18,
    "patients": 195,
    "reviews": 65,
    "rating": 4.2,
    "fee": 400,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "7",
    "name": "Dr. Sneha Patil",
    "specialty": "Emergency",
    "clinicId": "7",
    "experience": 12,
    "patients": 900,
    "reviews": 300,
    "rating": 4.7,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "8",
    "name": "Dr. Vikram Singh",
    "specialty": "Ophthalmology",
    "clinicId": "8",
    "experience": 15,
    "patients": 330,
    "reviews": 110,
    "rating": 4.5,
    "fee": 700,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "9",
    "name": "Dr. Ananya Roy",
    "specialty": "ENT",
    "clinicId": "9",
    "experience": 8,
    "patients": 210,
    "reviews": 70,
    "rating": 4.1,
    "fee": 300,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "10",
    "name": "Dr. Rohan Desai",
    "specialty": "Dental",
    "clinicId": "10",
    "experience": 15,
    "patients": 285,
    "reviews": 95,
    "rating": 4.3,
    "fee": 600,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "11",
    "name": "Dr. Aditi Kulkarni",
    "specialty": "General",
    "clinicId": "11",
    "experience": 10,
    "patients": 180,
    "reviews": 60,
    "rating": 4,
    "fee": 700,
    "status": "Available",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "12",
    "name": "Dr. Rahul Mehta",
    "specialty": "Emergency",
    "clinicId": "12",
    "experience": 13,
    "patients": 1020,
    "reviews": 340,
    "rating": 4.8,
    "fee": 300,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "13",
    "name": "Dr. Priya Sharma",
    "specialty": "Dermatology",
    "clinicId": "13",
    "experience": 14,
    "patients": 420,
    "reviews": 140,
    "rating": 4.6,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "14",
    "name": "Dr. Suresh Iyer",
    "specialty": "Orthopedic",
    "clinicId": "14",
    "experience": 11,
    "patients": 255,
    "reviews": 85,
    "rating": 4.2,
    "fee": 600,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "15",
    "name": "Dr. Amit Verma",
    "specialty": "Pediatric",
    "clinicId": "15",
    "experience": 19,
    "patients": 390,
    "reviews": 130,
    "rating": 4.4,
    "fee": 300,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "16",
    "name": "Dr. Nikhil Joshi",
    "specialty": "General",
    "clinicId": "16",
    "experience": 16,
    "patients": 225,
    "reviews": 75,
    "rating": 4.1,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "17",
    "name": "Dr. Sneha Patil",
    "specialty": "Dental",
    "clinicId": "17",
    "experience": 7,
    "patients": 306,
    "reviews": 102,
    "rating": 4.5,
    "fee": 300,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "18",
    "name": "Dr. Vikram Singh",
    "specialty": "Dermatology",
    "clinicId": "18",
    "experience": 11,
    "patients": 495,
    "reviews": 165,
    "rating": 4.7,
    "fee": 400,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "19",
    "name": "Dr. Ananya Roy",
    "specialty": "Cardio",
    "clinicId": "19",
    "experience": 19,
    "patients": 570,
    "reviews": 190,
    "rating": 4.6,
    "fee": 700,
    "status": "Available",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "20",
    "name": "Dr. Rohan Desai",
    "specialty": "Pediatric",
    "clinicId": "20",
    "experience": 12,
    "patients": 360,
    "reviews": 120,
    "rating": 4.3,
    "fee": 700,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "21",
    "name": "Dr. Aditi Kulkarni",
    "specialty": "Ophthalmology",
    "clinicId": "21",
    "experience": 19,
    "patients": 264,
    "reviews": 88,
    "rating": 4.4,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "22",
    "name": "Dr. Rahul Mehta",
    "specialty": "ENT",
    "clinicId": "22",
    "experience": 17,
    "patients": 198,
    "reviews": 66,
    "rating": 4,
    "fee": 400,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "23",
    "name": "Dr. Priya Sharma",
    "specialty": "Emergency",
    "clinicId": "23",
    "experience": 14,
    "patients": 1230,
    "reviews": 410,
    "rating": 4.9,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "24",
    "name": "Dr. Suresh Iyer",
    "specialty": "Orthopedic",
    "clinicId": "24",
    "experience": 15,
    "patients": 234,
    "reviews": 78,
    "rating": 4.2,
    "fee": 400,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "25",
    "name": "Dr. Amit Verma",
    "specialty": "General",
    "clinicId": "25",
    "experience": 12,
    "patients": 285,
    "reviews": 95,
    "rating": 4.3,
    "fee": 600,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "26",
    "name": "Dr. Nikhil Joshi",
    "specialty": "Dental",
    "clinicId": "26",
    "experience": 8,
    "patients": 390,
    "reviews": 130,
    "rating": 4.5,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "27",
    "name": "Dr. Sneha Patil",
    "specialty": "Dermatology",
    "clinicId": "27",
    "experience": 15,
    "patients": 540,
    "reviews": 180,
    "rating": 4.7,
    "fee": 300,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "28",
    "name": "Dr. Vikram Singh",
    "specialty": "General",
    "clinicId": "28",
    "experience": 5,
    "patients": 255,
    "reviews": 85,
    "rating": 4.2,
    "fee": 700,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "29",
    "name": "Dr. Ananya Roy",
    "specialty": "Cardio",
    "clinicId": "29",
    "experience": 17,
    "patients": 600,
    "reviews": 200,
    "rating": 4.6,
    "fee": 700,
    "status": "Available",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "30",
    "name": "Dr. Rohan Desai",
    "specialty": "Pediatric",
    "clinicId": "30",
    "experience": 11,
    "patients": 330,
    "reviews": 110,
    "rating": 4.4,
    "fee": 400,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "31",
    "name": "Dr. Aditi Kulkarni",
    "specialty": "Ophthalmology",
    "clinicId": "31",
    "experience": 5,
    "patients": 285,
    "reviews": 95,
    "rating": 4.3,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "32",
    "name": "Dr. Rahul Mehta",
    "specialty": "ENT",
    "clinicId": "32",
    "experience": 7,
    "patients": 216,
    "reviews": 72,
    "rating": 4.1,
    "fee": 400,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "33",
    "name": "Dr. Priya Sharma",
    "specialty": "Emergency",
    "clinicId": "33",
    "experience": 18,
    "patients": 1500,
    "reviews": 500,
    "rating": 4.9,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "34",
    "name": "Dr. Suresh Iyer",
    "specialty": "General",
    "clinicId": "34",
    "experience": 10,
    "patients": 270,
    "reviews": 90,
    "rating": 4.3,
    "fee": 700,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "35",
    "name": "Dr. Amit Verma",
    "specialty": "Dental",
    "clinicId": "35",
    "experience": 14,
    "patients": 420,
    "reviews": 140,
    "rating": 4.6,
    "fee": 300,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "36",
    "name": "Dr. Nikhil Joshi",
    "specialty": "Dermatology",
    "clinicId": "36",
    "experience": 10,
    "patients": 360,
    "reviews": 120,
    "rating": 4.5,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "37",
    "name": "Dr. Sneha Patil",
    "specialty": "Cardio",
    "clinicId": "37",
    "experience": 6,
    "patients": 660,
    "reviews": 220,
    "rating": 4.7,
    "fee": 500,
    "status": "Available",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "38",
    "name": "Dr. Vikram Singh",
    "specialty": "Pediatric",
    "clinicId": "38",
    "experience": 19,
    "patients": 390,
    "reviews": 130,
    "rating": 4.4,
    "fee": 400,
    "status": "On Break",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "39",
    "name": "Dr. Ananya Roy",
    "specialty": "Ophthalmology",
    "clinicId": "39",
    "experience": 8,
    "patients": 240,
    "reviews": 80,
    "rating": 4.2,
    "fee": 700,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "40",
    "name": "Dr. Rohan Desai",
    "specialty": "ENT",
    "clinicId": "40",
    "experience": 17,
    "patients": 210,
    "reviews": 70,
    "rating": 4.1,
    "fee": 600,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  },
  {
    "id": "41",
    "name": "Dr. Aditi Kulkarni",
    "specialty": "Emergency",
    "clinicId": "41",
    "experience": 9,
    "patients": 1140,
    "reviews": 380,
    "rating": 4.8,
    "fee": 500,
    "status": "In Cabin",
    "availableSlots": [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM"
    ]
  }
];

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
