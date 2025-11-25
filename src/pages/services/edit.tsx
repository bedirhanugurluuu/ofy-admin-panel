import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceForm from "../../components/services/ServiceForm";
import { updateService, fetchServices, Service } from "../../config/supabase";
import Swal from "sweetalert2";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Partial<Service>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setBreadcrumbs, setIsLoading: setGlobalLoading } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Services", to: "/admin/services" },
      { name: "Edit Service" }
    ]);
  }, [setBreadcrumbs]);

  // Service verisini çek
  useEffect(() => {
    if (!id) return;

    setGlobalLoading(true);
    fetchServices()
      .then((services) => {
        const foundService = services.find(s => s.id === id);
        if (foundService) {
          setService(foundService);
        } else {
          setError('Service bulunamadı');
        }
        setGlobalLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setGlobalLoading(false);
      });
  }, [id, setGlobalLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService(prev => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async () => {
    if (!service.title?.trim() || !service.description?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Uyarı!",
        text: "Lütfen tüm alanları doldurun!",
      });
      return;
    }

    if (!id) return;

    setIsLoading(true);

    try {
      const result = await updateService(id, service);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Service başarıyla güncellendi",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/admin/services");
      }
    } catch (err: any) {
      console.error("Service güncelleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: err.message || "Güncelleme sırasında hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/services")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <ServiceForm
      service={service}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitText="Güncelle"
      isLoading={isLoading}
      mode="edit"
    />
  );
}
