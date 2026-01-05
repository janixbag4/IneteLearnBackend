# IneteLearn Backend

Local development server for the IneteLearn app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional - server will use default MongoDB connection):
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your-secret-key
```

## Running the Server

Start the local backend server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Using Local Backend in App

To use the local backend instead of the deployed one on Render:

1. Create a `.env` file in the root `IneteLearnApp` directory:
```env
EXPO_PUBLIC_USE_LOCAL_BACKEND=true
```

2. Or temporarily change `USE_LOCAL_BACKEND` to `true` in `inetelearn-backend/config/api.tsx`

3. Make sure the backend server is running before starting the app

## API Endpoints

- `GET /` - API info
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/dictionary` - Get all dictionary words
- `GET /api/dictionary/search?query=...` - Search dictionary
- `POST /api/dictionary/contribute` - Add new word
- `GET /api/health` - Health check

## Notes

- The server uses the same MongoDB database as production (unless you change MONGODB_URI)
- Make sure port 3000 is not in use by another application
- For mobile testing, use your computer's IP address instead of localhost (e.g., `http://192.168.1.100:3000`)

