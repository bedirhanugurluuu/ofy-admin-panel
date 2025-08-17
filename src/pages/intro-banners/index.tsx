// pages/intro-banners/index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerList from "../../components/intro-banners/BannerList";
import { api } from "../../utils/api";
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
    api.getIntroBanners()
      .then(res => {
        setBanners(res.data as Banner[]);
        // Hemen loading'i kapat
        setTimeout(() => setIsLoading(false), 100);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [setBreadcrumbs, setIsLoading]);



  const handleDelete = (id: number) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    api.deleteIntroBanner(id)
      .then(() => {
        setBanners(prev => prev.filter(b => b.id !== id));
      })
      .catch((err: any) => {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: err.message,
        });
      });
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
