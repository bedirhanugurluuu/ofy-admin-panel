import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Header ayarları için tip tanımları
export interface HeaderSettings {
  id: string
  logo_text?: string
  logo_image_url?: string
  menu_items: MenuItem[]
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  href: string
  label: string
  order: number
}

// Auth helper functions
export const auth = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Storage helper functions
export const storage = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { error }
  }
}

// Header ayarlarını getir
export async function getHeaderSettings(): Promise<HeaderSettings | null> {
  const { data, error } = await supabase
    .from('header_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching header settings:', error)
    return null
  }

  return data
}

// Header ayarlarını güncelle
export async function updateHeaderSettings(settings: Partial<HeaderSettings>): Promise<HeaderSettings | null> {
  const { data, error } = await supabase
    .from('header_settings')
    .upsert(settings)
    .select()
    .single()

  if (error) {
    console.error('Error updating header settings:', error)
    return null
  }

  return data
}

// Logo resmini yükle
export async function uploadLogoImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `logo-${Date.now()}.${fileExt}`
  const filePath = `header/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading logo:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Eski logo resmini sil
export async function deleteLogoImage(imageUrl: string): Promise<boolean> {
  try {
    // URL'den dosya yolunu çıkar
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `header/${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting logo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting logo:', error)
    return false
  }
}
