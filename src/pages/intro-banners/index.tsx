// pages/intro-banners/index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerList from "../../components/intro-banners/BannerList";
import { api } from "../../utils/api";
import { storageUtils } from "../../utils/supabaseStorage";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";
import Swal from "sweetalert2";

interface Banner {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

export default function IntroBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setBreadcrumbs, setIsLoading } = useBreadcrumb();

  useEffect(() => {
    // Breadcrumb'ı hemen ayarla
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Intro Banners" }
    ]);

    // Kısa loading göster
    setIsLoading(true);

    // API çağrısını yap - çok hızlı
    api.introBanners.getAll()
      .then(({ data, error }) => {
        if (error) throw error;
        setBanners(data as Banner[]);
        // Hemen loading'i kapat
        setTimeout(() => setIsLoading(false), 100);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [setBreadcrumbs, setIsLoading]);



  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu banner kalıcı olarak silinecek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      try {
        // Önce banner'ı bul
        const { data: bannerData, error: getError } = await api.introBanners.getById(id.toString());
        if (getError) throw getError;

        // Supabase Storage'dan dosyayı sil
        if (bannerData?.image) {
          // image_path tam URL olarak geliyor, sadece dosya adını al
          const urlParts = bannerData.image.split('/');
          const fileName = urlParts[urlParts.length - 1]; // Son kısım dosya adı
          console.log('Silmeye çalışılan dosya:', fileName);
          console.log('Orijinal path:', bannerData.image);
          const deleteResult = await storageUtils.deleteFile(fileName);
          console.log('Silme sonucu:', deleteResult);
        }

        // Veritabanından kaydı sil
        const { error: deleteError } = await api.introBanners.delete(id.toString());
        if (deleteError) throw deleteError;
        
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Banner başarıyla silindi.",
          timer: 2000,
          showConfirmButton: false,
        });

        setBanners(prev => prev.filter(b => b.id !== id));
      } catch (err) {
        console.error("Banner silme hatası:", err);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Banner silinirken hata oluştu.",
        });
      }
    }
  };

  if (error) return <p>Hata: {error}</p>;

  return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Intro Banners</h1>
      {banners.length < 3 ? (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/intro-banners/new")}
        >
          + Yeni Banner
        </button>
      ) : (
        <button
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          title="Maksimum 3 banner eklenebilir"
        >
          Maksimum banner sayısına ulaşıldı
        </button>
      )}
    </div>

    <BannerList banners={banners} onDelete={handleDelete} />
  </div>
);
}
