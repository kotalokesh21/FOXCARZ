# Drive Easy - Car Rental Website

## Overview
A modern, mobile-first car rental website inspired by Longdrive Cars, built with React, TypeScript, and Express. The platform enables users to browse vehicles, view detailed specifications, and complete bookings through a streamlined 3-step process.

## Project Structure

### Frontend (React + TypeScript)
- **Pages:**
  - `/` - Home page with hero section, features, and featured vehicles
  - `/fleet` - Vehicle fleet with filtering and sorting
  - `/vehicle/:id` - Individual vehicle details and pricing
  - `/booking` - 3-step booking flow (contact info → date/time → vehicle selection)

- **Key Components:**
  - Header with navigation and theme toggle
  - Footer with contact information and WhatsApp integration
  - VehicleCard - Reusable card for vehicle display
  - HeroSection - Landing page hero with value propositions
  - FeaturesSection - Key benefits (unlimited kms, no deposit, 24/7 support)

### Backend (Express + TypeScript)
- **API Endpoints:**
  - `GET /api/vehicles` - List all vehicles
  - `GET /api/vehicles/:id` - Get vehicle by ID
  - `GET /api/locations` - List pickup locations
  - `POST /api/bookings` - Create new booking
  - `GET /api/bookings` - List all bookings

- **Storage:**
  - In-memory storage with seeded data
  - 9 vehicles across 4 categories (sedan, suv, hatchback, luxury)
  - 4 pickup locations in Hyderabad

### Data Models
- **Vehicle:** name, category, image, seats, transmission, fuel type, pricing (hourly/daily/weekly), features
- **Location:** name, address, city, phone
- **Booking:** customer info, vehicle, location, dates/times, rental type, total cost

## Features
- **Unlimited Kilometers** - No mileage restrictions
- **Zero Deposit** - Instant booking without advance deposit
- **24/7 Support** - WhatsApp and phone support
- **Transparent Pricing** - No hidden charges
- **3-Step Booking Flow** - Simple and intuitive
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - Full dark mode support
- **Real Vehicle Data** - Authentic pricing and specifications

## Design System
- **Primary Color:** Blue (210 80% 45%) - Professional automotive blue
- **Typography:** Inter for UI, Poppins for headings
- **Spacing:** Consistent 4px grid system
- **Components:** Shadcn UI with custom automotive theme
- **Interactions:** Subtle hover elevations, smooth transitions

## Tech Stack
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Express.js backend
- Zod for validation
- React Hook Form for forms

## Recent Changes (October 15, 2025)
- Initial project setup with complete car rental MVP
- Implemented all core features: vehicle browsing, filtering, booking
- Added 3-step booking flow with form validation
- Integrated WhatsApp support links
- Created comprehensive design system following automotive industry standards
- Seeded database with 9 vehicles and 4 locations

## Environment
- Development server runs on port 5000
- Frontend and backend served together via Vite proxy
- No external API keys required for basic functionality
