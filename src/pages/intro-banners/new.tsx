import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BannerForm from "../../components/intro-banners/BannerForm";
import { api } from '../../utils/api';
import { storageUtils } from "../../utils/supabaseStorage";
import Swal from "sweetalert2";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";

interface Banner {
  imageFile: File | null;
  order_index: number;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
}

interface IntroBanner {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

export default function NewIntroBannerPage() {
  const [banner, setBanner] = useState<Banner>({
    imageFile: null,
    order_index: 1,
    title_line1: "",
    title_line2: "",
    button_text: "",
    button_link: "",
  });

  const navigate = useNavigate();
  const [banners, setBanners] = useState<IntroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Intro Banners", to: "/admin/intro-banners" },
      { name: "New Banner" }
    ]);
  }, [setBreadcrumbs]);

  function findFirstEmptyIndex(banners: IntroBanner[]): number {
    const max = 3;
    const usedIndexes = banners.map(b => b.order_index);
    for (let i = 1; i <= max; i++) {
      if (!usedIndexes.includes(i)) return i;
    }
    return max + 1;
  }

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { data, error } = await api.introBanners.getAll();
        if (error) throw error;
        setBanners(data || []);
      } catch (err) {
        console.error("Banner yükleme hatası:", err);
        setBanners([]);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    const nextIndex = findFirstEmptyIndex(banners);
    setBanner(prev => ({ ...prev, order_index: nextIndex }));
  }, [banners]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBanner(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!banner.imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı",
        text: "Lütfen bir görsel seçin!",
      });
      return;
    }

    if (banner.order_index === 3) {
      if (
        !banner.title_line1.trim() ||
        !banner.button_text.trim() ||
        !banner.button_link.trim()
      ) {
        Swal.fire({
          icon: "warning",
          title: "Uyarı",
          text: "Lütfen 3. banner için tüm alanları doldurun!",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Resmi Supabase Storage'a yükle
      const timestamp = Date.now();
      const fileName = `introbanner-${timestamp}-${Math.random().toString(36).substring(2)}.${banner.imageFile!.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(banner.imageFile!, fileName);
      if (uploadError) throw uploadError;

      const imagePath = `/uploads/${fileName}`;

      // Banner verilerini hazırla
      const bannerData = {
        image: imagePath,
        order_index: banner.order_index,
        title_line1: banner.title_line1 || "",
        title_line2: banner.title_line2 || "",
        button_text: banner.button_text || "",
        button_link: banner.button_link || ""
      };

      // Veritabanına kaydet
      const { error: createError } = await api.introBanners.create(bannerData);
      if (createError) throw createError;

      Swal.fire({
        icon: "success",
        title: "Başarılı",
        text: "Banner başarıyla eklendi",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/intro-banners");
    } catch (err: any) {
      console.error("Banner ekleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: err.message || "Banner eklenirken hata oluştu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yeni Intro Banner Ekle</h1>
      <BannerForm
        banner={banner}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="new"
      />
    </div>
  );
}
