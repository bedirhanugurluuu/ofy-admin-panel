import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ipWhitelistAPI, IPAddress } from '../api/ip-whitelist';

const IPManagementPage = () => {
  const navigate = useNavigate();
  const [ips, setIPs] = useState<IPAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIP, setNewIP] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchIPs();
  }, []);

  const fetchIPs = async () => {
    try {
      const data = await ipWhitelistAPI.getIPs();
      setIPs(data);
    } catch (error) {
      console.error('IP adresleri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIP.trim()) return;

    setAdding(true);
    try {
      await ipWhitelistAPI.addIP(
        newIP.trim(),
        newDescription.trim() || 'Manually added'
      );
      
      setNewIP('');
      setNewDescription('');
      fetchIPs();
    } catch (error) {
      console.error('IP adresi eklenirken hata:', error);
      alert('IP adresi eklenirken hata oluştu');
    } finally {
      setAdding(false);
    }
  };

  const deleteIP = async (id: string) => {
    if (!confirm('Bu IP adresini silmek istediğinizden emin misiniz?')) return;

    try {
      await ipWhitelistAPI.deleteIP(id);
      fetchIPs();
    } catch (error) {
      console.error('IP adresi silinirken hata:', error);
      alert('IP adresi silinirken hata oluştu');
    }
  };

  const getCurrentIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setNewIP(data.ip);
    } catch (error) {
      console.error('Mevcut IP alınırken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">IP Whitelist Yönetimi</h1>
        <p className="text-gray-600 mt-2">
          Genel siteye erişebilecek IP adreslerini yönetin
        </p>
      </div>

      {/* Add New IP */}
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">Yeni IP Adresi Ekle</h2>
          <form onSubmit={addIP} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">IP Adresi</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  placeholder="192.168.1.100"
                  className="input input-bordered flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={getCurrentIP}
                  className="btn btn-outline"
                >
                  IP Adresimi Al
                </button>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Açıklama (İsteğe Bağlı)</span>
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="örn: Ofisim, Müşteri IP"
                className="input input-bordered"
              />
            </div>
            
            <button
              type="submit"
              disabled={adding}
              className="btn btn-primary"
            >
              {adding ? 'Ekleniyor...' : 'IP Adresi Ekle'}
            </button>
          </form>
        </div>
      </div>

      {/* IP List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">İzin Verilen IP Adresleri</h2>
          
          {ips.length === 0 ? (
            <p className="text-gray-500">IP adresi bulunamadı</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>IP Adresi</th>
                    <th>Açıklama</th>
                    <th>Durum</th>
                    <th>Eklenme Tarihi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {ips.map((ip) => (
                    <tr key={ip.id}>
                      <td>
                        <code className="px-2 py-1 rounded text-white" style={{backgroundColor: '#191e24'}}>
                          {ip.ip_address}
                        </code>
                      </td>
                      <td>{ip.description}</td>
                      <td>
                        <span className={`badge ${ip.is_active ? 'badge-success' : 'badge-error'}`}>
                          {ip.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        {new Date(ip.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteIP(ip.id)}
                          className="btn btn-error btn-sm"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="alert alert-info mt-8">
        <div>
          <h3 className="font-bold">Nasıl Kullanılır:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Genel siteye erişebilecek IP adreslerini ekleyin</li>
            <li>Diğer tüm IP'ler bakım sayfasını görecek</li>
            <li>Admin paneli IP'den bağımsız olarak her zaman erişilebilir</li>
            <li>Değişiklikler önbellekleme nedeniyle 5 dakika içinde etkili olur</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IPManagementPage;
