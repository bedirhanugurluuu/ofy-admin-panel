import React, { useEffect, useState, ChangeEvent } from "react";
import { api } from "../../utils/api";
import { storageUtils } from "../../utils/supabaseStorage";
import Swal from "sweetalert2";

interface ProjectResponse {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  external_link: string;
  client_name: string;
  year: string;
  role: string;
  thumbnail_image: string;
  video_url?: string | null;
  featured_order: number;
}

const ProjectForm: React.FC<{ mode: "new" | "edit" }> = ({ mode }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [thumbnailMedia, setThumbnailMedia] = useState<File | null>(null);
  const [bannerMedia, setBannerMedia] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");



  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "0.25rem",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb", // Tailwind blue-600
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  };

  // Dosya inputları için handlerlar
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailMedia(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBannerMedia(e.target.files[0]);
    }
  };

  const handleFeaturedOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeaturedOrder(e.target.value);
  };

  const handleFeaturedChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newFeaturedValue = e.target.checked;
    
    if (newFeaturedValue) {
      try {
        const { data: existingProjects, error: getError } = await api.projects.getAll();
        if (getError) throw getError;
        
        if (existingProjects) {
          const featuredCount = existingProjects.filter(p => p.is_featured).length;
          
          // Eğer bu proje zaten featured ise sayıyı azalt
          const currentProject = existingProjects.find(p => p.slug === slug);
          const adjustedCount = currentProject && currentProject.is_featured ? featuredCount - 1 : featuredCount;
          
          if (adjustedCount >= 4) {
            const result = await Swal.fire({
              icon: "warning",
              title: "Uyarı!",
              text: `Şu anda ${adjustedCount} featured proje var. Anasayfada sadece 4 featured proje gösterilir. Bu projeyi featured yapmak istediğinize emin misiniz?`,
              showCancelButton: true,
              confirmButtonText: "Evet, Featured Yap",
              cancelButtonText: "İptal"
            });
            
            if (!result.isConfirmed) {
              return; // Checkbox'ı işaretleme
            }
          }
        }
      } catch (err) {
        console.error("Featured proje sayısı kontrol edilemedi:", err);
        return; // Hata durumunda checkbox'ı işaretleme
      }
    }
    
    setIsFeatured(newFeaturedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Başlık ve slug zorunludur.",
      });
      return;
    }

    // Featured proje sayısını kontrol et
    if (isFeatured) {
      try {
        const { data: existingProjects, error: getError } = await api.projects.getAll();
        if (getError) throw getError;
        
        if (existingProjects) {
          const featuredCount = existingProjects.filter(p => p.is_featured).length;
          
          // Eğer bu proje zaten featured ise sayıyı azalt
          const currentProject = existingProjects.find(p => p.slug === slug);
          const adjustedCount = currentProject && currentProject.is_featured ? featuredCount - 1 : featuredCount;
          
          if (adjustedCount >= 4) {
            const result = await Swal.fire({
              icon: "warning",
              title: "Uyarı!",
              text: `Şu anda ${adjustedCount} featured proje var. Anasayfada sadece 4 featured proje gösterilir. Bu projeyi featured yapmak istediğinize emin misiniz?`,
              showCancelButton: true,
              confirmButtonText: "Evet, Featured Yap",
              cancelButtonText: "İptal"
            });
            
            if (!result.isConfirmed) {
              return;
            }
          }
        }
      } catch (err) {
        console.error("Featured proje sayısı kontrol edilemedi:", err);
      }
    }

    try {
      // Resimleri yükle
      let thumbnailPath = "";
      let bannerPath = "";

      if (thumbnailMedia) {
        const timestamp = Date.now();
        const fileName = `project-thumbnail-${timestamp}-${Math.random().toString(36).substring(2)}.${thumbnailMedia.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(thumbnailMedia, fileName);
        if (uploadError) throw uploadError;
        thumbnailPath = `/uploads/${fileName}`;
      }

      if (bannerMedia) {
        const timestamp = Date.now();
        const fileName = `project-banner-${timestamp}-${Math.random().toString(36).substring(2)}.${bannerMedia.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await storageUtils.uploadFile(bannerMedia, fileName);
        if (uploadError) throw uploadError;
        bannerPath = `/uploads/${fileName}`;
      }

      const projectData = {
        title,
        subtitle,
        slug,
        description,
        external_link: externalLink,
        client_name: clientName,
        year,
        role,
        is_featured: isFeatured,
        featured_order: parseInt(featuredOrder) || 0,
        order: order ? parseInt(order) : undefined,
        thumbnail_media: thumbnailPath || null,
        banner_media: bannerPath || null
      };

      if (mode === "new") {
        const { data, error } = await api.projects.create(projectData);
        if (error) throw error;
      } else {
        // Edit mode için slug'ı kullanarak projeyi bul ve güncelle
        const { data: existingProjects, error: getError } = await api.projects.getAll();
        if (getError) throw getError;
        
        if (!existingProjects) throw new Error("Projeler yüklenemedi");
        
        const existingProject = existingProjects.find(p => p.slug === slug);
        if (!existingProject) throw new Error("Proje bulunamadı");
        
        const { error } = await api.projects.update(existingProject.id.toString(), projectData);
        if (error) throw error;
      }

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: `Proje ${mode === "new" ? "eklendi" : "güncellendi"}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      if (mode === "new") {
        setTitle("");
        setSubtitle("");
        setSlug("");
        setDescription("");
        setExternalLink("");
        setClientName("");
        setYear("");
        setRole("");
        setIsFeatured(false);
        setFeaturedOrder("");
        setThumbnailMedia(null);
        setBannerMedia(null);
        setVideoUrl("");
      }
    } catch (err) {
      console.error("Proje kaydetme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "İşlem sırasında hata oluştu.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto", padding: 20, display: "grid", gap: 16 }}>
      <div>
        <label style={labelStyle}>Başlık *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Alt Başlık</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Dış Bağlantı (External Link)</label>
        <input
          type="url"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          placeholder="https://..."
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Müşteri (Client)</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Yıl</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Rol</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Thumbnail (image or video)</label>
        <input type="file" accept="image/*,video/*" onChange={handleThumbnailChange} />
        {thumbnailMedia && <p>Seçilen dosya: {thumbnailMedia.name}</p>}
      </div>

      <div>
        <label style={labelStyle}>Banner (image or video)</label>
        <input type="file" accept="image/*,video/*" onChange={handleBannerChange} />
        {bannerMedia && <p>Seçilen dosya: {bannerMedia.name}</p>}
      </div>

      <div>
        <label style={labelStyle}>Video URL (opsiyonel)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={inputStyle}
          placeholder="https://..."
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={handleFeaturedChange}
          id="featured-checkbox"
        />
        <label htmlFor="featured-checkbox" style={{ margin: 0 }}>Featured mı?</label>
      </div>

      <div>
        <label style={labelStyle}>Featured sırası</label>
        <input
          type="number"
          value={featuredOrder}
          onChange={handleFeaturedOrderChange}
          style={inputStyle}
          min={0}
          step={1}
        />
      </div>

      <div>
        <label style={labelStyle}>Genel Sıralama (Order)</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={inputStyle}
          min={0}
          step={1}
          placeholder="Sıralama numarası (opsiyonel)"
        />
        <small style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "0.25rem" }}>
          Düşük sayılar önce gösterilir. Boş bırakılırsa en sona eklenir.
        </small>
      </div>

      <button type="submit" style={buttonStyle}>
        {mode === "new" ? "Proje Ekle" : "Projeyi Güncelle"}
      </button>
    </form>
  );
};

export default ProjectForm;
