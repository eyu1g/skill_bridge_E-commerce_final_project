import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Package, Store } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SkillBridge</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/products'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Products
            </Link>

            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/orders'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Orders
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-sm text-gray-700">{user.username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
