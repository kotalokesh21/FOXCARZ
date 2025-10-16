# FOX-CARZ Documentation

Welcome to the FOX-CARZ documentation! This guide will help you understand and work with our car rental platform.

## Getting Started

### Prerequisites
- Node.js 18 or later
- PostgreSQL database
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Start the development server

## Features

### User Features
- Browse available cars
- Make reservations
- View booking history
- Real-time availability updates

### Admin Features
- Manage car inventory
- Process bookings
- View real-time analytics
- Generate reports

### Real-time Dashboard
The admin dashboard provides real-time updates using WebSocket connections:
- Live booking statistics
- Revenue tracking
- Interactive charts
- Custom date range analysis

## API Documentation

### Authentication Endpoints
- POST /api/auth/signup
- POST /api/auth/signin
- POST /api/auth/admin/login
- GET /api/auth/me

### Vehicle Endpoints
- GET /api/vehicles
- POST /api/vehicles
- GET /api/vehicles/:id
- PUT /api/vehicles/:id

### Booking Endpoints
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/:id
- PUT /api/bookings/:id

## Development

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
├── server/           # Backend Express application
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── shared/          # Shared types and utilities
```

### Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run check`: Type checking
- `npm run db:push`: Update database schema

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Flow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style
- Use TypeScript
- Follow ESLint rules
- Write meaningful commits
- Add tests for new features

## Deployment

### Production Setup
1. Build the application
2. Set environment variables
3. Start the server

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=production
PORT=8001
```

## Support

Need help? Contact us:
- Email: support@foxcarz.com
- GitHub Issues
- Documentation Site