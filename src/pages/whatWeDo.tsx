import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { FormLayout } from '../components/common/PageLayout';
import { FormInput, FormTextarea, FormButton, FormActions } from '../components/common/FormComponents';
import { api } from '../utils/api';

interface WhatWeDoContent {
  id: number;
  title: string;
  subtitle: string;
  service_1_title: string;
  service_1_items: string;
  service_2_title: string;
  service_2_items: string;
  service_3_title: string;
  service_3_items: string;
  created_at: string;
  updated_at: string;
}

export default function WhatWeDoPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    service_1_title: '',
    service_1_items: '',
    service_2_title: '',
    service_2_items: '',
    service_3_title: '',
    service_3_items: ''
  });

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'What We Do' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchWhatWeDo();
  }, []);

  const fetchWhatWeDo = async () => {
    try {
      const response = await api.getWhatWeDo();
      const data = response.data as WhatWeDoContent;
      
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        service_1_title: data.service_1_title || '',
        service_1_items: data.service_1_items || '',
        service_2_title: data.service_2_title || '',
        service_2_items: data.service_2_items || '',
        service_3_title: data.service_3_title || '',
        service_3_items: data.service_3_items || ''
      });
    } catch (error) {
      console.error('Error fetching what we do content:', error);
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
      await api.updateWhatWeDo(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'What We Do içeriği başarıyla güncellendi.'
      });
    } catch (error) {
      console.error('Error updating what we do content:', error);
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
      title="What We Do Yönetimi"
      subtitle="What We Do bölümünün içeriğini düzenleyin"
      showBackButton={false}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Başlık Bölümü</h3>
          
          <FormInput
            label="Başlık"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="What We Do"
            required
          />

          <FormTextarea
            label="Alt Başlık"
            value={formData.subtitle}
            onChange={(value) => setFormData({ ...formData, subtitle: value })}
            placeholder="We create meaningful digital experiences that connect brands with their audiences."
            required
            rows={3}
          />
        </div>

        {/* Service 1 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Hizmet</h3>
          
          <FormInput
            label="Hizmet Başlığı"
            value={formData.service_1_title}
            onChange={(value) => setFormData({ ...formData, service_1_title: value })}
            placeholder="Brand Strategy"
            required
          />

          <FormTextarea
            label="Hizmet Maddeleri (Her satıra bir madde)"
            value={formData.service_1_items}
            onChange={(value) => setFormData({ ...formData, service_1_items: value })}
            placeholder="Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media"
            required
            rows={8}
          />
        </div>

        {/* Service 2 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Hizmet</h3>
          
          <FormInput
            label="Hizmet Başlığı"
            value={formData.service_2_title}
            onChange={(value) => setFormData({ ...formData, service_2_title: value })}
            placeholder="Digital Design"
            required
          />

          <FormTextarea
            label="Hizmet Maddeleri (Her satıra bir madde)"
            value={formData.service_2_items}
            onChange={(value) => setFormData({ ...formData, service_2_items: value })}
            placeholder="UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nVisual Design\nPrototyping\nUser Testing"
            required
            rows={8}
          />
        </div>

        {/* Service 3 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Hizmet</h3>
          
          <FormInput
            label="Hizmet Başlığı"
            value={formData.service_3_title}
            onChange={(value) => setFormData({ ...formData, service_3_title: value })}
            placeholder="Development"
            required
          />

          <FormTextarea
            label="Hizmet Maddeleri (Her satıra bir madde)"
            value={formData.service_3_items}
            onChange={(value) => setFormData({ ...formData, service_3_items: value })}
            placeholder="Frontend Development\nBackend Development\nMobile Apps\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization"
            required
            rows={8}
          />
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
