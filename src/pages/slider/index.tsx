import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import PageLayout from '../../components/common/PageLayout';
import DataTable, { ImageRenderer, TruncatedText } from '../../components/common/DataTable';

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

export default function SliderListPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Slider' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchSliderItems();
  }, []);

  const fetchSliderItems = async () => {
    try {
      setLoading(true);
      const response = await api.getSlider();
      setSliderItems(response.data);
    } catch (error) {
      console.error('Error fetching slider items:', error);
      Swal.fire('Error', 'Failed to fetch slider items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.deleteSliderItem(id);
        Swal.fire('Deleted!', 'Slider item has been deleted.', 'success');
        fetchSliderItems();
      } catch (error) {
        console.error('Error deleting slider item:', error);
        Swal.fire('Error', 'Failed to delete slider item', 'error');
      }
    }
  };

  const columns = [
    {
      key: 'image_path',
      label: 'Image',
      render: ImageRenderer('image_path', getApiUrl('slider'))
    },
    {
      key: 'title',
      label: 'Title',
      render: TruncatedText(30),
      className: 'font-medium text-gray-900'
    },
    {
      key: 'subtitle',
      label: 'Subtitle',
      render: TruncatedText(40),
      className: 'text-gray-500'
    },
    {
      key: 'sub_subtitle',
      label: 'Sub-Subtitle',
      render: TruncatedText(40),
      className: 'text-gray-500'
    },
    {
      key: 'order_index',
      label: 'Order',
      className: 'text-gray-500'
    }
  ];

  return (
    <PageLayout
      title="Slider Management"
      subtitle="Manage slider items for the about page"
      showNewButton={true}
      newUrl="/admin/slider/new"
      newButtonText="New Slider Item"
    >
      <DataTable
        columns={columns}
        data={sliderItems}
        loading={loading}
        emptyMessage="No slider items found. Create your first one!"
        onEdit={(item) => window.location.href = `/admin/slider/edit/${item.id}`}
        onDelete={handleDelete}
        editButtonText="Edit"
        deleteButtonText="Delete"
      />
    </PageLayout>
  );
}
