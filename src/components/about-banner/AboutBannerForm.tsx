import React, { useState, useEffect } from "react";
import { FormLayout } from "../common/PageLayout";
import { FormInput, FormButton, FormActions } from "../common/FormComponents";
import { AboutBanner } from "../../config/supabase";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";

interface AboutBannerFormProps {
  banner: Partial<AboutBanner>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitText?: string;
  isLoading?: boolean;
}

export default function AboutBannerForm({
  banner,
  onChange,
  onFileChange,
  onSubmit,
  submitText = "Kaydet",
  isLoading = false,
}: AboutBannerFormProps) {
  return (
    <FormLayout title="About Banner Ayarları" showBackButton={false}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        {/* Resim Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Resmi *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            Desteklenen formatlar: JPEG, PNG, WebP (Maksimum 5MB)
          </p>
          
          {/* Mevcut resim gösterimi */}
          {banner.image && !banner.image.startsWith("blob:") && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Mevcut Resim:</p>
              <img 
                src={getImageUrl(banner.image)} 
                alt="Mevcut Banner" 
                className="max-h-40 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.src = getFallbackImageUrl();
                }}
              />
            </div>
          )}
        </div>

        {/* Desktop Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desktop Başlık *
          </label>
          <input
            name="title_desktop"
            value={banner.title_desktop || ""}
            onChange={onChange}
            placeholder="Desktop için başlık metni..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mobile Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Başlık *
          </label>
          <input
            name="title_mobile"
            value={banner.title_mobile || ""}
            onChange={onChange}
            placeholder="Mobile için başlık metni..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buton Metni */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buton Metni *
          </label>
          <input
            name="button_text"
            value={banner.button_text || ""}
            onChange={onChange}
            placeholder="Örn: ABOUT US"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buton Linki */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buton Linki *
          </label>
          <input
            name="button_link"
            value={banner.button_link || ""}
            onChange={onChange}
            placeholder="Örn: /about"
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
