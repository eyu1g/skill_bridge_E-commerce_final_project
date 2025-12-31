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

### Common Issues:
1. **CORS Errors:** Update CORS origins in backend
2. **Database Connection:** Check MONGODB_URI
3. **Build Failures:** Check package.json scripts
4. **Environment Variables:** Ensure all are set

### Debug Commands:
```bash
# Check backend logs
vercel logs

# Check environment variables
vercel env ls

# Redeploy
vercel --prod
```
