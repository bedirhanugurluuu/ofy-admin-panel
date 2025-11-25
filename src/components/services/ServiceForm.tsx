import React from "react";
import { FormLayout } from "../common/PageLayout";
import { FormInput, FormButton, FormActions } from "../common/FormComponents";
import { Service } from "../../config/supabase";

interface ServiceFormProps {
  service: Partial<Service>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitText?: string;
  isLoading?: boolean;
  mode?: "new" | "edit";
}

export default function ServiceForm({
  service,
  onChange,
  onSubmit,
  submitText = "Kaydet",
  isLoading = false,
  mode = "edit",
}: ServiceFormProps) {
  return (
    <FormLayout title={mode === "new" ? "Yeni Service Ekle" : "Service Düzenle"} showBackButton={false}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık *
          </label>
          <input
            name="title"
            value={service.title || ""}
            onChange={onChange}
            placeholder="Örn: Strategy"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama *
          </label>
          <textarea
            name="description"
            value={service.description || ""}
            onChange={onChange}
            placeholder="Service açıklaması..."
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sıra *
          </label>
          <input
            name="order_index"
            type="number"
            value={service.order_index || 1}
            onChange={onChange}
            placeholder="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <FormActions>
          <FormButton
            type="submit"
            loading={isLoading}
            loadingText="Kaydediliyor..."
          >
            {submitText}
          </FormButton>
        </FormActions>
      </form>
    </FormLayout>
  );
}
