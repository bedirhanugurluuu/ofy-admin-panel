import React, { useEffect, useState } from "react";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";

interface Project {
  id: number;
  title: string;
  thumbnail_media?: string;
  role?: string;
}

interface AboutContent {
  id?: number;
  title: string;
  subtitle: string;
  main_text: string;
  vision_title: string;
  vision_text: string;
  image_path?: string;
  approach_title: string;
  approach_subtitle: string;
  brand_strategy_title: string;
  brand_strategy_text: string;
  visual_design_title: string;
  visual_design_text: string;
  launch_title: string;
  launch_text: string;
  insights_title?: string;
  insights_subtitle?: string;
  insight_1_title?: string;
  insight_1_text?: string;
  insight_1_project_id?: number;
  insight_2_title?: string;
  insight_2_text?: string;
  insight_2_project_id?: number;
  insight_3_title?: string;
  insight_3_text?: string;
  insight_3_project_id?: number;
  insight_4_title?: string;
  insight_4_text?: string;
  insight_4_project_id?: number;
  clients_title?: string;
  clients_list?: string;
  industries_title?: string;
  industries_list?: string;
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>({
    title: "",
    subtitle: "",
    main_text: "",
    vision_title: "",
    vision_text: "",
    image_path: "",
    approach_title: "",
    approach_subtitle: "",
    brand_strategy_title: "",
    brand_strategy_text: "",
    visual_design_title: "",
    visual_design_text: "",
    launch_title: "",
    launch_text: "",
    insights_title: "Insights",
    insights_subtitle: "",
    insight_1_title: "",
    insight_1_text: "",
    insight_1_project_id: undefined,
    insight_2_title: "",
    insight_2_text: "",
    insight_2_project_id: undefined,
    insight_3_title: "",
    insight_3_text: "",
    insight_3_project_id: undefined,
    insight_4_title: "",
    insight_4_text: "",
    insight_4_project_id: undefined,
    clients_title: "Clients",
    clients_list: "",
    industries_title: "Industries",
    industries_list: ""
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setBreadcrumbs, setIsLoading: setGlobalLoading } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "About" }
    ]);

    // Mevcut içeriği yükle
    setGlobalLoading(true);
    Promise.all([
      axiosInstance.get<AboutContent>("/api/about"),
      axiosInstance.get<Project[]>("/api/projects")
    ])
      .then(([aboutRes, projectsRes]) => {
        // API'den gelen verileri güvenli bir şekilde set et
        const data = aboutRes.data;
        setContent({
          title: data.title || "",
          subtitle: data.subtitle || "",
          main_text: data.main_text || "",
          vision_title: data.vision_title || "",
          vision_text: data.vision_text || "",
          image_path: data.image_path || "",
          approach_title: data.approach_title || "",
          approach_subtitle: data.approach_subtitle || "",
          brand_strategy_title: data.brand_strategy_title || "",
          brand_strategy_text: data.brand_strategy_text || "",
          visual_design_title: data.visual_design_title || "",
          visual_design_text: data.visual_design_text || "",
          launch_title: data.launch_title || "",
          launch_text: data.launch_text || "",
          insights_title: data.insights_title || "Insights",
          insights_subtitle: data.insights_subtitle || "",
          insight_1_title: data.insight_1_title || "",
          insight_1_text: data.insight_1_text || "",
          insight_1_project_id: data.insight_1_project_id,
          insight_2_title: data.insight_2_title || "",
          insight_2_text: data.insight_2_text || "",
          insight_2_project_id: data.insight_2_project_id,
          insight_3_title: data.insight_3_title || "",
          insight_3_text: data.insight_3_text || "",
          insight_3_project_id: data.insight_3_project_id,
          insight_4_title: data.insight_4_title || "",
          insight_4_text: data.insight_4_text || "",
          insight_4_project_id: data.insight_4_project_id,
          clients_title: data.clients_title || "Clients",
          clients_list: data.clients_list || "",
          industries_title: data.industries_title || "Industries",
          industries_list: data.industries_list || ""
        });
        setProjects(projectsRes.data);
        setGlobalLoading(false);
      })
      .catch(err => {
        console.error("About içeriği yüklenemedi:", err);
        setGlobalLoading(false);
      });
  }, [setBreadcrumbs, setGlobalLoading]);

  const handleProjectSelect = (insightNumber: number, projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setContent(prev => ({
        ...prev,
        [`insight_${insightNumber}_title`]: project.title,
        [`insight_${insightNumber}_project_id`]: project.id
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", content.title || "");
      formData.append("subtitle", content.subtitle || "");
      formData.append("main_text", content.main_text || "");
      formData.append("vision_title", content.vision_title || "");
      formData.append("vision_text", content.vision_text || "");
      formData.append("approach_title", content.approach_title || "");
      formData.append("approach_subtitle", content.approach_subtitle || "");
      formData.append("brand_strategy_title", content.brand_strategy_title || "");
      formData.append("brand_strategy_text", content.brand_strategy_text || "");
      formData.append("visual_design_title", content.visual_design_title || "");
      formData.append("visual_design_text", content.visual_design_text || "");
      formData.append("launch_title", content.launch_title || "");
      formData.append("launch_text", content.launch_text || "");
      formData.append("insights_title", content.insights_title || "");
      formData.append("insights_subtitle", content.insights_subtitle || "");
      formData.append("insight_1_title", content.insight_1_title || "");
      formData.append("insight_1_text", content.insight_1_text || "");
      formData.append("insight_1_project_id", content.insight_1_project_id?.toString() || "");
      formData.append("insight_2_title", content.insight_2_title || "");
      formData.append("insight_2_text", content.insight_2_text || "");
      formData.append("insight_2_project_id", content.insight_2_project_id?.toString() || "");
      formData.append("insight_3_title", content.insight_3_title || "");
      formData.append("insight_3_text", content.insight_3_text || "");
      formData.append("insight_3_project_id", content.insight_3_project_id?.toString() || "");
      formData.append("insight_4_title", content.insight_4_title || "");
      formData.append("insight_4_text", content.insight_4_text || "");
      formData.append("insight_4_project_id", content.insight_4_project_id?.toString() || "");
      formData.append("clients_title", content.clients_title || "");
      formData.append("clients_list", content.clients_list || "");
      formData.append("industries_title", content.industries_title || "");
      formData.append("industries_list", content.industries_list || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axiosInstance.put("/api/about", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "About sayfası güncellendi.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Güncelleme sırasında hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">About Sayfası Düzenle</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ana Bölüm */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Ana Bölüm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ana Başlık</label>
              <input
                type="text"
                value={content.title || ""}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="About Us"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alt Başlık</label>
              <input
                type="text"
                value={content.subtitle || ""}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="input input-bordered w-full"
                placeholder="A collective of visionaries shaping tomorrow"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Ana Metin</label>
            <textarea
              value={content.main_text || ""}
              onChange={(e) => setContent({ ...content, main_text: e.target.value })}
              className="textarea textarea-bordered w-full h-32"
              placeholder="Ana metin içeriği..."
              required
            />
          </div>
        </div>

        {/* Vision Bölümü */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Vision Bölümü</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Vision Başlık</label>
              <input
                type="text"
                value={content.vision_title || ""}
                onChange={(e) => setContent({ ...content, vision_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Our Vision"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vision Metin</label>
              <textarea
                value={content.vision_text || ""}
                onChange={(e) => setContent({ ...content, vision_text: e.target.value })}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Vision metni..."
                required
              />
            </div>
          </div>
        </div>

        {/* Approach Bölümü */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Approach Bölümü</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Approach Başlık</label>
              <input
                type="text"
                value={content.approach_title || ""}
                onChange={(e) => setContent({ ...content, approach_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="approach"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Approach Alt Başlık</label>
              <textarea
                value={content.approach_subtitle || ""}
                onChange={(e) => setContent({ ...content, approach_subtitle: e.target.value })}
                className="textarea textarea-bordered w-full h-24"
                placeholder="The epitome of forward-thinking design..."
                required
              />
            </div>
          </div>
        </div>

        {/* Brand Strategy */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Brand Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık</label>
              <input
                type="text"
                value={content.brand_strategy_title || ""}
                onChange={(e) => setContent({ ...content, brand_strategy_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Brand Strategy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Metin</label>
              <textarea
                value={content.brand_strategy_text || ""}
                onChange={(e) => setContent({ ...content, brand_strategy_text: e.target.value })}
                className="textarea textarea-bordered w-full h-32"
                placeholder="Brand strategy metni..."
                required
              />
            </div>
          </div>
        </div>

        {/* Visual Design */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Visual Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık</label>
              <input
                type="text"
                value={content.visual_design_title || ""}
                onChange={(e) => setContent({ ...content, visual_design_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Visual Design"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Metin</label>
              <textarea
                value={content.visual_design_text || ""}
                onChange={(e) => setContent({ ...content, visual_design_text: e.target.value })}
                className="textarea textarea-bordered w-full h-32"
                placeholder="Visual design metni..."
                required
              />
            </div>
          </div>
        </div>

        {/* Launch */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Launch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık</label>
              <input
                type="text"
                value={content.launch_title || ""}
                onChange={(e) => setContent({ ...content, launch_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Launch"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Metin</label>
              <textarea
                value={content.launch_text || ""}
                onChange={(e) => setContent({ ...content, launch_text: e.target.value })}
                className="textarea textarea-bordered w-full h-32"
                placeholder="Launch metni..."
                required
              />
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Insights</h2>
          
          {/* Insights Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık</label>
              <input
                type="text"
                value={content.insights_title || ""}
                onChange={(e) => setContent({ ...content, insights_title: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Insights"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alt Başlık</label>
              <input
                type="text"
                value={content.insights_subtitle || ""}
                onChange={(e) => setContent({ ...content, insights_subtitle: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Discover our latest thinking..."
              />
            </div>
          </div>

          {/* Insights Cards */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((insightNumber) => (
              <div key={insightNumber} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Insight {insightNumber}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Başlık</label>
                    <input
                      type="text"
                      value={content[`insight_${insightNumber}_title` as keyof AboutContent] as string || ""}
                      onChange={(e) => setContent({ 
                        ...content, 
                        [`insight_${insightNumber}_title`]: e.target.value 
                      })}
                      className="input input-bordered w-full"
                      placeholder={`Insight ${insightNumber} başlığı`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Seç</label>
                    <select
                      value={content[`insight_${insightNumber}_project_id` as keyof AboutContent] as number || ""}
                      onChange={(e) => handleProjectSelect(insightNumber, Number(e.target.value))}
                      className="select select-bordered w-full"
                    >
                      <option value="">Project seçin...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Açıklama</label>
                  <textarea
                    value={content[`insight_${insightNumber}_text` as keyof AboutContent] as string || ""}
                    onChange={(e) => setContent({ 
                      ...content, 
                      [`insight_${insightNumber}_text`]: e.target.value 
                    })}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder={`Insight ${insightNumber} açıklaması...`}
                  />
                </div>
              </div>
            ))}
          </div>
                 </div>

         {/* Clients & Industries Section */}
         <div className="card bg-base-100 shadow-lg p-6">
           <h2 className="text-xl font-bold mb-4">Clients & Industries</h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Clients */}
             <div>
               <h3 className="text-lg font-semibold mb-4">Clients</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium mb-2">Başlık</label>
                   <input
                     type="text"
                     value={content.clients_title || ""}
                     onChange={(e) => setContent({ ...content, clients_title: e.target.value })}
                     className="input input-bordered w-full"
                     placeholder="Clients"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Client Listesi (Her satıra bir client)</label>
                   <textarea
                     value={content.clients_list || ""}
                     onChange={(e) => setContent({ ...content, clients_list: e.target.value })}
                     className="textarea textarea-bordered w-full h-48"
                     placeholder="Nike&#10;Electronic Arts&#10;Zapier&#10;Brownkind&#10;Tonal&#10;Mountain Hardwear&#10;Appfire&#10;TAE&#10;22 System&#10;Article One Eyewear&#10;Better World&#10;Gucci&#10;Salt & Stone&#10;Audi&#10;Lululemon&#10;Puma"
                   />
                   <p className="text-xs text-gray-500 mt-1">
                     Her satıra bir client adı yazın. Örnek: Nike, Electronic Arts, vb.
                   </p>
                 </div>
               </div>
             </div>

             {/* Industries */}
             <div>
               <h3 className="text-lg font-semibold mb-4">Industries</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium mb-2">Başlık</label>
                   <input
                     type="text"
                     value={content.industries_title || ""}
                     onChange={(e) => setContent({ ...content, industries_title: e.target.value })}
                     className="input input-bordered w-full"
                     placeholder="Industries"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2">Industry Listesi (Her satıra bir industry)</label>
                   <textarea
                     value={content.industries_list || ""}
                     onChange={(e) => setContent({ ...content, industries_list: e.target.value })}
                     className="textarea textarea-bordered w-full h-48"
                     placeholder="Travel&#10;Sports & Fitness&#10;Media & Entertainment&#10;Beauty&#10;Gaming&#10;Food & Beverage&#10;Cyber&#10;Energy&#10;Banking & Finance&#10;Health & Wellness&#10;Apparel & Lifestyle&#10;Home Goods&#10;Emerging Technology&#10;Hospitality&#10;Automotive"
                   />
                   <p className="text-xs text-gray-500 mt-1">
                     Her satıra bir industry adı yazın. Örnek: Travel, Sports & Fitness, vb.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Görsel */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Görsel</h2>
          {content.image_path && (
            <div className="mb-4">
              <img
                src={`http://localhost:5000${content.image_path}`}
                alt="Mevcut görsel"
                className="w-64 h-48 object-cover rounded border"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {imageFile && (
            <p className="text-sm text-gray-600 mt-2">
              Yeni seçilen: {imageFile.name}
            </p>
          )}
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Kaydet"
          )}
        </button>
      </form>
    </div>
  );
}
