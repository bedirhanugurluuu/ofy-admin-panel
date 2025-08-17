// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/projects/index";
import ProjectsNewPage from "./pages/projects/new";
import ProjectsEditPage from "./pages/projects/edit";
import IntroBannersPage from "./pages/intro-banners/index";
import IntroBannersNewPage from "./pages/intro-banners/new";
import IntroBannersEditPage from "./pages/intro-banners/edit";
import AboutPage from "./pages/about";
import AboutGalleryPage from "./pages/aboutGallery";
import AwardsListPage from "./pages/awards/index";
import AwardsNewPage from "./pages/awards/new";
import AwardsEditPage from "./pages/awards/edit";
import SliderListPage from "./pages/slider/index";
import SliderNewPage from "./pages/slider/new";
import SliderEditPage from "./pages/slider/edit";
import WhatWeDoPage from "./pages/whatWeDo";
import ContactPage from "./pages/contact";
import NewsList from "./pages/news/index";
import NewsForm from "./components/news/NewsForm";
import axiosInstance, { setCsrfToken } from "./utils/axiosInstance";

export default function App() {
  useEffect(() => {
    axiosInstance.get<{ csrfToken: string }>("/api/csrf-token", { withCredentials: true })
      .then(res => {
        setCsrfToken(res.data.csrfToken); // utils/axiosInstance içinde bu fonksiyon token'ı ayarlıyor
      })
      .catch(err => {
        console.error("CSRF token alınırken hata:", err);
      });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <BreadcrumbProvider>
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/new" element={<ProjectsNewPage />} />
              <Route path="projects/edit/:id" element={<ProjectsEditPage />} />
              <Route path="intro-banners" element={<IntroBannersPage />} />
              <Route path="intro-banners/new" element={<IntroBannersNewPage />} />
              <Route path="intro-banners/edit/:id" element={<IntroBannersEditPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about-gallery" element={<AboutGalleryPage />} />
              <Route path="awards" element={<AwardsListPage />} />
              <Route path="awards/new" element={<AwardsNewPage />} />
              <Route path="awards/edit/:id" element={<AwardsEditPage />} />
                                    <Route path="slider" element={<SliderListPage />} />
                      <Route path="slider/new" element={<SliderNewPage />} />
                      <Route path="slider/edit/:id" element={<SliderEditPage />} />
                                            <Route path="what-we-do" element={<WhatWeDoPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="news/edit/:id" element={<NewsForm />} />
              <Route path="news/new" element={<NewsForm />} />
              <Route path="news" element={<NewsList />} />
            </Route>
          </Routes>
        </BreadcrumbProvider>
      </AuthProvider>
    </Router>
  );
}
