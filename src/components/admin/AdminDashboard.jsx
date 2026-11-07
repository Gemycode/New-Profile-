import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  BarChart3,
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare
} from 'lucide-react'
import { useProjects, useTestimonials, useEducation, useServices } from '../../hooks/useFirebase'

const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch data
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { data: education, isLoading: educationLoading } = useEducation()
  const { data: services, isLoading: servicesLoading } = useServices()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase, onClick: () => onNavigate('projects') },
    { id: 'testimonials', label: 'Testimonials', icon: Users, onClick: () => onNavigate('testimonials') },
    { id: 'education', label: 'Education', icon: GraduationCap, onClick: () => onNavigate('education') },
    { id: 'services', label: 'Services', icon: FileText, onClick: () => onNavigate('services') },
    { id: 'messages', label: 'Messages', icon: MessageSquare, onClick: () => onNavigate('messages') },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const stats = [
    { 
      label: 'Projects', 
      value: projects?.length || 0, 
      change: '+12%',
      published: projects?.filter(p => p.status === 'published').length || 0
    },
    { 
      label: 'Testimonials', 
      value: testimonials?.length || 0, 
      change: '+5%',
      published: testimonials?.filter(t => t.status === 'published').length || 0
    },
    { 
      label: 'Education', 
      value: education?.length || 0, 
      change: '+2%',
      published: education?.filter(e => e.status === 'published').length || 0
    },
    { 
      label: 'Services', 
      value: services?.length || 0, 
      change: '+8%',
      published: services?.filter(s => s.status === 'published').length || 0
    }
  ]

 return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Header */}
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              <Plus size={20} className="mr-2" />
              New Content
            </button>
          </div>
        </div>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  if (tab.onClick) {
                    tab.onClick()
                  } else {
                    setActiveTab(tab.id)
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Edit size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Project "E-Commerce App" was updated
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Plus size={16} className="text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      New testimonial added
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">5 hours ago</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tab content would go here */}
          {activeTab !== 'overview' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Content management for {activeTab} will be implemented here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)
}

export default AdminDashboard
