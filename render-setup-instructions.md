# Quick Fix for Empty Database

## The Issue
Your Vercel frontend and Render backend are perfectly integrated! The only issue is that your MongoDB database is empty, so no products show up.

## Solution: Set up MongoDB on Render

### Step 1: Add MongoDB to your Render service
1. Go to your Render dashboard: https://dashboard.render.com/
2. Navigate to your backend service
3. Click "Add Service" → "MongoDB"
4. Give it a name like "skillbridge-db"
5. Select the free tier
6. Click "Create MongoDB"

### Step 2: Get the MongoDB connection string
1. Once created, click on your MongoDB service
2. Go to the "Info" tab
3. Copy the "External Database URL"

### Step 3: Add environment variable to your backend
1. Go back to your backend service on Render
2. Go to "Environment" tab
3. Add a new environment variable:
   - Key: `MONGODB_URI`
   - Value: (paste the MongoDB URL from step 2)
4. Also add: `JWT_SECRET` with value: `super_strong_secret_key_change_me_123`
5. Click "Save Changes"
6. Trigger a new deployment

### Step 4: Seed the database
Once your backend redeploys with the MongoDB connection, the database will be ready. You can then:

1. Test the API: https://skill-bridge-e-commerce-final-project.onrender.com/api/products
2. The products should appear empty initially
3. Your frontend will now be able to connect to the database

### Alternative: Use the seed script
If you want to add sample products, you can run:
```bash
# Set your MongoDB URI first
export MONGODB_URI="your-mongodb-url-from-render"
node seed.js
```

## Test Your Integration
After setting up MongoDB:
1. Visit: https://skill-bridge-e-commerce-final-proje.vercel.app/
2. You should see products (once seeded)
3. Try registering and logging in

Your integration is working perfectly - you just need a database!
