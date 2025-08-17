import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../../utils/api';
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";
import { Project } from "../../types/Project";
import Swal from "sweetalert2";

const ProjectsEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [newBanner, setNewBanner] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const { setBreadcrumbs, setIsLoading } = useBreadcrumb();

  useEffect(() => {
    // Breadcrumb'ı ayarla
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Projects", to: "/admin/projects" },
      { name: "Edit Project" }
    ]);

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get<Project>(`/api/projects/${id}`);

        setProject(res.data);
        setTitle(res.data.title);
        setSubtitle(res.data.subtitle);
        setDescription(res.data.description || "");
        setExternalLink(res.data.external_link || "");
        setClientName(res.data.client_name || "");
        setYear(res.data.year || "");
        setRole(res.data.role || "");
        setGallery(res.data.gallery_images || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Proje getirme hatası:", err.response?.status, err.message);
        setError("Proje bulunamadı");
        setProject(null);
        setIsLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, setBreadcrumbs, setIsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("external_link", externalLink);
      formData.append("client_name", clientName);
      formData.append("year", year);
      formData.append("role", role);
      formData.append("slug", project?.slug || "");
      formData.append("featured_order", project?.featured_order?.toString() || "");

      // Yeni thumbnail yüklendiyse ekle
      if (newThumbnail) {
        formData.append("thumbnail_media", newThumbnail);
      }

      // Yeni banner yüklendiyse ekle
      if (newBanner) {
        formData.append("banner_media", newBanner);
      }

      await axiosInstance.put(`/api/projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Proje başarıyla güncellendi.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/admin/projects");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Güncelleme sırasında hata oluştu.",
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewThumbnail(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBanner(e.target.files[0]);
    }
  };

  const handleGalleryUpload = async () => {
    if (!newImages.length) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Yüklenecek görsel seçilmedi.",
      });
      return;
    }

    const formData = new FormData();
    newImages.forEach((file) => formData.append("images", file));

    try {
      await axiosInstance.post(`/api/projects/${id}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Galeri başarıyla yüklendi.",
        timer: 2000,
        showConfirmButton: false,
      });
      setNewImages([]);
      // Galeriyi yeniden yükle
      const res = await axiosInstance.get<Project>(`/api/projects/${id}`);
      setGallery(res.data.gallery_images || []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Galeri yüklenirken hata oluştu.",
      });
    }
  };

  const handleDeleteImage = async (filename: string) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu görseli silmek istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/projects/${id}/gallery`, {
        params: { image: filename },
      });

      // Güncel galeriyi backend'den çek
      const res = await axiosInstance.get<Project>(`/api/projects/${id}`);
      setGallery(res.data.gallery_images || []);

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Görsel silindi.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Görsel silinirken hata oluştu.",
      });
    }
  };

  if (!project) return <div>Proje bulunamadı.</div>;

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
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

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "1rem" }}>Projeyi Düzenle</h1>
      
             {/* Thumbnail Görsel */}
       <div style={{ marginBottom: "1rem" }}>
         <label style={labelStyle}>Thumbnail:</label>
         {project.thumbnail_media && (
           <div style={{ marginBottom: "0.5rem" }}>
             <label style={{ fontSize: "14px", color: "#666" }}>Mevcut:</label>
             {/\.(mp4|webm|ogg|mov)$/i.test(project.thumbnail_media) ? (
               <div
                 style={{
                   width: "200px",
                   height: "120px",
                   backgroundColor: "#f0f0f0",
                   borderRadius: "8px",
                   border: "1px solid #ccc",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   color: "#666",
                   fontSize: "14px"
                 }}
               >
                 🎥 Video Thumbnail
               </div>
             ) : (
               <img
                 src={getImageUrl(project.thumbnail_media)}
                 alt="Thumbnail"
                 style={{
                   width: "200px",
                   height: "120px",
                   objectFit: "cover",
                   borderRadius: "8px",
                   border: "1px solid #ccc"
                 }}
                 onError={(e) => {
                   e.currentTarget.src = getFallbackImageUrl();
                 }}
               />
             )}
           </div>
         )}
         <input
           type="file"
           accept="image/*,video/*"
           onChange={handleThumbnailChange}
           style={{ marginBottom: "0.5rem" }}
         />
         {newThumbnail && (
           <p style={{ fontSize: "14px", color: "#666" }}>
             Yeni seçilen: {newThumbnail.name}
           </p>
         )}
       </div>

       {/* Banner Görsel */}
       <div style={{ marginBottom: "1rem" }}>
         <label style={labelStyle}>Banner:</label>
         {project.banner_media && (
           <div style={{ marginBottom: "0.5rem" }}>
             <label style={{ fontSize: "14px", color: "#666" }}>Mevcut:</label>
             {/\.(mp4|webm|ogg|mov)$/i.test(project.banner_media) ? (
               <div
                 style={{
                   width: "200px",
                   height: "120px",
                   backgroundColor: "#f0f0f0",
                   borderRadius: "8px",
                   border: "1px solid #ccc",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   color: "#666",
                   fontSize: "14px"
                 }}
               >
                 🎥 Video Banner
               </div>
             ) : (
               <img
                 src={getImageUrl(project.banner_media)}
                 alt="Banner"
                 style={{
                   width: "200px",
                   height: "120px",
                   objectFit: "cover",
                   borderRadius: "8px",
                   border: "1px solid #ccc"
                 }}
                 onError={(e) => {
                   e.currentTarget.src = getFallbackImageUrl();
                 }}
               />
             )}
           </div>
         )}
         <input
           type="file"
           accept="image/*,video/*"
           onChange={handleBannerChange}
           style={{ marginBottom: "0.5rem" }}
         />
         {newBanner && (
           <p style={{ fontSize: "14px", color: "#666" }}>
             Yeni seçilen: {newBanner.name}
           </p>
         )}
       </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>Başlık:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Alt Başlık:</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Açıklama:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Dış Bağlantı (External Link):</label>
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Müşteri (Client):</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Yıl:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Rol:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>Güncelle</button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2 style={{ fontSize: "20px", marginBottom: "0.5rem" }}>Galeri Görselleri</h2>

      <input type="file" multiple onChange={handleFileChange} style={{ marginBottom: "1rem" }} />
      <button onClick={handleGalleryUpload} style={buttonStyle}>Galeri Yükle</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginTop: "1rem" }}>

        {gallery.length > 0 ? (
          gallery.map((img, idx) => {
            const filename = img.replace(/\\/g, "/");
            const imageUrl = getImageUrl(img);
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(img);


            return (
              <div key={idx} style={{ position: "relative" }}>
                {isVideo ? (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      borderRadius: "8px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontSize: "12px",
                      position: "relative",
                    }}
                  >
                    <span>🎥 Video</span>
                    <video
                      src={imageUrl}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      }}
                                             onLoadedData={(e) => {
                         e.currentTarget.style.opacity = "1";
                       }}
                       onError={(e) => {
                         e.currentTarget.style.display = "none";
                       }}
                      controls
                      muted
                    />
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={`galeri-${idx}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                      height: "150px",
                    }}
                                         onError={(e) => {
                       e.currentTarget.src = getFallbackImageUrl();
                     }}
                  />
                )}
                <button
                  onClick={() => handleDeleteImage(filename)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Sil
                </button>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#666" }}>
            Henüz galeri görseli yüklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsEditPage;
