import React, { useState, useEffect } from "react";
import AboutBannerForm from "../components/about-banner/AboutBannerForm";
import { fetchAboutBanner, updateAboutBanner, AboutBanner } from "../config/supabase";
import { storageUtils } from "../utils/supabaseStorage";
import Swal from "sweetalert2";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

export default function AboutBannerPage() {
  const [banner, setBanner] = useState<Partial<AboutBanner>>({
    title_desktop: "",
    title_mobile: "",
    button_text: "",
    button_link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "About Banner" }
    ]);
    loadBanner();
  }, [setBreadcrumbs]);

  const loadBanner = async () => {
    try {
      const data = await fetchAboutBanner();
      if (data) {
        setBanner(data);
      }
    } catch (error) {
      console.error("About banner yükleme hatası:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "About banner yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBanner(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
        });
        return;
      }

      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!banner.title_desktop?.trim() || !banner.title_mobile?.trim() || 
        !banner.button_text?.trim() || !banner.button_link?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı",
        text: "Lütfen tüm alanları doldurun!",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imagePath = banner.image;

      // Yeni resim yüklendiyse
      if (imageFile) {
        // Eski resmi sil
        if (banner.image && banner.image !== '/images/about-banner.png') {
          let fileName = '';
          if (banner.image.includes('/uploads/')) {
            fileName = banner.image.split('/uploads/')[1];
          } else if (banner.image.includes('supabase.co')) {
            const urlParts = banner.image.split('/');
            fileName = urlParts[urlParts.length - 1];
          } else {
            fileName = banner.image;
          }
          
          if (fileName) {
            await storageUtils.deleteFile(fileName);
          }
        }
        
        // Yeni resmi yükle
        const timestamp = Date.now();
        const fileName = `about-banner-${timestamp}-${Math.random().toString(36).substring(2)}.${imageFile.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(imageFile, fileName);
        if (uploadError) throw uploadError;
        imagePath = `/uploads/${fileName}`;
      }

      // Banner'ı güncelle
      const result = await updateAboutBanner({
        ...banner,
        image: imagePath
      });

      if (result) {
        setBanner(result);
        setImageFile(null);
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "About banner başarıyla güncellendi",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error("About banner güncelleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.message || "Güncelleme sırasında hata oluştu.",
      });
    } finally {
      setIsLoading(false);
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
    <AboutBannerForm
      banner={banner}
      onChange={handleChange}
      onFileChange={handleFileChange}
      onSubmit={handleSubmit}
      submitText="Güncelle"
      isLoading={isLoading}
    />
  );
}
