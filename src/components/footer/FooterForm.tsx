import React, { useState } from "react";
import { FormLayout } from "../common/PageLayout";
import { FormButton, FormActions } from "../common/FormComponents";
import { Footer } from "../../config/supabase";

interface FooterFormProps {
  footer: Partial<Footer>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSitemapChange: (items: Array<{ name: string; link: string }>) => void;
  onSocialChange: (items: Array<{ name: string; link: string }>) => void;
  onSubmit: () => void;
  submitText?: string;
  isLoading?: boolean;
}

export default function FooterForm({
  footer,
  onChange,
  onSitemapChange,
  onSocialChange,
  onSubmit,
  submitText = "Kaydet",
  isLoading = false,
}: FooterFormProps) {
  const [newSitemapName, setNewSitemapName] = useState("");
  const [newSitemapLink, setNewSitemapLink] = useState("");
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialLink, setNewSocialLink] = useState("");

  const addSitemapItem = () => {
    if (newSitemapName.trim() && newSitemapLink.trim()) {
      onSitemapChange([...footer.sitemap_items || [], { name: newSitemapName.trim(), link: newSitemapLink.trim() }]);
      setNewSitemapName("");
      setNewSitemapLink("");
    }
  };

  const removeSitemapItem = (index: number) => {
    const updatedItems = footer.sitemap_items?.filter((_, i) => i !== index) || [];
    onSitemapChange(updatedItems);
  };

  const addSocialItem = () => {
    if (newSocialName.trim() && newSocialLink.trim()) {
      onSocialChange([...footer.social_items || [], { name: newSocialName.trim(), link: newSocialLink.trim() }]);
      setNewSocialName("");
      setNewSocialLink("");
    }
  };

  const removeSocialItem = (index: number) => {
    const updatedItems = footer.social_items?.filter((_, i) => i !== index) || [];
    onSocialChange(updatedItems);
  };

  return (
    <FormLayout title="Footer Ayarları" showBackButton={false}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        {/* CTA Başlık */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Başlık *
          </label>
          <input
            name="cta_title"
            value={footer.cta_title || ""}
            onChange={onChange}
            placeholder="Örn: Interested in working with us?"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CTA Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Link *
          </label>
          <input
            name="cta_link"
            value={footer.cta_link || ""}
            onChange={onChange}
            placeholder="Örn: /contact"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sitemap Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sitemap Öğeleri
          </label>
          <div className="space-y-2">
            {footer.sitemap_items?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded border" style={{ backgroundColor: '#3b3b3b', color: 'white' }}>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs opacity-70">{item.link}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSitemapItem(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSitemapName}
                onChange={(e) => setNewSitemapName(e.target.value)}
                placeholder="Sitemap adı..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newSitemapLink}
                onChange={(e) => setNewSitemapLink(e.target.value)}
                placeholder="Sitemap linki..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addSitemapItem}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sitemap Ekle
            </button>
          </div>
        </div>

        {/* Social Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sosyal Medya Öğeleri
          </label>
          <div className="space-y-2">
            {footer.social_items?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded border" style={{ backgroundColor: '#3b3b3b', color: 'white' }}>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs opacity-70">{item.link}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialItem(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSocialName}
                onChange={(e) => setNewSocialName(e.target.value)}
                placeholder="Sosyal medya adı..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
                placeholder="Sosyal medya linki..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addSocialItem}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sosyal Medya Ekle
            </button>
          </div>
        </div>

        {/* Copyright Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Copyright Metni *
          </label>
          <input
            name="copyright_text"
            value={footer.copyright_text || ""}
            onChange={onChange}
            placeholder="Örn: © 2025 Ömer Faruk Yılmaz. Tüm hakları saklıdır."
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
