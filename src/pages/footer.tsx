import React, { useState, useEffect } from "react";
import FooterForm from "../components/footer/FooterForm";
import { fetchFooter, updateFooter, Footer } from "../config/supabase";
import Swal from "sweetalert2";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

export default function FooterPage() {
  const [footer, setFooter] = useState<Partial<Footer>>({
    cta_title: "",
    cta_link: "",
    sitemap_items: [],
    social_items: [],
    copyright_text: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Footer" }
    ]);
    loadFooter();
  }, [setBreadcrumbs]);

  const loadFooter = async () => {
    try {
      const data = await fetchFooter();
      if (data) {
        // JSONB verilerini doğru formata çevir
        const formattedData = {
          ...data,
          sitemap_items: Array.isArray(data.sitemap_items) ? data.sitemap_items : [],
          social_items: Array.isArray(data.social_items) ? data.social_items : []
        };
        setFooter(formattedData);
      }
    } catch (error) {
      console.error("Footer yükleme hatası:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Footer yüklenirken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFooter(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSitemapChange = (items: Array<{ name: string; link: string }>) => {
    setFooter(prev => ({
      ...prev,
      sitemap_items: items,
    }));
  };

  const handleSocialChange = (items: Array<{ name: string; link: string }>) => {
    setFooter(prev => ({
      ...prev,
      social_items: items,
    }));
  };

  const handleSubmit = async () => {
    if (!footer.cta_title?.trim() || !footer.cta_link?.trim() || !footer.copyright_text?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı",
        text: "Lütfen tüm zorunlu alanları doldurun!",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Veriyi güncellemeden önce formatla
      const updateData = {
        ...footer,
        sitemap_items: footer.sitemap_items || [],
        social_items: footer.social_items || []
      };

      const result = await updateFooter(updateData);

      if (result) {
        // Sonucu da formatla
        const formattedResult = {
          ...result,
          sitemap_items: Array.isArray(result.sitemap_items) ? result.sitemap_items : [],
          social_items: Array.isArray(result.social_items) ? result.social_items : []
        };
        setFooter(formattedResult);
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Footer başarıyla güncellendi",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error("Footer güncelleme hatası:", err);
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
    <FooterForm
      footer={footer}
      onChange={handleChange}
      onSitemapChange={handleSitemapChange}
      onSocialChange={handleSocialChange}
      onSubmit={handleSubmit}
      submitText="Güncelle"
      isLoading={isLoading}
    />
  );
}
