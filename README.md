# SkillBridge E-commerce Platform (Full-Stack)

A complete e-commerce platform with React frontend and Node.js backend, featuring user authentication, product management, shopping cart, and order processing.

## 🚀 Live Demo
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📋 Features

### User Features
- ✅ User registration and login
- ✅ Browse products with search and pagination
- ✅ Product details view
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Responsive design with TailwindCSS

### Admin Features
- ✅ Admin dashboard
- ✅ Product management (CRUD operations)
- ✅ Order management
- ✅ Sales analytics
- ✅ Inventory management

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation

## 📁 Project Structure

```
final-project/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── App.tsx         # Main app
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Quick Setup (Recommended)

1. **Clone and install dependencies:**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. **Start both servers:**
```bash
# Start backend (in root directory)
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

3. **Seed the database with sample data:**
```bash
# Run this in the root directory
node seed.js
```

### Test Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@skillbridge.com`
- Password: `Admin123!`

**Regular User:**
- Email: `user@skillbridge.com`
- Password: `User123!`

### Manual Setup

#### Backend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
```

3. **Configure your `.env` file:**
```env
MONGODB_URI="mongodb://localhost:27017/skillbridge_dev"
JWT_SECRET="super_strong_secret_key_change_me_123"
PORT=3000
NODE_ENV=development
```

4. **Start the backend server:**
```bash
npm run dev
```

The backend will run at `http://localhost:3000`

#### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the frontend:**
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with pagination/search)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order (Authenticated users)
- `GET /api/orders` - Get user orders (Authenticated users)

## 🎯 Usage

1. **Register a new account** or login as existing user
2. **Browse products** using the search and filter options
3. **Add items to cart** and manage quantities
4. **Place orders** and track order history
5. **Admin users** can manage products and view analytics

## 🔐 Authentication

- JWT tokens are used for authentication
- Tokens are stored in localStorage
- Protected routes require valid authentication
- Role-based access control (USER/ADMIN)

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with TailwindCSS
- **Interactive Elements**: Smooth transitions and hover effects
- **Loading States**: Proper loading indicators for better UX
- **Error Handling**: User-friendly error messages

## 📦 Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the Node.js application
3. Ensure MongoDB is accessible (MongoDB Atlas recommended)

### Frontend Deployment (Vercel/Netlify)
1. Build the application: `npm run build`
2. Deploy the dist folder to your hosting platform
3. Configure API endpoint if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Use MongoDB Atlas for cloud database

2. **CORS Issues**:
   - Backend CORS is configured for frontend
   - Ensure both servers are running on correct ports

3. **Authentication Issues**:
   - Check JWT_SECRET is set in `.env`
   - Clear browser localStorage if needed

## 📞 Support

For support or questions, please open an issue in the repository.
