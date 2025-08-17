import axiosInstance from "../../utils/axiosInstance";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { Project } from "../../types/Project";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectList = ({ projects, setProjects }: Props) => {
  if (projects.length === 0) return <p>Proje bulunamadı.</p>;

  const handleDelete = async (projectId: number) => {
    const result = await Swal.fire({
      title: "Bu projeyi silmek istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, sil",
      cancelButtonText: "İptal",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/api/projects/${projectId}`);
      Swal.fire({
        icon: "success",
        title: "Silindi!",
        timer: 1500,
        showConfirmButton: false,
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Silme işlemi başarısız!",
        text: (err as Error).message || "",
      });
    }
  };

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Başlık</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => {
          const isVideoThumbnail = /\.(mp4|webm|ogg|mov)$/i.test(project.thumbnail_media || '');
          
          return (
            <tr key={project.id} className="hover">
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
