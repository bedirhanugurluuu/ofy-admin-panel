import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices, deleteService, Service } from '../../config/supabase';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import Swal from 'sweetalert2';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Dashboard', to: '/admin/dashboard' },
      { name: 'Services' }
    ]);
    loadServices();
  }, [setBreadcrumbs]);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Services yüklenirken bir hata oluştu.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: `"${title}" servisini silmek istediğinize emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        const success = await deleteService(id);
        if (success) {
          setServices(services.filter(service => service.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Başarılı!',
            text: 'Service başarıyla silindi.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Service silinirken bir hata oluştu.'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link
          to="/admin/services/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Yeni Service Ekle
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.order_index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {service.description.length > 100 
                    ? `${service.description.substring(0, 100)}...` 
                    : service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/services/edit/${service.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id, service.title)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
