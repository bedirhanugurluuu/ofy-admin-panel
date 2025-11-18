export interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  thumbnail_media: string; // backend'de thumbnail_media olarak saklanıyor
  banner_media?: string; // backend'de banner_media olarak saklanıyor
  featured: boolean; // is_featured değil, featured
  is_featured: boolean;
  featured_order: number;
  description: string;
  client_name?: string;
  year?: string; // backend'de string olarak geliyor
  role?: string;
  external_link?: string;
  gallery_images?: string[]; // galeri görselleri
}
