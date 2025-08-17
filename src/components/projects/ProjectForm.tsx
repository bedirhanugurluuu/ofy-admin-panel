import React, { useEffect, useState, ChangeEvent } from "react";
import axiosInstance from "../../utils/axiosInstance";
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

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("external_link", externalLink);
      formData.append("client_name", clientName);
      formData.append("year", year);
      formData.append("role", role);
      formData.append("is_featured", isFeatured ? "1" : "0");
      if (featuredOrder.trim() !== "") {
        formData.append("featured_order", featuredOrder);
      }
      if (thumbnailMedia) formData.append("thumbnail_media", thumbnailMedia);
      if (bannerMedia) formData.append("banner_media", bannerMedia);
      if (videoUrl.trim() !== "") formData.append("video_url", videoUrl);

      let res;
      if (mode === "new") {
        res = await axiosInstance.post("/api/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.put(`/api/projects/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
          onChange={(e) => setIsFeatured(e.target.checked)}
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

      <button type="submit" style={buttonStyle}>
        {mode === "new" ? "Proje Ekle" : "Projeyi Güncelle"}
      </button>
    </form>
  );
};

export default ProjectForm;
