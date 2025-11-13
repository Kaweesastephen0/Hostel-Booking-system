![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
## The Hostel Booking system Documentation 

## KAWEESA STEPHEN (GROUP LEADER)
 NB: If anyone is documenting their part, put your name first for identification.
  
## Stephen

#  Complete Setup Guide

A fully responsive MERN stack application for booking hostels across Uganda, featuring Kampala, Mukono, Jinja, and Gulu cities with UGX pricing.

##  Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Backend Setup

```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies
npm install

# Create environment file (optional - defaults provided)
# Create .env file with your MongoDB connection string:
# MONGODB_URI=mongodb://localhost:27017/uganda-hostel-booking
# PORT=5001
# NODE_ENV=development

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5001`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd FRONTEND

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port)

### 3. Database Setup

```bash
# Make sure MongoDB is running on your system
# Then seed the database with sample data
cd BACKEND
npm run seed
```

##  Project Structure

```
Hostel-Booking-system/
|
|___ ADMIN
|      |              |----controllers
|      |              |____models
|      |___BACKEND ---|____middlewares
|      |              |____routes
|      |
|      └──FRONTEND
|           |
|           |__src
|                |___
|                |
|                |___
|
|
|
├── BACKEND/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── Hostel.js            # Hostel schema/model
│   ├── routes/
│   │   └── hostels.js           # API routes
│   ├── scripts/
│   │   └── seedHostels.js       # Database seeder
│   ├── server.js                # Main server file
│   └── package.json
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HostelCard.jsx   # Individual hostel card
│   │   │   ├── HostelCard.css
│   │   │   ├── HostelList.jsx   # Hostel listing page
│   │   │   └── HostelList.css
|   |   |   |___
|
│   │   ├── services/
│   │   │   └── hostelService.js # API service
│   │   ├── App.jsx              # Main app component
│   │   └── App.css 
             # App styles
│   └── package.json
└── SETUP_GUIDE.md
```

## 🔧 API Endpoints

### Hostels
- `GET /api/hostels` - Get all hostels with optional filters
- `GET /api/hostels/:id` - Get single hostel by ID
- `GET /api/hostels/search/:query` - Search hostels
- `GET /api/hostels/cities/list` - Get list of cities

### Health Check
- `GET /api/health` - API health status

### Query Parameters for `/api/hostels`
- `city` - Filter by city (Kampala, Mukono, Jinja, Gulu)
- `state` - Filter by region (Central Region, Eastern Region, Northern Region)
- `minPrice` - Minimum price filter (in UGX)
- `maxPrice` - Maximum price filter (in UGX)
- `roomType` - Filter by room type (single, double, dormitory, suite)
- `amenities` - Filter by amenities (comma-separated)
- `rating` - Minimum rating filter
- `page` - Page number for pagination
- `limit` - Number of results per page

##  Features

### Frontend Features
-  **Fully Responsive Design** - Works perfectly on all devices (320px to 4K)
-  **Filtering** - Filter by city, region, price, room type, amenities, rating
-  **Search Functionality** - Full-text search across hostel names and descriptions
-  **Pagination Support** - Efficient data loading with page navigation
-  **Real-time API Status** - Connection monitoring with retry functionality
-  **Beautiful UI** - Modern design with smooth animations and hover effects
-  **UGX Currency** - Localized pricing in Ugandan Shillings
-  **Loading States** - Comprehensive loading and error handling

### Backend Features
-  **RESTful API Design** - Clean, well-structured API endpoints
-  **MongoDB Integration** - Robust database with Mongoose ODM
-  **Filtering** - Complex query building with multiple filters
-  **Search Capabilities** - Full-text search with regex patterns
-  **Pagination Support** - Efficient data retrieval with pagination
-  **Error Handling** - Comprehensive error handling middleware
-  **CORS Enabled** - Cross-origin resource sharing for frontend integration

### Database Features
-  **Comprehensive Schema** - Detailed hostel information structure
-  **Multiple Room Types** - Support for single, double, dormitory, suite
-  **Amenities & Location** - Rich metadata for each hostel
-  **Rating System** - Built-in rating and review structure
-  **Image Support** - Multiple images per hostel
-  **Contact Information** - Complete contact and policy details

## 🇺🇬 Uganda-Specific Features

### Cities Covered
- ** Kampala**
- ** Mukono**
- ** Jinja**
- ** Gulu** 

### Localization
- **UGX Currency** - All prices displayed in Ugandan Shillings
- **Local Phone Numbers** - +256 country code format
- **Regional Information** 
- **Cultural Context** 

##  Development

### Adding New Hostels
You can add new hostels by:
1. Modifying `BACKEND/scripts/seedHostels.js`
2. Directly inserting into MongoDB
3. Creating a POST endpoint (not implemented in this version)

### Customizing the Schema
Modify `BACKEND/models/Hostel.js` to add new fields or change existing ones.

##  Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check the connection string in the `.env` file
- Verify all dependencies are installed
- Check console for error messages

### Frontend Issues
- Check if the backend is running on port 5001
- Verify CORS is enabled in the backend
- Check browser console for API errors
- Ensure all dependencies are installed

### Database Issues
- Run the seeder script to populate sample data
- Check MongoDB connection
- Verify the database name in your connection string
- Check MongoDB logs for connection issues

##  Features Being worked On

- **User Authentication** - User registration and login
- **Booking System** - Complete booking and payment integration
- **Review System** - User reviews and ratings
- **Image Upload** - Hostel image management
- **Admin Dashboard** - Hostel management interface
- **Email Notifications** - Booking confirmations

