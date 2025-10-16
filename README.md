# FOXCARZ - Premium Car Rental Service

FOXCARZ is a modern, full-stack car rental application built with React, TypeScript, and Express. It offers a seamless car rental experience with features like real-time availability, instant booking, and zero-deposit rentals.

![FOXCARZ Preview](preview.png)

## 🚀 Features

- **Zero Deposit Policy**: Book cars without any security deposit
- **Unlimited Kilometers**: No mileage restrictions on rentals
- **Real-time Availability**: Check car availability instantly
- **Flexible Booking**: Hourly, daily, and weekly rental options
- **24/7 Support**: Round-the-clock customer assistance
- **Secure Payments**: Safe and reliable payment processing
- **Multiple Locations**: Convenient pickup and drop-off points
- **Special Offers**: Regular promotions and loyalty rewards
- **Real-time Analytics Dashboard**:
  - Live booking statistics and revenue tracking
  - Interactive data visualization with charts
  - Instant updates on new bookings
  - Custom date range analysis
  - Trend analysis and reporting

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - React Query
  - Wouter for Routing
  - Socket.IO Client
  - Recharts for Data Visualization
  - Real-time Dashboard Updates

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - Drizzle ORM
  - PostgreSQL (Neon)
  - Socket.IO for Real-time Updates
  - Real-time Analytics Engine

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/foxcarz.git
   cd foxcarz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL='your_postgresql_connection_string'
   NODE_ENV=development
   PORT=8001
   VITE_API_URL=http://localhost:8001
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development servers:
   ```bash
   # Terminal 1 - Start the backend server
   npm run dev

   # Terminal 2 - Start the frontend
   cd client && npm run dev
   ```

6. Open http://localhost:8000 in your browser

## 📚 Documentation

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: development/production
- `PORT`: Backend server port
- `VITE_API_URL`: Backend API URL for frontend

### Database Schema

The application uses PostgreSQL with Drizzle ORM. Main tables:

- **vehicles**: Car inventory and details
- **bookings**: Rental bookings and customer info
- **locations**: Pickup/drop-off locations

### API Endpoints

#### Authentication Endpoints

```http
POST /api/auth/signup
```
Register a new user
- Body: `{ "name": string, "email": string, "password": string }`
- Response: `{ "message": string, "userId": string }`

```http
POST /api/auth/signin
```
Sign in existing user
- Body: `{ "email": string, "password": string }`
- Response: `{ "message": string, "userId": string }`

```http
POST /api/auth/admin/login
```
Admin login
- Body: `{ "email": string, "password": string }`
- Response: `{ "message": string, "adminId": string }`

```http
GET /api/auth/me
```
Get current user info
- Response: `{ "user": { "id": string, "name": string, "email": string, "isAdmin": boolean } }`

#### Vehicle Endpoints

```http
GET /api/vehicles
```
List all available vehicles
- Query Parameters:
  - `category`: Filter by category (optional)
  - `available`: Filter by availability (optional)
- Response: Array of vehicle objects

```http
GET /api/vehicles/:id
```
Get vehicle details
- Response: Vehicle object

```http
POST /api/vehicles
```
Add new vehicle (Admin only)
- Body: Vehicle details
- Response: Created vehicle object

#### Booking Endpoints

```http
POST /api/bookings
```
Create new booking (Authenticated users only)
- Body: 
```json
{
  "vehicleId": string,
  "customerName": string,
  "customerPhone": string,
  "customerWhatsapp": string,
  "locationId": string,
  "startDate": string,
  "endDate": string,
  "startTime": string,
  "totalCost": number,
  "rentalType": "hourly" | "daily" | "weekly"
}
```
- Response: Booking confirmation object

```http
GET /api/bookings
```
Get all bookings (Admin only)
- Response: Array of booking objects

#### Location Endpoints

```http
GET /api/locations
```
List all pickup/drop-off locations
- Response: Array of location objects

```http
POST /api/locations
```
Add new location (Admin only)
- Body: Location details
- Response: Created location object

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Neon](https://neon.tech) for PostgreSQL hosting

## 🤝 Support

For support, email info@foxcarz.com or join our WhatsApp support.