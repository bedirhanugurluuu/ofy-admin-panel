import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import { ArrowLeft } from 'lucide-react';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string;
    };
  }
}



interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  sub_subtitle: string;
  image_path: string;
  order_index: number;
}

export default function SliderEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumb();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Slider', to: '/admin/slider' },
      { name: 'Düzenle Slider Item' }
    ]);
  }, [setBreadcrumbs]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sub_subtitle: '',
    order_index: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchSliderItem();
    }
  }, [id]);

  const fetchSliderItem = async () => {
    try {
      setFetching(true);
      const response = await api.getSlider();
      const item = response.data.find(item => item.id === parseInt(id!));
      
      if (!item) {
        Swal.fire('Error', 'Slider item not found', 'error');
        navigate('/admin/slider');
        return;
      }

      setFormData({
        title: item.title,
        subtitle: item.subtitle,
        sub_subtitle: item.sub_subtitle,
        order_index: item.order_index
      });
      setCurrentImage(item.image_path);
    } catch (error) {
      console.error('Error fetching slider item:', error);
      Swal.fire('Error', 'Failed to fetch slider item', 'error');
      navigate('/admin/slider');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subtitle || !formData.sub_subtitle) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('sub_subtitle', formData.sub_subtitle);
      formDataToSend.append('order_index', formData.order_index.toString());
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await api.updateSliderItem(parseInt(id!), formDataToSend);
      Swal.fire('Success', 'Slider item updated successfully', 'success');
      navigate('/admin/slider');
    } catch (error: any) {
      console.error('Error updating slider item:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update slider item';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold mb-2">Edit Slider Item</h1>
        <p>Update slider item for the about page</p>
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
                Image
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
              {currentImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Current image:</p>
                  <img
                                         src={`${getApiUrl('slider')}/uploads/${currentImage}`}
                    alt="Current"
                    className="h-16 w-16 object-cover rounded"
                  />
                </div>
              )}
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
                  Updating...
                </>
              ) : (
                'Update Slider Item'
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
