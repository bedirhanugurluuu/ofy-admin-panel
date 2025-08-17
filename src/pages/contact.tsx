import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { FormLayout } from '../components/common/PageLayout';
import { FormInput, FormTextarea, FormButton, FormActions, FormFileInput } from '../components/common/FormComponents';
import { api } from '../utils/api';
import { getApiUrl } from '../config/api';

interface ContactContent {
  id: number;
  title: string;
  phone: string;
  email: string;
  instagram: string;
  linkedin: string;
  address_line1: string;
  address_line2: string;
  studio_hours_weekdays: string;
  studio_hours_weekend: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    phone: '',
    email: '',
    instagram: '',
    linkedin: '',
    address_line1: '',
    address_line2: '',
    studio_hours_weekdays: '',
    studio_hours_weekend: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Contact' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await api.getContact();
      const data = response.data as ContactContent;

      setFormData({
        title: data.title || '',
        phone: data.phone || '',
        email: data.email || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        studio_hours_weekdays: data.studio_hours_weekdays || '',
        studio_hours_weekend: data.studio_hours_weekend || ''
      });
      setCurrentImage(data.image_path || '');
    } catch (error) {
      console.error('Error fetching contact content:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İçerik yüklenirken bir hata oluştu.'
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await api.updateContact(formDataToSend);
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Contact içeriği başarıyla güncellendi.'
      });
      // Reset selected image
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating contact content:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İçerik güncellenirken bir hata oluştu.'
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
            onChange={(value) => setFormData({ ...formData, phone: value })}
            placeholder="+45 123 456 789"
            required
          />

          <FormInput
            label="E-posta"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="hello@lucastudio.com"
            type="email"
            required
          />
        </div>

        {/* Social Media Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Sosyal Medya</h3>

          <FormInput
            label="Instagram URL"
            value={formData.instagram}
            onChange={(value) => setFormData({ ...formData, instagram: value })}
            placeholder="https://instagram.com/lucastudio"
            type="url"
            required
          />

          <FormInput
            label="LinkedIn URL"
            value={formData.linkedin}
            onChange={(value) => setFormData({ ...formData, linkedin: value })}
            placeholder="https://linkedin.com/company/lucastudio"
            type="url"
            required
          />
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Adres</h3>
          
          <FormInput
            label="Adres Satırı 1"
            value={formData.address_line1}
            onChange={(value) => setFormData({ ...formData, address_line1: value })}
            placeholder="12 Nyhavn Street"
            required
          />

          <FormInput
            label="Adres Satırı 2"
            value={formData.address_line2}
            onChange={(value) => setFormData({ ...formData, address_line2: value })}
            placeholder="Copenhagen, Denmark, 1051"
            required
          />
        </div>

                 {/* Studio Hours Section */}
         <div className="space-y-6">
           <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Stüdyo Çalışma Saatleri</h3>
           
           <FormInput
             label="Hafta İçi"
             value={formData.studio_hours_weekdays}
             onChange={(value) => setFormData({ ...formData, studio_hours_weekdays: value })}
             placeholder="Monday to Friday: 9:00 AM – 6:00 PM"
             required
           />

           <FormInput
             label="Hafta Sonu"
             value={formData.studio_hours_weekend}
             onChange={(value) => setFormData({ ...formData, studio_hours_weekend: value })}
             placeholder="Saturday & Sunday: Closed"
             required
           />
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
                  src={`${getApiUrl('contact')}/uploads/${currentImage}`}
                  alt="Current contact image"
                  className="w-64 h-20 object-cover rounded-lg"
                />
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
