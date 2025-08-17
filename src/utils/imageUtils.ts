const BASE = "http://localhost:5000";

// Görsel URL'lerini backend base URL ile birleştiren utility fonksiyonu
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  let p = imagePath.trim();
  if (!p) return "";

  // http veya data URL ise direkt döndür
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;

  // Windows backslash -> forward slash
  p = p.replace(/\\/g, "/");

  // Başta tekrarlı uploads öneklerini tekilleştir (uploads/ ... bir veya daha fazla tekrar)
  p = p.replace(/^\/?(?:uploads\/)+/, "/uploads/");

  // Eğer hala /uploads/ ile başlamıyorsa ekle
  if (!p.startsWith("/uploads/")) {
    // Baştaki / işaretlerini kırpıp /uploads/ ekle
    p = "/uploads/" + p.replace(/^\/+/, "");
  }

  return `${BASE}${p}`;
};

// Fallback görsel URL'i
export const getFallbackImageUrl = (): string => {
  return "/placeholder-image.jpg";
};

// Görsel URL'inin geçerli olup olmadığını kontrol eden fonksiyon
export const isValidImageUrl = (imagePath: string): boolean => {
  return !!(imagePath && imagePath.trim() !== "");
};
