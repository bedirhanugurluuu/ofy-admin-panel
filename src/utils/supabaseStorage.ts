import { supabase } from '../config/supabase'
import { supabaseAdmin } from '../config/supabaseAdmin'

// Supabase Storage utility functions
export const storageUtils = {
  // Delete file from Supabase Storage
  deleteFile: async (filePath: string, bucket: string = 'uploads') => {
    if (!filePath) return { error: null }
    
    try {
      let cleanPath = filePath;
      
      // Handle full URLs
      if (filePath.includes('supabase.co')) {
        const urlParts = filePath.split('/');
        cleanPath = urlParts[urlParts.length - 1]; // Get the last part (filename)
      }
      // Remove /uploads/ prefix if present
      else if (filePath.startsWith('/uploads/')) {
        cleanPath = filePath.replace('/uploads/', '');
      }
      
      console.log('Storage silme işlemi:')
      console.log('- Original filePath:', filePath)
      console.log('- Clean path:', cleanPath)
      console.log('- Bucket:', bucket)
      
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([cleanPath])
      
      if (error) {
        console.error('Storage silme hatası:', error)
        // Don't throw error, just log it
        return { error }
      }
      
      console.log('Storage silme başarılı!')
      return { error: null }
    } catch (err) {
      console.error('Storage silme hatası:', err)
      return { error: err }
    }
  },

  // Upload file to Supabase Storage
  uploadFile: async (file: File, path: string, bucket: string = 'uploads') => {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      console.error('Upload hatası:', err)
      return { data: null, error: err }
    }
  },

  // Get public URL for a file
  getPublicUrl: (path: string, bucket: string = 'uploads') => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

