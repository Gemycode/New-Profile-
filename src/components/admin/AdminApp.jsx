import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import AdminAuth from './AdminAuth'
import AdminDashboard from './AdminDashboard'
import ProjectManager from './ProjectManager'
import EducationManager from './EducationManager'
import ServiceManager from './ServiceManager'
import { motion, AnimatePresence } from 'framer-motion'

const AdminApp = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthenticated = () => {
    // This will be triggered by the auth state change
  }

  const renderContent = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectManager onBack={() => setCurrentView('dashboard')} />
      case 'education':
        return <EducationManager onBack={() => setCurrentView('dashboard')} />
      case 'testimonials':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              إدارة التوصيات
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              قريباً - مكون إدارة التوصيات قيد التطوير
            </p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              العودة للوحة الرئيسية
            </button>
          </div>
        )
      case 'services':
        return <ServiceManager onBack={() => setCurrentView('dashboard')} />
      case 'messages':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              إدارة الرسائل
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              قريباً - مكون إدارة الرسائل قيد التطوير
            </p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              العودة للوحة الرئيسية
            </button>
          </div>
        )
      case 'dashboard':
      default:
        return <AdminDashboard onNavigate={setCurrentView} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (!user) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />
  }

  return (
    <AnimatePresence>
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  )
}

export default AdminApp