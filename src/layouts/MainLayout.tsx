// src/layouts/MainLayout.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import { LogOut, Home, Image, Folder, User, FileText, Award, Sliders, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import Breadcrumb from "../components/common/Breadcrumb";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function MainLayout() {
  const { logout } = useAuth();
  const { breadcrumbs, isLoading } = useBreadcrumb();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  // Hakkımızda sayfalarından birindeyse dropdown'ı açık tut
  const isAboutPage = breadcrumbs.some(breadcrumb =>
    breadcrumb.name === 'Hakkımızda' ||
    breadcrumb.name === 'About Gallery' ||
    breadcrumb.name === 'Awards' ||
    breadcrumb.name === 'Slider' ||
    breadcrumb.name === 'What We Do'
  );

  // Eğer hakkımızda sayfasındaysa ve dropdown kapalıysa aç
  React.useEffect(() => {
    if (isAboutPage && !aboutDropdownOpen) {
      setAboutDropdownOpen(true);
    }
  }, [isAboutPage, aboutDropdownOpen]);

  const menuItems = [
    { name: "Ana Sayfa", path: "/admin/dashboard", icon: <Home size={18} /> },
    { name: "Giriş Bannerları", path: "/admin/intro-banners", icon: <Image size={18} /> },
                { name: "Projeler", path: "/admin/projects", icon: <Folder size={18} /> },
            { name: "Haberler", path: "/admin/news", icon: <FileText size={18} /> },
            { name: "Contact", path: "/admin/contact", icon: <FileText size={18} /> },
  ];

  const aboutSubmenuItems = [
    { name: "Genel Bilgiler", path: "/admin/about", icon: <User size={16} /> },
    { name: "About Gallery", path: "/admin/about-gallery", icon: <Image size={16} /> },
    { name: "Awards", path: "/admin/awards", icon: <Award size={16} /> },
    { name: "Slider", path: "/admin/slider", icon: <Sliders size={16} /> },
    { name: "What We Do", path: "/admin/what-we-do", icon: <FileText size={16} /> },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Çıkış yapmak istediğine emin misin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, çıkış yap",
      cancelButtonText: "İptal"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-[100vh] w-64 bg-base-100 shadow-lg z-40 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
      >
        <div className="p-4 border-b border-base-300 flex justify-between items-center md:hidden">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>

        {/* Menü alanı - flex-grow ile büyüsün */}
        <nav className="flex-1 overflow-y-auto px-4 md:px-2">
          <ul className="menu w-full">
            {menuItems.map(({ name, path, icon }) => (
              <li className="mb-2" key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 ${isActive ? "active bg-primary text-primary-content rounded-lg" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {icon}
                  {name}
                </NavLink>
              </li>
            ))}

            {/* Hakkımızda Dropdown */}
            <li className="mb-2">
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`flex items-center justify-between w-full rounded-lg transition-colors ${
                  aboutDropdownOpen ? "bg-primary text-primary-content" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} />
                  Hakkımızda
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    aboutDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {aboutDropdownOpen && (
                <ul className="mt-2 ml-4 space-y-1">
                  {aboutSubmenuItems.map(({ name, path, icon }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isActive 
                              ? "bg-primary text-primary-content" 
                              : "hover:bg-base-300"
                          }`
                        }
                        onClick={() => {
                          setSidebarOpen(false);
                        }}
                      >
                        {icon}
                        {name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Çıkış butonu - en alta sabit */}
        <div className="px-4 py-4 border-t border-base-300">
          <button
            onClick={handleLogout}
            className="btn btn-error w-full flex items-center gap-2"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>


      {/* Overlay mobil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="navbar bg-base-100 shadow px-6">
          <div className="flex-none md:hidden">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <div className="flex-none">
            <label className="swap swap-rotate">
              <input type="checkbox" className="theme-controller" value="dark" />
              <svg className="swap-off fill-current w-6 h-6" viewBox="0 0 24 24">
                <path d="M5.64 17.657L4.22 19.07 5.64 20.485 7.05 19.07 5.64 17.657zM11 4V2h2v2h-2zm6.364 13.657L19.07 19.07 20.485 17.657 19.07 16.243 17.364 17.657zM11 22v-2h2v2h-2zM4.222 4.222L5.636 5.636 4.222 7.05 2.808 5.636 4.222 4.222zM17.657 6.364L19.07 4.95 20.485 6.364 19.07 7.778 17.657 6.364zM12 6a6 6 0 000 12 6 6 0 000-12z" />
              </svg>
              <svg className="swap-on fill-current w-6 h-6" viewBox="0 0 24 24">
                <path d="M21.64 13.64A9 9 0 1110.36 2.36 7 7 0 0021.64 13.64z" />
              </svg>
            </label>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto relative bg-base-200">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && <Breadcrumb paths={breadcrumbs} />}
          
          {/* Sayfa içeriği her zaman render edilir */}
          <div className={isLoading ? "opacity-30 pointer-events-none transition-opacity duration-200" : "transition-opacity duration-200"}>
            <Outlet />
          </div>
          
          {/* Loading overlay - daisyUI tema rengine uygun */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-80 z-10 backdrop-blur-sm">
              <LoadingSpinner />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
