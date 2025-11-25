import { supabase } from '../config/supabase'

// Generic CRUD operations
export const api = {
  // Projects
  projects: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (project: any) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // News
  news: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (news: any) => {
      const { data, error } = await supabase
        .from('news')
        .insert(news)
        .select()
        .single()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Intro Banners
  introBanners: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('intro_banners')
        .select('*')
        .order('id', { ascending: false })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('intro_banners')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (banner: any) => {
      const { data, error } = await supabase
        .from('intro_banners')
        .insert(banner)
        .select()
        .single()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('intro_banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('intro_banners')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Slider
  slider: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('about_slider')
        .select('*')
        .order('order_index', { ascending: true })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('about_slider')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (slider: any) => {
      const { data, error } = await supabase
        .from('about_slider')
        .insert(slider)
        .select()
        .single()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('about_slider')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('about_slider')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // About
  about: {
    get: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single() // Tablo dolu olduğu için single() kullan
      return { data, error }
    },

    update: async (updates: any) => {
      // Önce mevcut about_content kaydını al
      const { data: existingData, error: getError } = await supabase
        .from('about_content')
        .select('id')
        .single() // Tablo dolu olduğu için single() kullan
      
      if (getError) {
        // Eğer kayıt yoksa yeni kayıt oluştur
        const { data, error } = await supabase
          .from('about_content')
          .insert(updates)
          .select()
          .single()
        return { data, error }
      }

      // Mevcut kaydı güncelle
      const { data, error } = await supabase
        .from('about_content')
        .update(updates)
        .eq('id', existingData.id) // UUID kullan
        .select()
        .maybeSingle() // single() yerine maybeSingle() kullan
      return { data, error }
    }
  },

  // About Gallery
  aboutGallery: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('about_gallery')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id: number) => {
      const { data, error } = await supabase
        .from('about_gallery')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (image: any) => {
      const { data, error } = await supabase
        .from('about_gallery')
        .insert(image)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: number) => {
      const { error } = await supabase
        .from('about_gallery')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Contact
  contact: {
    get: async () => {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single() // Tablo dolu olduğu için single() kullan
      return { data, error }
    },

    update: async (updates: any) => {
      // Önce mevcut contact kaydını al
      const { data: existingData, error: getError } = await supabase
        .from('contact')
        .select('id')
        .single() // Tablo dolu olduğu için single() kullan
      
      if (getError) {
        // Eğer kayıt yoksa yeni kayıt oluştur
        const { data, error } = await supabase
          .from('contact')
          .insert(updates)
          .select()
          .single()
        return { data, error }
      }

      // Mevcut kaydı güncelle
      const { data, error } = await supabase
        .from('contact')
        .update(updates)
        .eq('id', existingData.id)
        .select()
        .single()
      return { data, error }
    }
  },

  // What We Do
  whatWeDo: {
    get: async () => {
      const { data, error } = await supabase
        .from('what_we_do')
        .select('*')
        .single() // Tablo dolu olduğu için single() kullan
      return { data, error }
    },

    update: async (updates: any) => {
      // Önce mevcut what_we_do kaydını al
      const { data: existingData, error: getError } = await supabase
        .from('what_we_do')
        .select('id')
        .single() // Tablo dolu olduğu için single() kullan
      
      if (getError) {
        // Eğer kayıt yoksa yeni kayıt oluştur
        const { data, error } = await supabase
          .from('what_we_do')
          .insert(updates)
          .select()
          .single()
        return { data, error }
      }

      // Mevcut kaydı güncelle
      const { data, error } = await supabase
        .from('what_we_do')
        .update(updates)
        .eq('id', existingData.id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Project Gallery
  projectGallery: {
    getByProjectId: async (projectId: string) => {
      const { data, error } = await supabase
        .from('project_gallery')
        .select('*')
        .eq('project_id', projectId)
        .order('sort', { ascending: true })
      return { data, error }
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('project_gallery')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (image: any) => {
      const { data, error } = await supabase
        .from('project_gallery')
        .insert(image)
        .select()
        .single()
      return { data, error }
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('project_gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('project_gallery')
        .delete()
        .eq('id', id)
      return { error }
    }
  }
}
