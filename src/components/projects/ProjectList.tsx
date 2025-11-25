import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { useState } from "react";
import { Project } from "../../types/Project";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";
import { api } from "../../utils/api";
import { storageUtils } from "../../utils/supabaseStorage";

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectList = ({ projects, setProjects }: Props) => {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string | number>>(new Set());

  const handleOrderChange = async (projectId: number | string, newOrder: number) => {
    const projectIdStr = String(projectId);
    
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, order: newOrder } : p))
    );

    setUpdatingOrders((prev) => new Set(prev).add(projectId));

    try {
      const { error } = await api.projects.update(projectIdStr, { order: newOrder });
      
      if (error) {
        throw error;
      }

      // Başarılı olduğunda listeyi yeniden sırala
      setProjects((prev) =>
        [...prev].sort((a, b) => {
          const orderA = a.order ?? 999999;
          const orderB = b.order ?? 999999;
          if (orderA !== orderB) return orderA - orderB;
          return 0;
        })
      );
    } catch (err: any) {
      console.error("Order update error:", err);
      
      // Hata durumunda eski değere geri dön
      const { data: projectData } = await api.projects.getById(projectIdStr);
      if (projectData) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, order: projectData.order } : p))
        );
      }

      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Sıralama güncellenirken hata oluştu.",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  if (projects.length === 0) return <p>Proje bulunamadı.</p>;

  // Order'a göre sırala
  const sortedProjects = [...projects].sort((a, b) => {
    const orderA = a.order ?? 999999;
    const orderB = b.order ?? 999999;
    if (orderA !== orderB) return orderA - orderB;
    return 0;
  });

  const handleDelete = async (projectId: number | string) => {
    const result = await Swal.fire({
      title: "Bu projeyi silmek istediğinize emin misiniz?",
      text: "Proje ve tüm galeri görselleri kalıcı olarak silinecek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
    });

    if (!result.isConfirmed) return;

    try {
      const projectIdStr = String(projectId);
      
      // 1. Önce projeyi al (thumbnail ve banner bilgileri için)
      const { data: projectData, error: getError } = await api.projects.getById(projectIdStr);
      if (getError) throw getError;
      if (!projectData) throw new Error("Proje bulunamadı");

      // 2. Galeri görsellerini al ve sil
      const { data: galleryData, error: galleryError } = await api.projectGallery.getByProjectId(projectIdStr);
      if (!galleryError && galleryData) {
        for (const galleryItem of galleryData) {
          if (galleryItem.image_path) {
            const urlParts = galleryItem.image_path.split('/');
            const fileName = urlParts[urlParts.length - 1];
            await storageUtils.deleteFile(fileName);
          }
          // Galeri kaydını sil
          await api.projectGallery.delete(galleryItem.id);
        }
      }

      // 3. Thumbnail ve banner görsellerini Supabase Storage'dan sil
      if (projectData.thumbnail_media) {
        const thumbParts = projectData.thumbnail_media.split('/');
        const thumbFileName = thumbParts[thumbParts.length - 1];
        await storageUtils.deleteFile(thumbFileName);
      }
      
      if (projectData.banner_media) {
        const bannerParts = projectData.banner_media.split('/');
        const bannerFileName = bannerParts[bannerParts.length - 1];
        await storageUtils.deleteFile(bannerFileName);
      }

      // 4. Projeyi Supabase'den sil
      const { error } = await api.projects.delete(projectIdStr);
      
      if (error) {
        throw error;
      }

      Swal.fire({
        icon: "success",
        title: "Silindi!",
        text: "Proje ve tüm görselleri başarıyla silindi.",
        timer: 1500,
        showConfirmButton: false,
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: any) {
      console.error("Delete error:", err);
      
      let errorMessage = "Silme işlemi başarısız!";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.code) {
        errorMessage = `Hata kodu: ${err.code}`;
      }
      
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: errorMessage,
      });
    }
  };

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Sıra</th>
          <th>Thumbnail</th>
          <th>Başlık</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {sortedProjects.map((project) => {
          const isUpdating = updatingOrders.has(project.id);
          const isVideoThumbnail = /\.(mp4|webm|ogg|mov)$/i.test(project.thumbnail_media || '');
          
          return (
            <tr key={project.id} className="hover">
              <td>
                <input
                  type="number"
                  value={project.order ?? ''}
                  onChange={(e) => {
                    const newOrder = parseInt(e.target.value) || 0;
                    handleOrderChange(project.id, newOrder);
                  }}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  disabled={isUpdating}
                  min="0"
                  style={{ 
                    opacity: isUpdating ? 0.5 : 1,
                    cursor: isUpdating ? 'not-allowed' : 'text'
                  }}
                />
              </td>
              <td>
                {project.thumbnail_media ? (
                  isVideoThumbnail ? (
                    <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      🎥 Video
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(project.thumbnail_media)}
                      alt={project.title}
                      className="w-20 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackImageUrl();
                      }}
                    />
                  )
                ) : (
                  <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </td>
              <td>{project.title}</td>
              <td>
                <Link to={`/admin/projects/edit/${project.id}`} className="btn btn-sm btn-info mr-2">
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="btn btn-sm btn-error"
                >
                  Sil
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProjectList;
