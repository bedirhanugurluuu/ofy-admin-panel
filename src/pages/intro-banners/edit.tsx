import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BannerForm from "../../components/intro-banners/BannerForm";
import { api } from '../../utils/api';
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
}

export default function EditIntroBannerPage() {
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = useState<Partial<Banner>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setBreadcrumbs, setIsLoading } = useBreadcrumb();

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

    setIsLoading(true);
    api.getIntroBanner(parseInt(id!))
      .then(res => {
        setBanner(res.data as Banner);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id, setIsLoading]);

  // Yeni seçilen dosya için state
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBanner({
      ...banner,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Mevcut image URL'sini temizleyebiliriz (isteğe bağlı)
      setBanner(prev => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = () => {
    // Validation: 3. banner ise tüm alanlar gerekli
    if (banner.order_index === 3) {
      if (
        !banner.title_line1 ||
        !banner.button_text ||
        !banner.button_link
      ) {
        alert("Lütfen 3. banner için tüm alanları doldurun!");
        return;
      }
    }

    if (!banner.image && !imageFile) {
      alert("Lütfen görsel seçin!");
      return;
    }

    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Mevcut image URL varsa backend'in onu kullanması için
    if (banner.image && !imageFile) {
      formData.append("imageUrl", banner.image);
    }

    formData.append("order_index", String(banner.order_index ?? 1));
    formData.append("title_line1", banner.title_line1 || "");
    formData.append("title_line2", banner.title_line2 || "");
    formData.append("button_text", banner.button_text || "");
    formData.append("button_link", banner.button_link || "");

    api.updateIntroBanner(parseInt(id!), formData)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Banner başarıyla güncellendi",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/admin/intro-banners");
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.message,
      });
    });
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
      />
    </div>
  );
}
