// src/pages/dashboard.tsx
import { useEffect } from "react";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";

const Dashboard = () => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    // Breadcrumb'ı hemen ayarla - loading yok çünkü API çağrısı yok
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="bg-base-100 p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">Admin Paneline Hoş Geldiniz 👋</h1>
      <p className="text-base-content/70">
        Buradan projelerinizi, banner'larınızı ve site içeriklerinizi kolayca yönetebilirsiniz.
      </p>
    </div>
  );
};

export default Dashboard;
