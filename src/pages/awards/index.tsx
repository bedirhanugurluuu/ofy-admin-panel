import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import PageLayout from '../../components/common/PageLayout';
import DataTable, { TruncatedText, LinkRenderer } from '../../components/common/DataTable';

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

export default function AwardsListPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Awards' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const response = await api.getAwards();
             setAwards(response.data as Award[]);
    } catch (error) {
      console.error('Error fetching awards:', error);
      Swal.fire('Error', 'Failed to fetch awards', 'error');
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
        await api.deleteAward(id);
        Swal.fire('Deleted!', 'Award has been deleted.', 'success');
        fetchAwards();
      } catch (error) {
        console.error('Error deleting award:', error);
        Swal.fire('Error', 'Failed to delete award', 'error');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      className: 'font-medium text-gray-900'
    },
    {
      key: 'subtitle',
      label: 'Subtitle',
      render: TruncatedText(30),
      className: 'text-gray-600'
    },
    {
      key: 'halo',
      label: 'Halo',
      render: TruncatedText(20),
      className: 'text-gray-600'
    },
    {
      key: 'link',
      label: 'Link',
      render: LinkRenderer(),
      className: 'text-gray-500'
    },
    {
      key: 'date',
      label: 'Date',
      className: 'text-gray-500'
    }
  ];

  return (
    <PageLayout
      title="Awards Management"
      subtitle="Manage awards and recognitions"
      showNewButton={true}
      newUrl="/admin/awards/new"
      newButtonText="New Award"
    >
      <DataTable
        columns={columns}
        data={awards}
        loading={loading}
        emptyMessage="No awards found. Create your first one!"
        onEdit={(item) => window.location.href = `/admin/awards/edit/${item.id}`}
        onDelete={handleDelete}
        editButtonText="Edit"
        deleteButtonText="Delete"
      />
    </PageLayout>
  );
}

