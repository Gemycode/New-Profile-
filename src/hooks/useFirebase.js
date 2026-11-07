import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db, COLLECTIONS } from '../lib/firebase'
import toast from 'react-hot-toast'

// Generic collection hook
export const useCollection = (collectionName) => {
  return useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, collectionName))
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }
  })
}

// Generic create hook
export const useCreateDocument = (collectionName) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] })
      toast.success('Created successfully!')
    }
  })
}

// Generic update hook
export const useUpdateDocument = (collectionName) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp()
      })
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] })
      toast.success('Updated successfully!')
    }
  })
}

// Generic delete hook
export const useDeleteDocument = (collectionName) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, collectionName, id))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] })
      toast.success('Deleted successfully!')
    }
  })
}

// Specific hooks
export const useProjects = () => useCollection(COLLECTIONS.PROJECTS)
export const useTestimonials = () => useCollection(COLLECTIONS.TESTIMONIALS)
export const useEducation = () => useCollection(COLLECTIONS.EDUCATION)
export const useServices = () => useCollection(COLLECTIONS.SERVICES)