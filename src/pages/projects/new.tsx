import { useEffect } from "react";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";
import ProjectForm from "../../components/projects/ProjectForm";

export default function ProjectsNewPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Projects", to: "/admin/projects" },
      { name: "New Project" }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Yeni Proje Ekle</h1>
      <ProjectForm mode="new" />
    </div>
  );
}
