import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl, getFallbackImageUrl } from "../../utils/imageUtils";

interface Banner {
  id: number;
  image: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

interface Props {
  banners: Banner[];
  onDelete: (id: number) => void;
}

export default function BannerList({ banners, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <ul className="space-y-6">
      {banners
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((b) => (
          <li
            key={b.id}
            className="card bg-base-100 shadow hover:shadow-lg transition cursor-pointer flex flex-col md:flex-row justify-between items-center p-4"
          >
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <img 
                src={getImageUrl(b.image)} 
                alt={b.title_line1} 
                className="w-20 h-14 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = getFallbackImageUrl();
                }}
              />

              <div>
                <p className="font-bold text-lg">
                  {b.order_index}. {b.title_line1} / {b.title_line2}
                </p>
                <small className="text-gray-500 block">
                  {b.button_text} → <a href={b.button_link} target="_blank" rel="noreferrer" className="text-primary underline">{b.button_link}</a>
                </small>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => navigate(`/admin/intro-banners/edit/${b.id}`)}
              >
                Düzenle
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => onDelete(b.id)}
              >
                Sil
              </button>
            </div>
          </li>
      ))}
    </ul>
  );
}
