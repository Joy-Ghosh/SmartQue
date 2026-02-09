# SmartQ - Queue Management Application

## Overview
SmartQ is a mobile-first queue management application for patients visiting clinics. Built with Expo (React Native) + Express backend. Patients can browse clinics, join queues, and get smart notifications about when to leave home based on their travel time.

## Recent Changes
- Feb 2026: Initial build with all core screens
  - Home screen with clinic search, category filtering, live queue badges
  - Clinic detail with doctor profile, transport mode selection, emergency booking
  - Active Token screen with live progress bar, smart leave-time calculations
  - Appointments tab showing active/past bookings
  - Profile tab with user info and settings

## Architecture
- **Frontend**: Expo Router with file-based routing, React Native
- **Backend**: Express.js on port 5000
- **State**: React Context (QueueProvider) for queue management
- **Fonts**: Inter (Google Fonts)
- **Colors**: Primary Teal (#0F766E), medical/trustworthy theme
- **Mock Data**: All clinic/doctor data in lib/data.ts

## Key Files
- `app/(tabs)/index.tsx` - Home screen
- `app/(tabs)/appointments.tsx` - Appointments screen
- `app/(tabs)/profile.tsx` - Profile screen
- `app/clinic/[id].tsx` - Clinic detail & booking
- `app/active-token.tsx` - Active token/queue status
- `lib/data.ts` - Mock data (clinics, doctors, user)
- `lib/queue-context.tsx` - Queue state management
- `constants/colors.ts` - Theme colors

## User Preferences
- Medical/healthcare theme with teal primary color
- Mobile-first design inspired by modern healthcare apps
- Clean, trustworthy UI
