import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertTriangle, ExternalLink } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, FIREBASE_CONFIGURED } from '../../lib/firebase'
import toast from 'react-hot-toast'

const AdminAuth = ({ onAuthenticated }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if Firebase is configured
    if (!FIREBASE_CONFIGURED) {
      toast.error('Firebase not configured. Please check the setup instructions.')
      return
    }
    
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      toast.success('Welcome back!')
      onAuthenticated()
    } catch (error) {
      console.error('Auth error:', error)
      if (error.code === 'auth/user-not-found') {
        toast.error('No user found with this email')
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format')
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.')
      } else {
        toast.error('Authentication failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock size={24} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to manage your portfolio content
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {FIREBASE_CONFIGURED ? (
              "Secure admin portal for content management"
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle size={16} />
                  <span>Firebase not configured</span>
                </div>
                <div className="text-xs space-y-1">
                  <p>To enable admin functionality:</p>
                  <p>1. Create a Firebase project</p>
                  <p>2. Enable Authentication with Email/Password</p>
                  <p>3. Add environment variables to .env file</p>
                  <a 
                    href="https://console.firebase.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Firebase Console</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminAuth
