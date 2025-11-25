import React, { useEffect, useState } from "react";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";
import { fetchProjects, Project } from "../../config/supabase";

interface Banner {
  id?: number;
  image?: string;          // URL veya boş
  title_line1?: string;
  title_line2?: string;
  button_text?: string;
  button_link?: string;
  scroll_text?: string;    // "Scroll to view more" metni
  project_id?: string;     // Bağlantılı proje ID'si
}

interface Props {
  banner: Partial<Banner>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitText?: string;
  showFullFields?: boolean; // 3. banner mı, ona göre alan göster
  isLoading?: boolean;
  mode?: "new" | "edit";
}

export default function BannerForm({
  banner,
  onChange,
  onFileChange,
  onSubmit,
  submitText = "Kaydet",
  showFullFields = false,
  isLoading = false,
  mode = "edit",
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);
  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Dosya inputu */}
      <div>
        <label className="block mb-1 font-semibold">Görsel Seç</label>
        <input type="file" accept="image/*" onChange={onFileChange} />
        {/* Eğer URL görüntülemek istersen opsiyonel: */}
        {banner.image && !banner.image.startsWith("blob:") && (
          <img 
            src={getImageUrl(banner.image)} 
            alt="Mevcut Görsel" 
            className="mt-2 max-h-40 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = getFallbackImageUrl();
            }}
          />
        )}
      </div>

      {/* Scroll text ve project seçimi her zaman göster */}
      <input
        name="scroll_text"
        value={banner.scroll_text || ""}
        onChange={onChange}
        placeholder="Scroll to view more metni (örn: Scroll to view more)"
        className="border p-2 w-full"
      />
      
      {/* Proje seçimi */}
      <div>
        <label className="block mb-1 font-semibold">Bağlantılı Proje Seç</label>
        <select
          name="project_id"
          value={banner.project_id || ""}
          onChange={onChange}
          className="border p-2 w-full"
        >
          <option value="">Proje seçin...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Eğer 3. banner ise, yazı alanları göster */}
      {showFullFields && (
        <>
          <input
            name="title_line1"
            value={banner.title_line1 || ""}
            onChange={onChange}
            placeholder="Başlık Satırı 1"
            className="border p-2 w-full"
          />
          <input
            name="title_line2"
            value={banner.title_line2 || ""}
            onChange={onChange}
            placeholder="Başlık Satırı 2"
            className="border p-2 w-full"
          />
          <input
            name="button_text"
            value={banner.button_text || ""}
            onChange={onChange}
            placeholder="Buton Metni"
            className="border p-2 w-full"
          />
          <input
            name="button_link"
            value={banner.button_link || ""}
            onChange={onChange}
            placeholder="Buton Linki"
            className="border p-2 w-full"
          />
        </>
      )}

      <button 
        onClick={onSubmit} 
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
}
