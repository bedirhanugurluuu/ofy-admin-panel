import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import { ArrowLeft } from 'lucide-react';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string;
    };
  }
}



export default function SliderNewPage() {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Slider', to: '/admin/slider' },
      { name: 'Yeni Slider Item' }
    ]);
  }, [setBreadcrumbs]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sub_subtitle: '',
    order_index: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.sub_subtitle) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (!selectedImage) {
      Swal.fire('Error', 'Please select an image', 'error');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('sub_subtitle', formData.sub_subtitle);
      formDataToSend.append('order_index', formData.order_index.toString());
      formDataToSend.append('image', selectedImage);

      await api.createSliderItem(formDataToSend);
      Swal.fire('Success', 'Slider item created successfully', 'success');
      navigate('/admin/slider');
    } catch (error: any) {
      console.error('Error creating slider item:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create slider item';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/admin/slider"
            className="btn btn-ghost btn-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to List
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">Create New Slider Item</h1>
        <p>Add a new slider item for the about page</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle *
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subtitle"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Subtitle *
            </label>
            <input
              type="text"
              value={formData.sub_subtitle}
              onChange={(e) => setFormData({ ...formData, sub_subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter sub-subtitle"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image *
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Select an image for the slider
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                'Create Slider Item'
              )}
            </button>
            <Link
              to="/admin/slider"
              className="btn btn-ghost"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
