# Atomix Cafeteria - Development Guide

## Quick Start

### Frontend Only (with Mock Data)
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000` and use mock data when the backend is not available.

### Full Stack Development

#### 1. Start Backend Server
```bash
cd backend
./mvnw spring-boot:run
```
Or if you're on Windows:
```bash
cd backend
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8083`

#### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```

The frontend will automatically connect to the backend API.

## Development Notes

- **Frontend only**: The app gracefully falls back to mock data when backend is unavailable
- **Orders page**: Shows an info alert when using demo data
- **Refresh functionality**: Works in both modes (API + mock data fallback)
- **Dark mode**: Fully functional theme switching
- **Authentication**: Mock authentication when backend unavailable

## Port Configuration

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8083`
- API Base URL: `http://localhost:8083/api/v1`

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure the backend server is running on port 8083. The frontend will automatically fall back to mock data if the backend is unavailable.

### Backend Not Starting
- Ensure Java 17+ is installed
- Check if port 8083 is available
- Verify database configuration in `application.yml` 