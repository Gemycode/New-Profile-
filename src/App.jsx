import React, { Suspense, lazy, useEffect, useState } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { registerServiceWorker, addResourceHints, performanceMonitor } from "./utils/performance.jsx"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The application encountered an error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Lazy load components for better performance
const Navbar = lazy(() => import("./components/Navbar"))
const Hero = lazy(() => import("./components/Hero"))
const About = lazy(() => import("./components/About"))
const Services = lazy(() => import("./components/Services"))
const Portfolio = lazy(() => import("./components/Portfolio"))
const Testimonials = lazy(() => import("./components/Testimonials"))
const Education = lazy(() => import("./components/Education"))
const Contact = lazy(() => import("./components/Contact"))
const Footer = lazy(() => import("./components/Footer"))
const AdminApp = lazy(() => import("./components/admin/AdminApp"))

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <motion.div
      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState('home')
  
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.mark('app-start')
    
    // Add resource hints for better performance
    addResourceHints()
    
    // Register service worker
    registerServiceWorker()
    
    // Simple routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#admin') {
        setCurrentRoute('admin')
      } else {
        setCurrentRoute('home')
      }
    }
    
    // Check initial route
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    // Mark app as ready
    const timer = setTimeout(() => {
      performanceMonitor.mark('app-ready')
      performanceMonitor.measure('app-initialization', 'app-start', 'app-ready')
    }, 100)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      clearTimeout(timer)
    }
  }, [])
  
  // Admin route
  if (currentRoute === 'admin') {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <motion.div 
              className="min-h-screen bg-gray-50 dark:bg-gray-900"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    borderRadius: '12px',
                    border: '1px solid var(--toast-border)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
              
              <Suspense fallback={<LoadingSpinner />}>
                <AdminApp />
              </Suspense>
            </motion.div>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    )
  }
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <motion.div 
            className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 no-horizontal-scroll"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  borderRadius: '12px',
                  border: '1px solid var(--toast-border)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
            
            {/* Navigation */}
            <Suspense fallback={<div className="h-16" />}>
              <Navbar />
            </Suspense>
            
            {/* Main Content */}
            <main className="relative">
              <Suspense fallback={<LoadingSpinner />}>
                <Hero />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Portfolio />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <About />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Education />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Services />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Testimonials />
              </Suspense>
              
              <Suspense fallback={<LoadingSpinner />}>
                <Contact />
              </Suspense>
            </main>
            
            {/* Footer */}
            <Suspense fallback={<div className="h-20" />}>
              <Footer />
            </Suspense>
            
          </motion.div>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
