import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { FormLayout } from '../components/common/PageLayout';
import { FormInput, FormTextarea, FormButton, FormActions, FormFileInput } from '../components/common/FormComponents';
import { fetchContact, updateContact, ContactContent, uploadContactImage, deleteLogoImage } from '../config/supabase';

// Görsel URL'lerini normalize eden utility fonksiyonu
const normalizeImageUrl = (imagePath: string) => {
  if (!imagePath) return "";

  let p = imagePath.trim();

  // Eğer zaten tam URL ise (http/https ile başlıyorsa) direkt döndür
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p;
  }

  // Eğer data URL ise direkt döndür
  if (p.startsWith("data:")) {
    return p;
  }

  // Eğer Supabase Storage URL formatında ise direkt döndür
  if (p.includes("supabase.co/storage/v1/object/public/")) {
    return p;
  }

  // Eğer local path ise (/uploads/ ile başlıyorsa) Supabase URL'ine dönüştür
  if (p.startsWith("/uploads/")) {
    const fileName = p.replace("/uploads/", "");
    return `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${fileName}`;
  }

  // Eğer sadece dosya adı ise, uploads bucket'ına yönlendir
  if (!p.includes("/") && !p.includes("\\")) {
    return `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${p}`;
  }

  // Diğer durumlar için fallback
  return p;
};



export default function ContactPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    phone: '',
    email: '',
    social_items: [{ name: '', link: '' }]
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentImagePath, setCurrentImagePath] = useState<string>('');

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Contact' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const data = await fetchContact();
      
      // Eğer veri yoksa varsayılan değerler kullan
      if (!data) {
        setFormData({
          title: 'Contact',
          phone: '+45123456789',
          email: 'hello@lucastudio.com',
          social_items: [
            { name: 'Instagram', link: '#' },
            { name: 'LinkedIn', link: '#' }
          ]
        });
        setCurrentImage('');
        setCurrentImagePath('');
        setCurrentImagePath('');
      } else {
        setFormData({
          title: data.title || '',
          phone: data.phone || '',
          email: data.email || '',
          social_items: data.social_items || [{ name: '', link: '' }]
        });
        setCurrentImage(normalizeImageUrl(data.image_path || ''));
        setCurrentImagePath(data.image_path || '');
      }
    } catch (error) {
      console.error('Error fetching contact content:', error);
      
      // Hata durumunda da varsayılan değerler kullan
              setFormData({
          title: 'Contact',
          phone: '+45123456789',
          email: 'hello@lucastudio.com',
          social_items: [
            { name: 'Instagram', link: '#' },
            { name: 'LinkedIn', link: '#' }
          ]
        });
      setCurrentImage('');
      
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'Veritabanından veri yüklenemedi. Varsayılan değerler kullanılıyor.'
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newImagePath = currentImagePath;

      // Eğer yeni resim seçildiyse yükle
      if (selectedImage) {
        // Eski resmi sil
        if (currentImagePath) {
          await deleteLogoImage(currentImagePath);
        }

        // Yeni resmi yükle
        const uploadedImagePath = await uploadContactImage(selectedImage);
        if (uploadedImagePath) {
          newImagePath = uploadedImagePath;
        }
      }

      // Form verilerini hazırla
      const contactData = {
        title: formData.title,
        phone: formData.phone,
        email: formData.email,
        social_items: formData.social_items.filter(item => item.name.trim() && item.link.trim()), // Boş olanları filtrele
        image_path: newImagePath
      };

      const result = await updateContact(contactData);
      if (!result) {
        throw new Error('Failed to update contact');
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Contact içeriği başarıyla kaydedildi.'
      });
      
      // Reset selected image
      setSelectedImage(null);
      
      // Verileri yeniden yükle
      await fetchContactData();
    } catch (error) {
      console.error('Error updating contact content:', error);
      
      // Daha detaylı hata mesajı
      let errorMessage = 'İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error instanceof Error) {
        if (error.message.includes('contact')) {
          errorMessage = 'Contact tablosu bulunamadı. Lütfen veritabanını kontrol edin.';
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="px-8 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <FormLayout
      title="Contact Yönetimi"
      subtitle="Contact sayfasının içeriğini düzenleyin"
      showBackButton={false}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Başlık</h3>

          <FormTextarea
            label="Ana Başlık"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="Let's connect and bring your ideas to life"
            required
            rows={3}
          />
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">İletişim Bilgileri</h3>

          <FormInput
            label="Telefon"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value.replace(/\s+/g, '') })}
            placeholder="+45123456789"
            required
          />

          <FormInput
            label="E-posta"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value.replace(/\s+/g, '') })}
            placeholder="hello@lucastudio.com"
            type="email"
            required
          />
        </div>

        {/* Social Media Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Sosyal Medya</h3>

          {formData.social_items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <FormInput
                  label={`Sosyal Medya ${index + 1} - İsim`}
                  value={item.name}
                  onChange={(value) => {
                    const newSocialItems = [...formData.social_items];
                    newSocialItems[index].name = value;
                    setFormData({ ...formData, social_items: newSocialItems });
                  }}
                  placeholder="Instagram"
                  required
                />
              </div>
              <div className="flex-1">
                <FormInput
                  label={`Sosyal Medya ${index + 1} - Link`}
                  value={item.link}
                  onChange={(value) => {
                    const newSocialItems = [...formData.social_items];
                    newSocialItems[index].link = value;
                    setFormData({ ...formData, social_items: newSocialItems });
                  }}
                  placeholder="https://instagram.com/username"
                  type="url"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSocialItems = formData.social_items.filter((_, i) => i !== index);
                  setFormData({ ...formData, social_items: newSocialItems });
                }}
                className="btn btn-error btn-sm"
                disabled={formData.social_items.length <= 1}
              >
                Sil
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                social_items: [...formData.social_items, { name: '', link: '' }]
              });
            }}
            className="btn btn-outline btn-sm"
          >
            + Sosyal Medya Ekle
          </button>
        </div>

         {/* Image Section */}
         <div className="space-y-6">
           <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Görsel</h3>
           
           <FormFileInput
             label="Contact Görseli"
             onChange={setSelectedImage}
             accept="image/*"
             helperText="Önerilen boyut: 1920x624px (3.076923076923077:1 oranı)"
           />

           {currentImage && (
             <div className="mt-4">
               <p className="text-sm text-gray-600 mb-2">Mevcut Görsel:</p>
               <img
                 src={currentImage}
                 alt="Current contact image"
                 className="w-64 h-20 object-cover rounded-lg"
               />
               <button
                 type="button"
                 onClick={async () => {
                   try {
                     if (currentImagePath) {
                       await deleteLogoImage(currentImagePath);
                       setCurrentImage('');
                       setCurrentImagePath('');
                       
                       // Veritabanından da kaldır
                       const contactData = {
                         title: formData.title,
                         phone: formData.phone,
                         email: formData.email,
                         social_items: formData.social_items.filter(item => item.name.trim() && item.link.trim()),
                         image_path: undefined
                       };
                       
                       await updateContact(contactData);
                       
                       Swal.fire({
                         icon: 'success',
                         title: 'Başarılı!',
                         text: 'Görsel başarıyla silindi.'
                       });
                     }
                   } catch (error) {
                     console.error('Error deleting image:', error);
                     Swal.fire({
                       icon: 'error',
                       title: 'Hata',
                       text: 'Görsel silinirken bir hata oluştu.'
                     });
                   }
                 }}
                 className="btn btn-error btn-sm mt-2"
               >
                 Görseli Sil
               </button>
             </div>
           )}
         </div>

        <FormActions>
          <FormButton
            type="submit"
            loading={loading}
            loadingText="Kaydediliyor..."
          >
            Kaydet
          </FormButton>
        </FormActions>
      </form>
    </FormLayout>
  );
}
