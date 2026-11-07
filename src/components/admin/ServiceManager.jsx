import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Save, 
  X, 
  FileText,
  Trash2,
  Edit,
  DollarSign,
  Clock
} from 'lucide-react'
import { useCreateDocument, useUpdateDocument, useDeleteDocument, useServices } from '../../hooks/useFirebase'
import { COLLECTIONS } from '../../lib/firebase'
import toast from 'react-hot-toast'

const ServiceForm = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    icon: service?.icon || '',
    features: service?.features || [],
    price: service?.price || '',
    duration: service?.duration || '',
    category: service?.category || 'web',
    status: service?.status || 'published',
    popular: service?.popular || false,
    ...service
  })
  
  const [newFeature, setNewFeature] = useState('')
  
  const createService = useCreateDocument(COLLECTIONS.SERVICES)
  const updateService = useUpdateDocument(COLLECTIONS.SERVICES)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (service?.id) {
        await updateService.mutateAsync({ id: service.id, data: formData })
      } else {
        await createService.mutateAsync(formData)
      }
      onSave?.()
    } catch (error) {
      toast.error('حدث خطأ في حفظ الخدمة')
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const serviceCategories = [
    { value: 'web', label: 'تطوير المواقع' },
    { value: 'mobile', label: 'تطوير التطبيقات' },
    { value: 'ui', label: 'تصميم واجهات المستخدم' },
    { value: 'consulting', label: 'استشارات تقنية' },
    { value: 'maintenance', label: 'صيانة ودعم' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {service ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الخدمة *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: تطوير موقع إلكتروني"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              وصف الخدمة *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="اكتب وصفاً تفصيلياً للخدمة..."
            />
          </div>

          {/* Category and Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التصنيف
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {serviceCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحالة
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="published">متاح</option>
                <option value="draft">مسودة</option>
                <option value="archived">غير متاح</option>
              </select>
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                السعر
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: $500 أو حسب المشروع"
                />
                <DollarSign size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مدة التنفيذ
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: 2-4 أسابيع"
                />
                <Clock size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              مميزات الخدمة
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: تصميم متجاوب"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ✓ {feature}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="popular"
              checked={formData.popular}
              onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="popular" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              خدمة شائعة (سيتم إبرازها)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={createService.isPending || updateService.isPending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>
                {createService.isPending || updateService.isPending 
                  ? 'جاري الحفظ...' 
                  : (service ? 'تحديث' : 'حفظ')
                }
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const ServiceManager = ({ onBack }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  
  const { data: services = [], isLoading } = useServices()
  const deleteService = useDeleteDocument(COLLECTIONS.SERVICES)

  const handleEdit = (service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        await deleteService.mutateAsync(id)
      } catch (error) {
        toast.error('حدث خطأ في حذف الخدمة')
      }
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingService(null)
  }

  const getCategoryLabel = (category) => {
    const categories = {
      web: 'تطوير المواقع',
      mobile: 'تطوير التطبيقات',
      ui: 'تصميم واجهات المستخدم',
      consulting: 'استشارات تقنية',
      maintenance: 'صيانة ودعم'
    }
    return categories[category] || category
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الخدمات</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            أضف وعدل واحذف الخدمات التي تقدمها
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>إضافة خدمة</span>
        </button>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {getCategoryLabel(service.category)}
                  </span>
                  {service.popular && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                      شائع
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <div className="mb-4">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-xs text-gray-400">
                        +{service.features.length - 3} مميزات أخرى
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                {service.price && (
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {service.price}
                  </span>
                )}
                {service.duration && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {service.duration}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && services.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد خدمات بعد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ابدأ بإضافة الخدمات التي تقدمها لعملائك
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>إضافة خدمة</span>
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleFormClose}
          onSave={handleFormClose}
        />
      )}
    </div>
  )
}

export default ServiceManager