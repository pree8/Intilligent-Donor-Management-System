# BloodLink Backend API

Blood donation management system backend built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register/Login)
- Donor search and management with 3-month cooldown period
- Blood request creation and tracking
- Blood bank management and inventory tracking
- Blood type compatibility checking
- Location-based search with distance calculation
- JWT-based authentication
- Real-time notifications support

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

### Setup Steps

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/bloodlink
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Donors
- `GET /api/donors/search` - Search for compatible donors
- `GET /api/donors/:id` - Get donor profile
- `PUT /api/donors/update` - Update donor profile
- `GET /api/donors/:id/eligibility` - Check donation eligibility
- `GET /api/donors/:id/stats` - Get donor statistics

### Blood Requests
- `POST /api/requests` - Create blood request
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id` - Update request status
- `GET /api/requests/nearby` - Get nearby requests for donor

### Blood Banks
- `GET /api/blood-banks` - Get all blood banks
- `GET /api/blood-banks/:id` - Get single blood bank
- `POST /api/blood-banks` - Create blood bank (admin only)
- `PUT /api/blood-banks/:id` - Update blood bank (admin only)
- `PATCH /api/blood-banks/:id/availability` - Update blood availability
- `GET /api/blood-banks/search/location` - Search by location

## Database Models

### User
- Personal information
- Blood type
- Location and coordinates
- Donation history and eligibility
- Account verification status

### BloodBank
- Organization details
- Location and operating hours
- Blood inventory
- Verification status

### BloodRequest
- Requester information
- Blood type and quantity needed
- Location and timeline
- Status tracking
- Donor matches

### Donation
- Donor and blood details
- Donation date and location
- 3-month cooldown period
- Blood bank association

### Notification
- Recipient notification
- Message type and content
- Read/unread status
- Related entity tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All endpoints return JSON responses with a `success` field and appropriate HTTP status codes.

Example error response:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
