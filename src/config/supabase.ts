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
  logo_image_url_light?: string
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

// Proje tipi
export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  thumbnail_media?: string
  banner_media?: string
  video_url?: string
  is_featured: boolean
  featured_order?: number
  client_name?: string
  year?: number
  role?: string
  external_link?: string
  slug: string
  created_at: string
  updated_at: string
}

// Service tipi
export interface Service {
  id: string
  title: string
  description: string
  order_index: number
  created_at: string
  updated_at: string
}

// AboutBanner tipi
export interface AboutBanner {
  id: string
  image: string
  title_desktop: string
  title_mobile: string
  button_text: string
  button_link: string
  created_at: string
  updated_at: string
}

// Footer tipi
export interface Footer {
  id: string
  cta_title: string
  cta_link: string
  sitemap_items: Array<{ name: string; link: string }>
  social_items: Array<{ name: string; link: string }>
  copyright_text: string
  created_at: string
  updated_at: string
}

// Contact tipi
export interface ContactContent {
  id: string
  title: string
  phone: string
  email: string
  social_items: Array<{ name: string; link: string }>
  image_path?: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const auth = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (data.session) {
      // Session'ı 8 saat ile sınırla (28800 saniye)
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('session_expires_at', expiresAt)
    }
    
    return { data, error }
  },

  signOut: async () => {
    localStorage.removeItem('session_expires_at')
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    // Session süresini kontrol et
    const expiresAt = localStorage.getItem('session_expires_at')
    if (expiresAt && new Date(expiresAt) < new Date()) {
      // Session süresi dolmuş, otomatik logout
      await auth.signOut()
      return { user: null, error: { message: 'Session expired' } }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Session süresini kontrol et
  checkSessionExpiry: () => {
    const expiresAt = localStorage.getItem('session_expires_at')
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return true // Session süresi dolmuş
    }
    return false
  },

  // Kalan süreyi dakika cinsinden döndür
  getRemainingTime: () => {
    const expiresAt = localStorage.getItem('session_expires_at')
    if (!expiresAt) return 0
    
    const remaining = new Date(expiresAt).getTime() - Date.now()
    return Math.max(0, Math.floor(remaining / (1000 * 60))) // Dakika cinsinden
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

// Projeleri getir
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}

// Services'leri getir
export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

// Service ekle
export async function createService(service: Partial<Service>): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single()

  if (error) {
    console.error('Error creating service:', error)
    return null
  }

  return data
}

// Service güncelle
export async function updateService(id: string, service: Partial<Service>): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating service:', error)
    return null
  }

  return data
}

// Service sil
export async function deleteService(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting service:', error)
    return false
  }

  return true
}

// AboutBanner'ı getir
export async function fetchAboutBanner(): Promise<AboutBanner | null> {
  const { data, error } = await supabase
    .from('about_banner')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching about banner:', error)
    return null
  }

  return data
}

// AboutBanner'ı güncelle
export async function updateAboutBanner(banner: Partial<AboutBanner>): Promise<AboutBanner | null> {
  const { data, error } = await supabase
    .from('about_banner')
    .upsert(banner)
    .select()
    .single()

  if (error) {
    console.error('Error updating about banner:', error)
    return null
  }

  return data
}

// Footer'ı getir
export async function fetchFooter(): Promise<Footer | null> {
  const { data, error } = await supabase
    .from('footer')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching footer:', error)
    return null
  }

  return data
}

// Footer'ı güncelle
export async function updateFooter(footer: Partial<Footer>): Promise<Footer | null> {
  const { data, error } = await supabase
    .from('footer')
    .upsert(footer)
    .select()
    .single()

  if (error) {
    console.error('Error updating footer:', error)
    return null
  }

  return data
}

// Contact'ı getir
export async function fetchContact(): Promise<ContactContent | null> {
  try {
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      // PGRST116 = no rows found, bu normal bir durum
      if (error.code === 'PGRST116') {
        console.log('No contact data found, returning null')
        return null
      }
      console.error('Error fetching contact:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching contact:', error)
    return null
  }
}

// Contact'ı güncelle
export async function updateContact(contact: Partial<ContactContent>): Promise<ContactContent | null> {
  try {
    // Önce mevcut veriyi kontrol et
    const { data: existingData, error: checkError } = await supabase
      .from('contact')
      .select('*')
      .limit(1)
      .maybeSingle()

    let result;
    
    if (existingData) {
      // Mevcut veriyi güncelle
      const { data, error } = await supabase
        .from('contact')
        .update(contact)
        .eq('id', existingData.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Yeni veri oluştur - ID'yi otomatik oluştur
      const { data, error } = await supabase
        .from('contact')
        .insert([contact])
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return result
  } catch (error) {
    console.error('Error updating contact:', error)
    return null
  }
}

// Logo resmini yükle
export async function uploadLogoImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `logo-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Error uploading logo:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName)

  return data.publicUrl
}

// Contact resmini yükle
export async function uploadContactImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `contact-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Error uploading contact image:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName)

  return data.publicUrl
}

// Eski logo resmini sil
export async function deleteLogoImage(imageUrl: string): Promise<boolean> {
  try {
    // URL'den dosya yolunu çıkar
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
      .from('uploads')
      .remove([fileName])

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
