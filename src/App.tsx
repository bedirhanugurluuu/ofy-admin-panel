// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SessionManager from "./components/common/SessionManager";
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
import SliderListPage from "./pages/slider/index";
import SliderNewPage from "./pages/slider/new";
import SliderEditPage from "./pages/slider/edit";
import WhatWeDoPage from "./pages/whatWeDo";
import ContactPage from "./pages/contact";
import NewsList from "./pages/news/index";
import NewsForm from "./components/news/NewsForm";
import HeaderSettingsPage from "./pages/header";
import ServicesPage from "./pages/services/index";
import ServicesNewPage from "./pages/services/new";
import ServicesEditPage from "./pages/services/edit";
import AboutBannerPage from "./pages/about-banner";
import FooterPage from "./pages/footer";
import IPManagementPage from "./pages/ip-management";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BreadcrumbProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <SessionManager>
                  <MainLayout />
                </SessionManager>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/new" element={<ProjectsNewPage />} />
              <Route path="projects/edit/:id" element={<ProjectsEditPage />} />
              <Route path="intro-banners" element={<IntroBannersPage />} />
              <Route path="intro-banners/new" element={<IntroBannersNewPage />} />
              <Route path="intro-banners/edit/:id" element={<IntroBannersEditPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about-gallery" element={<AboutGalleryPage />} />
              <Route path="slider" element={<SliderListPage />} />
              <Route path="slider/new" element={<SliderNewPage />} />
              <Route path="slider/edit/:id" element={<SliderEditPage />} />
              <Route path="what-we-do" element={<WhatWeDoPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="news/edit/:id" element={<NewsForm />} />
              <Route path="news/new" element={<NewsForm />} />
              <Route path="news" element={<NewsList />} />
              <Route path="header" element={<HeaderSettingsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/new" element={<ServicesNewPage />} />
              <Route path="services/edit/:id" element={<ServicesEditPage />} />
              <Route path="about-banner" element={<AboutBannerPage />} />
              <Route path="footer" element={<FooterPage />} />
              <Route path="ip-management" element={<IPManagementPage />} />
            </Route>
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </BreadcrumbProvider>
      </AuthProvider>
    </Router>
  );
}
