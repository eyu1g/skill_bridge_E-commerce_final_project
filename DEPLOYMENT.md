# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)
1. **Frontend Deployment:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Backend Deployment (Render.com):**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a "Web Service"
   - Set build command: `npm install`
   - Set start command: `node src/production-server.js`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: production

### Option 2: Netlify (Frontend) + Render (Backend)
1. **Frontend on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `frontend/dist` folder
   - Or connect GitHub for auto-deploys

2. **Backend on Render:**
   - Same as above

### Option 3: Railway (Full Stack)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway will auto-detect and deploy both frontend and backend

## Environment Variables Setup

### Backend Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: production

### Frontend Required Variables:
- `VITE_API_URL`: Your deployed backend URL

## MongoDB Setup

### Option 1: MongoDB Atlas (Free)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster
3. Get connection string
4. Add to environment variables

### Option 2: Render MongoDB (Free)
1. Create "Mongo" service on Render
2. Connect to your backend service

## Deployment Checklist

- [ ] Update frontend API URL to deployed backend
- [ ] Set all environment variables
- [ ] Test all endpoints
- [ ] Verify database connection
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test order placement
- [ ] Check responsive design

## Post-Deployment Testing

1. **Health Check:** Visit `https://your-backend-url.com/`
2. **API Test:** Visit `https://your-backend-url.com/api/products`
3. **Frontend Test:** Visit your frontend URL
4. **Full Flow Test:** Register → Browse → Add to Cart → Checkout

## Troubleshooting

### Common Issues

#### 1. **Registration Fails on Vercel**
**Problem**: User registration works locally but fails on deployed site
**Causes**:
- CORS configuration blocking requests
- Environment variables not set correctly
- API proxy misconfigured

**Solutions**:
```bash
# Check CORS is configured for your Vercel URL
# In backend app.js, ensure CORS allows: https://*.vercel.app

# Check environment variables on Vercel
# VITE_API_URL should be: https://your-backend.onrender.com/

# Check Vite proxy configuration
# Should use process.env.VITE_API_URL instead of localhost
```

#### 2. **Database Connection Issues**
**Problem**: Backend can't connect to MongoDB Atlas
**Solutions**:
```bash
# Verify connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/dbname

# Check IP whitelist
# In MongoDB Atlas, ensure 0.0.0.0/0 is allowed

# Test connection locally
# node -e "require('mongoose').connect(process.env.MONGODB_URI)"
```

#### 3. **Build Failures**
**Problem**: Vercel build fails
**Solutions**:
```bash
# Ensure package.json has build script
# "build": "vite build"

# Check for TypeScript errors
# npm run build should complete without errors

# Check environment variables
# All required variables must be set
```

#### 4. **API 404 Errors**
**Problem**: Frontend can't reach backend API
**Solutions**:
```bash
# Check backend is running
# Verify API endpoints exist

# Check Vercel environment variables
# VITE_API_URL must match deployed backend URL

# Check CORS configuration
# Backend must allow frontend origin
```

#### 5. **CORS Errors**
**Problem**: Frontend can't reach backend API due to CORS
**Solutions**:
```bash
# Update CORS origins in backend
```

#### 6. **Environment Variables**
**Problem**: Environment variables not set correctly
**Solutions**:
```bash
# Ensure all environment variables are set
```

### Debug Commands

#### Check Vercel Logs
```bash
vercel logs
```

#### Check Environment Variables
```bash
vercel env ls
```

#### Redeploy with Changes
```bash
vercel --prod --yes
```
