// pages/projects/index.tsx
"use client";

import { useEffect, useState } from "react";
import ProjectList from "../../components/projects/ProjectList";
import { Link } from 'react-router-dom';
import { api } from "../../utils/api";
import { Project } from "../../types/Project";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const { setBreadcrumbs, setIsLoading } = useBreadcrumb();

    useEffect(() => {
        // Breadcrumb'ı hemen ayarla
        setBreadcrumbs([
            { name: "Dashboard", to: "/admin/dashboard" },
            { name: "Projects" }
        ]);

        // Kısa loading göster
        setIsLoading(true);

        // API çağrısını yap - çok hızlı
        api.getProjects()
            .then((res) => {
                setProjects(res.data as Project[]);
                // Hemen loading'i kapat
                setTimeout(() => setIsLoading(false), 100);
            })
            .catch((err) => {
                console.error("API error:", err);
                setProjects([]);
                setIsLoading(false);
            });
    }, [setBreadcrumbs, setIsLoading]);

    return (
    <div className="p-4">
        <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link
            to="/admin/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Add New Project
        </Link>
        </div>

        <ProjectList projects={projects} setProjects={setProjects} />
    </div>
    );
}
