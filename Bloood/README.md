# BloodLink Nepal - Blood Donation Management System

A comprehensive web application connecting blood donors with recipients across Nepal.

## Project Structure

```
Bloood/
├── index.html                 # Landing page
├── assets/
│   ├── css/
│   │   └── styles.css        # Custom styles
│   ├── images/
│   └── js/
│       └── main.js           # Frontend JavaScript
├── pages/                    # HTML pages
│   ├── about.html
│   ├── blood-banks.html
│   ├── find-donor.html
│   ├── login.html
│   ├── register.html
│   └── request-blood.html
├── backend/                  # Node.js/Express API
│   ├── config/               # Database configuration
│   ├── models/               # Mongoose schemas
│   ├── controllers/          # Route handlers
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── package.json
│   ├── server.js             # Express server
│   ├── .env.example
│   └── README.md             # Backend documentation
└── README.md                 # This file
```

## Features

### Frontend
- ✅ Responsive design with Tailwind CSS
- ✅ User registration and login
- ✅ Find blood donors near you
- ✅ Request blood with location-based search
- ✅ Blood bank directory
- ✅ Blood type compatibility checker
- ✅ Blood donation information

### Backend
- ✅ User authentication with JWT
- ✅ Donor search with distance calculation
- ✅ Blood request management
- ✅ Blood bank directory and inventory
- ✅ 3-month donation cooldown enforcement
- ✅ Location-based services
- ✅ Real-time notifications ready
- ✅ Blood type compatibility system

## Getting Started

### Frontend Setup

1. The frontend is already in place using HTML/CSS/JS
2. Open `index.html` in a browser or serve it via HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Or using http-server (npm package)
npx http-server -p 8000
```

Frontend runs on: `http://localhost:8000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env` with your MongoDB connection:
```
MONGODB_URI=mongodb://localhost:27017/bloodlink
PORT=5000
JWT_SECRET=your_secret_key_here
```

5. Start the backend server:
```bash
npm start
```

Backend runs on: `http://localhost:5000`

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

### Key Endpoints

**Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

**Donors**
```
GET    /api/donors/search
GET    /api/donors/:id
PUT    /api/donors/update
GET    /api/donors/:id/eligibility
```

**Blood Requests**
```
POST   /api/requests
GET    /api/requests
GET    /api/requests/:id
PUT    /api/requests/:id
```

**Blood Banks**
```
GET    /api/blood-banks
GET    /api/blood-banks/:id
POST   /api/blood-banks
PATCH  /api/blood-banks/:id/availability
```

## Technology Stack

### Frontend
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcryptjs for password hashing
- CORS for cross-origin requests

## Key Features Implementation

### Blood Type Compatibility
The system implements a complete blood type compatibility matrix:
- O- Universal Donor
- O+ Can donate to O+, A+, B+, AB+
- A- Can donate to A-, A+, AB-, AB+
- etc.

### 3-Month Donation Cooldown
- Donors can donate again after 3 months
- System tracks last donation date
- Automatically calculates next eligible date
- Prevents users from donating too frequently

### Location-Based Search
- Uses Haversine formula for distance calculation
- Searches donors/blood banks within specified radius
- Supports both city-based and GPS coordinate searches
- Returns results sorted by distance

## File Modifications Made

All location references have been updated to **Dhulikhel, Kavre**:
- Blood bank locations updated
- Search placeholders changed
- Contact information updated
- Hospital references updated

## Installation Requirements

### System Requirements
- Node.js 14.0+
- MongoDB 4.4+
- Modern web browser
- 50MB disk space

### Package Dependencies
See `backend/package.json` for backend dependencies
Frontend uses CDN-hosted libraries (Tailwind, Font Awesome)

## Configuration

### Environment Variables

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/bloodlink
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Database Setup

1. **Start MongoDB**:
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

2. **Create Database** (automatic on first connection)

3. **Optional: Seed Data** (Add test users/banks via API)

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
# Using Python
python -m http.server 8000

# Or using Node
npx http-server -p 8000
```

### Access Application
- Frontend: `http://localhost:8000`
- Backend API: `http://localhost:5000`
- API Health: `http://localhost:5000/api/health`

## Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Email notifications for blood requests
- [ ] SMS integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Donation history tracking
- [ ] Automated donor matching algorithm
- [ ] Blood compatibility report generation

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

**Frontend not loading CSS**
- Check if CDN is accessible
- Verify Tailwind CSS CDN link

**API requests failing from frontend**
- Check CORS settings in backend
- Verify backend is running on correct port
- Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Include error messages and stack traces

---

**Last Updated**: April 26, 2026
**Version**: 1.0.0
**Status**: Beta
