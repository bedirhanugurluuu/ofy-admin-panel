export interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  thumbnail_media: string; // backend'de thumbnail_media olarak saklanıyor
  banner_media?: string; // backend'de banner_media olarak saklanıyor
  is_featured: boolean;
  featured_order: number | null;
  description: string;
  client_name?: string;
  year?: string; // backend'de string olarak geliyor
  role?: string;
  external_link?: string;
  gallery_images?: string[]; // galeri görselleri
}
