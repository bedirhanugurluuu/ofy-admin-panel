import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { FormLayout } from '../components/common/PageLayout';
import { FormInput, FormButton, FormActions } from '../components/common/FormComponents';
import { supabase } from '../config/supabase';
import { HeaderSettings, MenuItem, uploadLogoImage, deleteLogoImage, updateHeaderSettings, getHeaderSettings } from '../config/supabase';

const HeaderSettingsPage: React.FC = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const [settings, setSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoLightFile, setLogoLightFile] = useState<File | null>(null);

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
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Header ayarları yüklenirken bir hata oluştu.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
        });
        return;
      }

      // Dosya formatı kontrolü
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Sadece JPEG, PNG, SVG ve WebP formatları desteklenir.'
        });
        return;
      }

      setLogoFile(file);
    }
  };

  const handleLogoLightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
        });
        return;
      }

      // Dosya formatı kontrolü
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Sadece JPEG, PNG, SVG ve WebP formatları desteklenir.'
        });
        return;
      }

      setLogoLightFile(file);
    }
  };

  const handleRemoveLogo = async () => {
    if (!settings?.logo_image_url) return;

    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Koyu renkli logoyu silmek istediğinize emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        // Storage'dan logoyu sil
        await deleteLogoImage(settings.logo_image_url);
        
        // State'i güncelle
        setSettings(prev => prev ? { ...prev, logo_image_url: undefined } : null);
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Koyu renkli logo başarıyla silindi.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error removing logo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Logo silinirken bir hata oluştu.'
        });
      }
    }
  };

  const handleRemoveLogoLight = async () => {
    if (!settings?.logo_image_url_light) return;

    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Açık renkli logoyu silmek istediğinize emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        // Storage'dan logoyu sil
        await deleteLogoImage(settings.logo_image_url_light);
        
        // State'i güncelle
        setSettings(prev => prev ? { ...prev, logo_image_url_light: undefined } : null);
        
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Açık renkli logo başarıyla silindi.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error removing logo light:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Logo silinirken bir hata oluştu.'
        });
      }
    }
  };

  const handleMenuChange = async (index: number, field: keyof MenuItem, value: string | number) => {
    if (!settings) return;

    const updatedMenu = [...settings.menu_items];
    updatedMenu[index] = { ...updatedMenu[index], [field]: value };
    const updatedSettings = { ...settings, menu_items: updatedMenu };
    setSettings(updatedSettings);

    // Otomatik kaydet (debounce ile)
    try {
      await updateHeaderSettings(updatedSettings);
    } catch (error) {
      console.error('Error auto-saving menu change:', error);
      // Hata mesajını gösterme, sadece log'la
    }
  };

  const addMenuItem = async () => {
    if (!settings) return;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      href: "",
      label: "",
      order: settings.menu_items.length + 1
    };

    const updatedSettings = {
      ...settings,
      menu_items: [...settings.menu_items, newItem]
    };

    setSettings(updatedSettings);

    // Otomatik kaydet
    try {
      await updateHeaderSettings(updatedSettings);
    } catch (error) {
      console.error('Error auto-saving menu item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Menü öğesi eklenirken bir hata oluştu.'
      });
    }
  };

  const removeMenuItem = async (index: number) => {
    if (!settings) return;

    const updatedMenu = settings.menu_items.filter((_: MenuItem, i: number) => i !== index);
    // Sıra numaralarını yeniden düzenle
    updatedMenu.forEach((item: MenuItem, i: number) => {
      item.order = i + 1;
    });

    const updatedSettings = { ...settings, menu_items: updatedMenu };
    setSettings(updatedSettings);

    // Otomatik kaydet
    try {
      await updateHeaderSettings(updatedSettings);
    } catch (error) {
      console.error('Error auto-saving menu removal:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Menü öğesi silinirken bir hata oluştu.'
      });
    }
  };

  const moveMenuItem = async (index: number, direction: 'up' | 'down') => {
    if (!settings) return;

    const updatedMenu = [...settings.menu_items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < updatedMenu.length) {
      [updatedMenu[index], updatedMenu[newIndex]] = [updatedMenu[newIndex], updatedMenu[index]];
      // Sıra numaralarını güncelle
      updatedMenu.forEach((item: MenuItem, i: number) => {
        item.order = i + 1;
      });

      const updatedSettings = { ...settings, menu_items: updatedMenu };
      setSettings(updatedSettings);

      // Otomatik kaydet
      try {
        await updateHeaderSettings(updatedSettings);
      } catch (error) {
        console.error('Error auto-saving menu reorder:', error);
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Menü sırası değiştirilirken bir hata oluştu.'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      let logoUrl = settings.logo_image_url;
      let logoLightUrl = settings.logo_image_url_light;

      // Yeni koyu logo yüklendiyse
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

      // Yeni açık logo yüklendiyse
      if (logoLightFile) {
        // Eski logo varsa sil
        if (settings.logo_image_url_light) {
          await deleteLogoImage(settings.logo_image_url_light);
        }

        // Yeni logoyu yükle
        const uploadedUrl = await uploadLogoImage(logoLightFile);
        if (uploadedUrl) {
          logoLightUrl = uploadedUrl;
        }
      }

      // Ayarları güncelle
      const updatedSettings = {
        ...settings,
        logo_image_url: logoUrl,
        logo_image_url_light: logoLightUrl,
        updated_at: new Date().toISOString()
      };

      const result = await updateHeaderSettings(updatedSettings);
      if (result) {
        setSettings(result);
        setLogoFile(null);
        setLogoLightFile(null);
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Header ayarları başarıyla kaydedildi.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Header ayarları kaydedilirken bir hata oluştu.'
      });
    } finally {
      setSaving(false);
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
    <FormLayout title="Header Ayarları" showBackButton={false}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Logo Ayarları</h3>
          
          {/* Koyu Renkli Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Koyu Renkli Logo (Beyaz arka plan için)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
              onChange={handleLogoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Desteklenen formatlar: JPEG, PNG, SVG, WebP (Maksimum 5MB)
            </p>

            {settings?.logo_image_url && !logoFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Mevcut Koyu Logo:</p>
                <div className="flex items-center gap-4">
                  <img
                    src={settings.logo_image_url}
                    alt="Current logo"
                    className="h-16 w-auto object-contain border border-gray-200 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Logoyu Sil
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Açık Renkli Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açık Renkli Logo (Şeffaf arka plan için)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
              onChange={handleLogoLightChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Desteklenen formatlar: JPEG, PNG, SVG, WebP (Maksimum 5MB)
            </p>

            {settings?.logo_image_url_light && !logoLightFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Mevcut Açık Logo:</p>
                <div className="flex items-center gap-4">
                  <img
                    src={settings.logo_image_url_light}
                    alt="Current logo light"
                    className="h-16 w-auto object-contain border border-gray-200 rounded"
                    style={{ backgroundColor: '#3b3b3b' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogoLight}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Logoyu Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Menü Ayarları</h3>
          
          <div className="space-y-4">
            {settings?.menu_items.map((item: MenuItem, index: number) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <FormInput
                    label="Menü Adı"
                    value={item.label}
                    onChange={(value) => handleMenuChange(index, 'label', value)}
                    placeholder="Örn: WORK"
                    required
                  />
                  <FormInput
                    label="Link"
                    value={item.href}
                    onChange={(value) => handleMenuChange(index, 'href', value)}
                    placeholder="Örn: /projects"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveMenuItem(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMenuItem(index, 'down')}
                    disabled={index === settings.menu_items.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMenuItem}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Yeni Menü Öğesi Ekle
            </button>
          </div>
        </div>

        <FormActions>
          <FormButton
            type="submit"
            loading={saving}
            loadingText="Kaydediliyor..."
          >
            Kaydet
          </FormButton>
        </FormActions>
      </form>
    </FormLayout>
  );
};

export default HeaderSettingsPage;
