import React, { useEffect, useState } from "react";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";

interface GalleryImage {
  id: number;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export default function AboutGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { setBreadcrumbs, setIsLoading: setGlobalLoading } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "About Gallery" }
    ]);

    loadImages();
  }, [setBreadcrumbs]);

  const loadImages = async () => {
    setGlobalLoading(true);
    try {
      const response = await axiosInstance.get<GalleryImage[]>("/api/about-gallery");
      setImages(response.data);
    } catch (err) {
      console.error("Gallery yüklenemedi:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Gallery yüklenirken hata oluştu.",
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await axiosInstance.post("/api/about-gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Resim başarıyla eklendi.",
        timer: 2000,
        showConfirmButton: false,
      });

      loadImages();
    } catch (err: any) {
      console.error("Resim yükleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.response?.data?.error || "Resim yüklenirken hata oluştu.",
      });
    } finally {
      setUploading(false);
      e.target.value = ""; // Input'u temizle
    }
  };

  const handleDeleteImage = async (id: number) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu resim kalıcı olarak silinecek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/api/about-gallery/${id}`);
        
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Resim başarıyla silindi.",
          timer: 2000,
          showConfirmButton: false,
        });

        loadImages();
      } catch (err) {
        console.error("Resim silme hatası:", err);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Resim silinirken hata oluştu.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">About Gallery Yönetimi</h1>

      {/* Upload Section */}
      <div className="card bg-base-100 shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Yeni Resim Ekle</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || images.length >= 5}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          {uploading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {images.length >= 5 && (
            <span className="text-sm text-red-500">
              Maksimum 5 resim eklenebilir
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Maksimum 5 resim eklenebilir. Resimler 450x520 boyutunda görüntülenecektir.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="card bg-base-100 shadow-lg">
            <figure className="relative">
              <img
                src={`http://localhost:5000${image.image_path}`}
                alt={`Gallery image ${image.order_index + 1}`}
                className="w-full h-64 object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Sıra: {image.order_index + 1}
                </span>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isLoading}
                  className="btn btn-sm btn-error"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Sil"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Henüz resim eklenmemiş.</p>
        </div>
      )}
    </div>
  );
}
