import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom';
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



interface Award {
  id: number;
  title: string;
  subtitle: string;
  halo: string;
  link: string;
  date: string;
}

export default function AwardsEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Awards', to: '/admin/awards' },
      { name: 'Düzenle Award' }
    ]);
  }, [setBreadcrumbs]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    halo: '',
    link: '',
    date: ''
  });

  useEffect(() => {
    if (id) {
      fetchAward();
    }
  }, [id]);

  const fetchAward = async () => {
    try {
      setFetching(true);
             const response = await api.getAward(parseInt(id!));
      const award = response.data;
      setFormData({
        title: award.title,
        subtitle: award.subtitle,
        halo: award.halo,
        link: award.link,
        date: award.date
      });
    } catch (error) {
      console.error('Error fetching award:', error);
      Swal.fire('Error', 'Failed to fetch award', 'error');
      navigate('/admin/awards');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.halo || !formData.link || !formData.date) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
             await api.updateAward(parseInt(id!), formData);
      Swal.fire('Success', 'Award updated successfully', 'success');
      navigate('/admin/awards');
    } catch (error: any) {
      console.error('Error updating award:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update award';
      Swal.fire('Error', errorMessage, 'error');
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
      title="Edit Award"
      subtitle="Update award information"
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
            loadingText="Updating..."
          >
            Update Award
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
