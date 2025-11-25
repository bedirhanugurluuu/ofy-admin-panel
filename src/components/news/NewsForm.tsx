import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { storageUtils } from '../../utils/supabaseStorage';
import LoadingSpinner from '../common/LoadingSpinner';

interface NewsFormData {
  title: string;
  category_text: string;
  photographer: string;
  subtitle: string;
  slug: string;
  content: string;
  aspect_ratio: string;
  featured: boolean;
  image_path?: string;
}

export default function NewsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    category_text: 'DESIGN',
    photographer: 'Anna Surokin',
    subtitle: '',
    slug: '',
    content: '',
    aspect_ratio: 'aspect-square',
    featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // HTML toolbar fonksiyonu
  const insertHTML = (openTag: string, closeTag: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    const newContent = 
      formData.content.substring(0, start) + 
      openTag + selectedText + closeTag + 
      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Cursor pozisyonunu ayarla
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + openTag.length,
          end + openTag.length
        );
      }
    }, 0);
  };

  useEffect(() => {
    if (isEditing) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      setFetching(true);
      const { data, error } = await api.news.getById(id!);
      if (error) throw error;
      const news = data;
      
      console.log('=== NEWS FETCH DEBUG ===');
      console.log('News data:', news);
      console.log('Image path from DB:', news.image_path);
      
      setFormData({
        title: news.title || '',
        category_text: news.category_text || 'DESIGN',
        photographer: news.photographer || 'Anna Surokin',
        subtitle: news.subtitle || '',
        slug: news.slug || '',
        content: news.content || '',
        aspect_ratio: news.aspect_ratio || 'aspect-square',
        featured: news.featured || false,
        image_path: news.image_path || '',
      });
      
      if (news.image_path) {
        setCurrentImage(`https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${news.image_path}`);
      }
      
      console.log('=== END NEWS FETCH DEBUG ===');
    } catch (err) {
      setError('News yüklenirken hata oluştu');
      console.error('Error fetching news:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const generateSlug = () => {
    const slug = formData.subtitle
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.slug) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let newImagePath = formData.image_path;

      // Yeni resim yüklendiyse
      if (imageFile) {
        console.log('=== NEWS RESİM İŞLEMİ BAŞLADI ===');
        console.log('FormData image_path:', formData.image_path);
        console.log('Is editing:', isEditing);
        console.log('Image file:', imageFile.name);
        
        // Eski resmi sil (eğer varsa)
        if (isEditing && formData.image_path) {
          console.log('=== NEWS RESİM SİLME İŞLEMİ ===');
          console.log('Eski resim path:', formData.image_path);
          console.log('Silme işlemi başlıyor...');
          await storageUtils.deleteFile(formData.image_path);
          console.log('=== SİLME İŞLEMİ TAMAMLANDI ===');
        }
        
        // Yeni resmi yükle
        const timestamp = Date.now();
        const fileName = `news-${timestamp}-${Math.random().toString(36).substring(2)}.${imageFile.name.split('.').pop()}`;
        console.log('Yeni resim yükleniyor:', fileName);
        
        const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(imageFile, fileName);
        if (uploadError) throw uploadError;
        
        newImagePath = fileName;
        console.log('Resim yüklendi:', newImagePath);
        console.log('=== NEWS RESİM İŞLEMİ BİTTİ ===');
      }

      // Form data'yı güncelle
      const updateData = {
        ...formData,
        image_path: newImagePath
      };

      if (isEditing) {
        const { error } = await api.news.update(id!, updateData);
        if (error) throw error;
      } else {
        const { error } = await api.news.create(updateData);
        if (error) throw error;
      }

      navigate('/admin/news');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      console.error('Error saving news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Haber Makalesini Düzenle' : 'Yeni Haber Makalesi Ekle'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Makale başlığı"
              required
            />
          </div>

          {/* Category Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Metni *
            </label>
            <input
              type="text"
              name="category_text"
              value={formData.category_text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="örn: TASARIM, SANAT YÖNETİMİ"
              required
            />
          </div>

          {/* Photographer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğrafçı *
            </label>
            <input
              type="text"
              name="photographer"
              value={formData.photographer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="örn: Anna Surokin"
              required
            />
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Başlık *
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Makale alt başlığı"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Kodu *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="makale-url-kodu"
              required
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Oluştur
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik
          </label>
          
          {/* HTML Toolbar */}
          <div className="mb-2 p-2 bg-gray-50 border border-gray-300 rounded-t-md html-toolbar">
            <div className="flex flex-wrap gap-2 text-black">
              <button
                type="button"
                onClick={() => insertHTML('<strong>', '</strong>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Kalın"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<em>', '</em>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="İtalik"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<u>', '</u>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Altı Çizili"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<h2>', '</h2>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Başlık 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<h3>', '</h3>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Başlık 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<ul><li>', '</li></ul>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Madde Listesi"
              >
                • Liste
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<ol><li>', '</li></ol>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Numaralı Liste"
              >
                1. Liste
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<p>', '</p>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Paragraf"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => insertHTML('<blockquote>', '</blockquote>')}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                title="Alıntı"
              >
                "
              </button>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            placeholder="Makale içeriğini buraya yazın... HTML etiketleri kullanabilirsiniz."
            style={{ color: '#111827' }}
          />

          <div className="mt-2 text-sm text-black">
            Toolbar butonlarını kullanarak metni formatlayabilirsiniz. HTML etiketleri de manuel olarak yazabilirsiniz.
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Görsel
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {currentImage && (
            <div className="mt-2">
              <img
                src={currentImage}
                alt="Önizleme"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              En Boy Oranı
            </label>
            <select
              name="aspect_ratio"
              value={formData.aspect_ratio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aspect-square">Kare (1:1)</option>
              <option value="aspect-[3/2]">Yatay (3:2)</option>
              <option value="aspect-video">Video (16:9)</option>
            </select>
          </div>



          {/* Is Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Ana sayfada öne çıkar
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
                     <button
             type="submit"
             disabled={loading}
             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
           >
             {loading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Oluştur')}
           </button>
           <button
             type="button"
             onClick={() => navigate('/admin/news')}
             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
           >
             İptal
           </button>
        </div>
      </form>
    </div>
  );
}