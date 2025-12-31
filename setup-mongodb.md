# MongoDB Setup Instructions

## Option 1: Use MongoDB Atlas (Recommended for production)
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update your .env file with the correct MONGODB_URI

## Option 2: Install MongoDB Locally (Recommended for development)

### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service:
   ```
   net start MongoDB
   ```
4. Update .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/skillbridge_dev
   ```

### Using Docker (if available):
1. Run: `docker run -d -p 27017:27017 --name mongodb mongo`
2. Update .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/skillbridge_dev
   ```

## Current Issue
The MongoDB Atlas connection is failing due to DNS resolution issues. The cluster hostname `cluster0.tsckxqi.mongodb.net` cannot be resolved from your network.

## Quick Fix
For now, you can:
1. Install MongoDB locally using the instructions above
2. Or use a different MongoDB Atlas cluster with a different hostname
