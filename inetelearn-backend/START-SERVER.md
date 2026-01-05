# How to Start the Backend Server

## Quick Start

1. **Open a new terminal/PowerShell window**

2. **Navigate to the backend folder:**
   ```powershell
   cd C:\IneteLearnApp\IneteLearnApp\inetelearn-backend
   ```

3. **Start the server:**
   ```powershell
   npm start
   ```

## Expected Output

When the server starts successfully, you should see:
```
✅ Connected to MongoDB - IneteDB
🚀 IneteLearn API Server running on port 3000
🌐 Environment: development
```

## Verify It's Working

Open your browser and visit:
- http://localhost:3000/api/health

You should see a JSON response like:
```json
{
  "status": "OK",
  "message": "IneteLearn API is running",
  "database": "Connected"
}
```

## Keep It Running

- **Keep this terminal window open** while developing
- The server must be running for your app to work
- Press `Ctrl+C` to stop the server when done

## Troubleshooting

- **Port 3000 already in use?** 
  - Change the port in `server.js` (line 393) or kill the process using port 3000

- **MongoDB connection error?**
  - Check your internet connection
  - The server uses the MongoDB connection string from environment or default

- **Module not found errors?**
  - Run `npm install` in the backend folder

