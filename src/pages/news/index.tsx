import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface News {
  id: number;
  title: string;
  category_text: string;
  photographer: string;
  subtitle: string;
  slug: string;
  content?: string;
  image_path?: string;
  aspect_ratio?: string;
  is_featured?: boolean;
  featured_order?: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<News[]>('/api/news');
      setNews(response.data);
    } catch (err) {
      setError('News yüklenirken hata oluştu');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    if (!window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/news/${id}`);
      setNews(news.filter(item => item.id !== id));
    } catch (err) {
      alert('Haber silinirken hata oluştu');
      console.error('Error deleting news:', err);
    }
  };

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const newsItem = news.find(item => item.id === id);
      if (!newsItem) return;

      await axiosInstance.put(`/api/news/${id}`, {
        ...newsItem,
        is_featured: !currentFeatured
      });

      setNews(news.map(item => 
        item.id === id 
          ? { ...item, is_featured: !currentFeatured }
          : item
      ));
    } catch (err) {
      alert('Featured durumu güncellenirken hata oluştu');
      console.error('Error updating featured status:', err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">News Yönetimi</h1>
        <Link
          to="/news/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Yeni Makale Ekle
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Görsel
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Başlık
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Kategori
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Öne Çıkan
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Yayın Tarihi
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 İşlemler
               </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-12 w-12">
                    {item.image_path ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={`http://localhost:5000/uploads/${item.image_path}`}
                        alt={item.subtitle}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No img</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.subtitle}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.slug}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {item.category_text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured || false)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.is_featured
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                                         {item.is_featured ? 'Öne Çıkan' : 'Öne Çıkmayan'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.published_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/news/edit/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                                             Düzenle
                     </Link>
                     <button
                       onClick={() => deleteNews(item.id)}
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

        {news.length === 0 && (
          <div className="text-center py-12">
                         <p className="text-gray-500">Henüz haber makalesi bulunamadı.</p>
             <Link
               to="/admin/news/new"
               className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
             >
               İlk makalenizi oluşturun
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
