import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "../../components/services/ServiceForm";
import { createService, fetchServices, Service } from "../../config/supabase";
import Swal from "sweetalert2";
import { useBreadcrumb } from "../../contexts/BreadcrumbContext";

export default function NewServicePage() {
  const [service, setService] = useState<Partial<Service>>({
    title: "",
    description: "",
    order_index: 1,
  });

  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Dashboard", to: "/admin/dashboard" },
      { name: "Services", to: "/admin/services" },
      { name: "New Service" }
    ]);
    loadServices();
  }, [setBreadcrumbs]);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Services yükleme hatası:", error);
    }
  };

  useEffect(() => {
    const nextIndex = services.length + 1;
    setService(prev => ({ ...prev, order_index: nextIndex }));
  }, [services]);

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
        title: "Uyarı",
        text: "Lütfen tüm alanları doldurun!",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createService(service);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: "Service başarıyla eklendi",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/admin/services");
      }
    } catch (err: any) {
      console.error("Service ekleme hatası:", err);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: err.message || "Service eklenirken hata oluştu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ServiceForm
      service={service}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      mode="new"
    />
  );
}
