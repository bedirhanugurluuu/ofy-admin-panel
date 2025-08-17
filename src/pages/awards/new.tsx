import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import { FormLayout } from '../../components/common/PageLayout';
import { FormInput, FormButton, FormActions } from '../../components/common/FormComponents';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string;
    };
  }
}



export default function AwardsNewPage() {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Awards', to: '/admin/awards' },
      { name: 'Yeni Award' }
    ]);
  }, [setBreadcrumbs]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    halo: '',
    link: '',
    date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.halo || !formData.link || !formData.date) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
             await api.createAward(formData);
      Swal.fire('Success', 'Award created successfully', 'success');
      navigate('/admin/awards');
    } catch (error: any) {
      console.error('Error creating award:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create award';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title="Create New Award"
      subtitle="Add a new award to the list"
      backUrl="/admin/awards"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Award Title"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="e.g., SOTD"
            required
          />
          
          <FormInput
            label="Award Subtitle"
            value={formData.subtitle}
            onChange={(value) => setFormData({ ...formData, subtitle: value })}
            placeholder="e.g., Awwwards"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Award Halo"
            value={formData.halo}
            onChange={(value) => setFormData({ ...formData, halo: value })}
            placeholder="e.g., Halo+"
            required
          />

          <FormInput
            label="Date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
            placeholder="e.g., Mar '25, Jan '24"
            required
          />
        </div>

        <FormInput
          label="Link"
          value={formData.link}
          onChange={(value) => setFormData({ ...formData, link: value })}
          placeholder="https://example.com/award"
          type="url"
          required
        />

        <FormActions>
          <FormButton
            type="submit"
            loading={loading}
            loadingText="Creating..."
          >
            Create Award
          </FormButton>
          <Link
            to="/admin/awards"
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
          >
            Cancel
          </Link>
        </FormActions>
      </form>
    </FormLayout>
  );
}

