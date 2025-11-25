import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BannerForm from "../../components/intro-banners/BannerForm";
import { api } from '../../utils/api';
import { storageUtils } from '../../utils/supabaseStorage';
import Swal from "sweetalert2";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";

interface Banner {
  id: number;
  image: string;           // Mevcut görsel URL'si
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
  scroll_text?: string;
  project_id?: string;
}

export default function EditIntroBannerPage() {
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = useState<Partial<Banner>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setBreadcrumbs, setIsLoading: setGlobalLoading } = useBreadcrumb();

  useEffect(() => {
    // Breadcrumb'ı ayarla
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Intro Banners", to: "/admin/intro-banners" },
      { name: "Edit Banner" }
    ]);
  }, [setBreadcrumbs]);



  // Banner verisini çek
  useEffect(() => {
    if (!id) return;

    setGlobalLoading(true);
    api.introBanners.getById(id)
      .then(({ data, error }) => {
        if (error) throw error;
        setBanner(data as Banner);
        setGlobalLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setGlobalLoading(false);
      });
  }, [id, setGlobalLoading]);

  // Yeni seçilen dosya için state
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBanner({
      ...banner,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Mevcut image URL'sini koruyoruz ki eski resmi silebilelim
    }
  };

  const handleSubmit = async () => {
    // Validation: 3. banner ise tüm alanlar gerekli
    if (banner.order_index === 3) {
      if (
        !banner.title_line1 ||
        !banner.button_text ||
        !banner.button_link
      ) {
        Swal.fire({
          icon: "warning",
          title: "Uyarı!",
          text: "Lütfen 3. banner için tüm alanları doldurun!",
        });
        return;
      }
    }

    if (!banner.image && !imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Lütfen görsel seçin!",
      });
      return;
    }

    setIsLoading(true);

    try {
      let newImagePath = banner.image;

      // Yeni resim yüklendiyse
      if (imageFile) {
        // Eski resmi sil
        if (banner.image) {
          // image_path tam URL olarak geliyor, sadece dosya adını al
          let fileName = '';
          if (banner.image.includes('/uploads/')) {
            // /uploads/filename.jpg formatında
            fileName = banner.image.split('/uploads/')[1];
          } else if (banner.image.includes('supabase.co')) {
            // https://supabase.co/... formatında
            const urlParts = banner.image.split('/');
            fileName = urlParts[urlParts.length - 1];
          } else {
            // Direkt dosya adı
            fileName = banner.image;
          }
          
          if (fileName) {
            await storageUtils.deleteFile(fileName);
          }
        }
        
        // Yeni resmi yükle
        const timestamp = Date.now();
        const fileName = `introbanner-${timestamp}-${Math.random().toString(36).substring(2)}.${imageFile.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(imageFile, fileName);
        if (uploadError) throw uploadError;
        newImagePath = `/uploads/${fileName}`;
      }

      // Banner'ı güncelle
      const { error } = await api.introBanners.update(id!, {
        order_index: banner.order_index ?? 1,
        title_line1: banner.title_line1 || "",
        title_line2: banner.title_line2 || "",
        button_text: banner.button_text || "",
        button_link: banner.button_link || "",
        scroll_text: banner.scroll_text || "",
        project_id: banner.project_id || null,
        image: newImagePath
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Banner başarıyla güncellendi",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/admin/intro-banners");
    } catch (err: any) {
      console.error("Banner güncelleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.message || "Güncelleme sırasında hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Banner Düzenle</h1>
      <BannerForm
        banner={banner}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        submitText="Güncelle"
        showFullFields={banner.order_index === 3}
        isLoading={isLoading}
        mode="edit"
      />
    </div>
  );
}
