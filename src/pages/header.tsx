import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { HeaderSettings, MenuItem, uploadLogoImage, deleteLogoImage, updateHeaderSettings, getHeaderSettings } from '../config/supabase';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';

const HeaderSettingsPage: React.FC = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const [settings, setSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbs([
      { name: 'Ana Sayfa', to: '/admin/dashboard' },
      { name: 'Header Ayarları' }
    ]);
    fetchSettings();
  }, [setBreadcrumbs]);

  const fetchSettings = async () => {
    try {
      const data = await getHeaderSettings();
      if (data) {
        setSettings(data);
        if (data.logo_image_url) {
          setLogoPreview(data.logo_image_url);
        }
      } else {
                 // Varsayılan ayarları oluştur
         const defaultSettings: Partial<HeaderSettings> = {
           menu_items: [
             { id: "1", href: "/projects", label: "WORK", order: 1 },
             { id: "2", href: "/about", label: "ABOUT", order: 2 },
             { id: "3", href: "/blog", label: "NEWS", order: 3 },
             { id: "4", href: "/careers", label: "CAREERS", order: 4 },
           ]
         };
        setSettings(defaultSettings as HeaderSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      // Dosya formatı kontrolü
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Sadece JPEG, PNG, SVG ve WebP formatları desteklenir.');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = async () => {
    if (!settings?.logo_image_url) return;

    if (confirm('Logoyu silmek istediğinize emin misiniz?')) {
      try {
        // Storage'dan logoyu sil
        await deleteLogoImage(settings.logo_image_url);
        
        // State'i güncelle
        setSettings(prev => prev ? { ...prev, logo_image_url: undefined } : null);
        setLogoPreview(null);
        
        alert('Logo başarıyla silindi!');
      } catch (error) {
        console.error('Error removing logo:', error);
        alert('Logo silinirken bir hata oluştu.');
      }
    }
  };

  const handleMenuChange = (index: number, field: keyof MenuItem, value: string | number) => {
    if (!settings) return;

    const updatedMenu = [...settings.menu_items];
    updatedMenu[index] = { ...updatedMenu[index], [field]: value };
    setSettings({ ...settings, menu_items: updatedMenu });
  };

  const addMenuItem = () => {
    if (!settings) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      href: "",
      label: "",
      order: settings.menu_items.length + 1
    };

    setSettings({
      ...settings,
      menu_items: [...settings.menu_items, newItem]
    });
  };

  const removeMenuItem = (index: number) => {
    if (!settings) return;

    const updatedMenu = settings.menu_items.filter((_: MenuItem, i: number) => i !== index);
    // Sıra numaralarını yeniden düzenle
    updatedMenu.forEach((item: MenuItem, i: number) => {
      item.order = i + 1;
    });

    setSettings({ ...settings, menu_items: updatedMenu });
  };

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    if (!settings) return;

    const updatedMenu = [...settings.menu_items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < updatedMenu.length) {
      [updatedMenu[index], updatedMenu[newIndex]] = [updatedMenu[newIndex], updatedMenu[index]];
          // Sıra numaralarını güncelle
    updatedMenu.forEach((item: MenuItem, i: number) => {
      item.order = i + 1;
    });

      setSettings({ ...settings, menu_items: updatedMenu });
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      let logoUrl = settings.logo_image_url;

      // Yeni logo yüklendiyse
      if (logoFile) {
        // Eski logo varsa sil
        if (settings.logo_image_url) {
          await deleteLogoImage(settings.logo_image_url);
        }

        // Yeni logoyu yükle
        const uploadedUrl = await uploadLogoImage(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      // Ayarları güncelle
      const updatedSettings = {
        ...settings,
        logo_image_url: logoUrl,
        updated_at: new Date().toISOString()
      };

      const result = await updateHeaderSettings(updatedSettings);
      if (result) {
        setSettings(result);
        setLogoFile(null);
        alert('Header ayarları başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Header Ayarları</h1>

                     {/* Logo Ayarları */}
           <div className="mb-8">
             <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo Ayarları</h2>
             
             <div className="max-w-md">
               {/* Logo Resmi */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Logo Resmi
                 </label>
                 <input
                   type="file"
                   accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                   onChange={handleLogoChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
                 <p className="text-xs text-gray-500 mt-1">
                   Desteklenen formatlar: JPEG, PNG, SVG, WebP (Maksimum 5MB)
                 </p>
                 {logoPreview && (
                   <div className="mt-4">
                     <p className="text-sm text-gray-600 mb-2">Önizleme:</p>
                     <img
                       src={logoPreview}
                       alt="Logo preview"
                       className="h-16 w-auto object-contain border border-gray-200 rounded"
                     />
                   </div>
                 )}
                 {settings?.logo_image_url && !logoFile && (
                   <div className="mt-4">
                     <p className="text-sm text-gray-600 mb-2">Mevcut Logo:</p>
                     <div className="flex items-center gap-4">
                       <img
                         src={settings.logo_image_url}
                         alt="Current logo"
                         className="h-16 w-auto object-contain border border-gray-200 rounded"
                       />
                       <button
                         onClick={handleRemoveLogo}
                         className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                       >
                         Logoyu Sil
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>

          {/* Menü Ayarları */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Menü Öğeleri</h2>
              <button
                onClick={addMenuItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Menü Öğesi Ekle
              </button>
            </div>

            <div className="space-y-4">
              {settings?.menu_items.map((item: MenuItem, index: number) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Öğe {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveMenuItem(index, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveMenuItem(index, 'down')}
                        disabled={index === settings.menu_items.length - 1}
                        className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeMenuItem(index)}
                        className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etiket
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleMenuChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Menü etiketi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link
                      </label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => handleMenuChange(index, 'href', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/sayfa-adi"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSettingsPage;
