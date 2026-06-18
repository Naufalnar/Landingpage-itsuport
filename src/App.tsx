import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Expertise from "./components/Expertise";
import ConsultationDrawer from "./components/ConsultationDrawer";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { MessageSquare, Settings, Database, ArrowRight } from "lucide-react";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Konsultasi Umum");

  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    } else {
      setSelectedService("Konsultasi Umum");
    }
    setDrawerOpen(true);
  };

  const handleConsultationSuccess = () => {
    // Optional additional triggers
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between" id="app-root-container">
      {/* Top Main Navigation Bar */}
      <Navbar
        onOpenConsultation={handleOpenConsultation}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1 pt-18">
        {/* Hero Banner Section */}
        <Hero onOpenConsultation={handleOpenConsultation} />

        {/* Pricing & Offers Sections */}
        <Pricing onOpenConsultation={handleOpenConsultation} />

        {/* Service Divisions & Expert Members */}
        <Expertise onOpenConsultation={handleOpenConsultation} />
      </main>

      {/* Structured Informational Footer */}
      <Footer
        onOpenConsultation={handleOpenConsultation}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Interactive Slid-over Consultation Form */}
      <ConsultationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedService={selectedService}
        onSuccess={handleConsultationSuccess}
      />

      {/* Interactive Admin SQL Diagnostics Dashboard & Leads Panel */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* Floating Action Button (FAB) Bottom Right */}
      <button
        onClick={() => handleOpenConsultation("Konsultasi Umum")}
        className="fixed bottom-6 right-6 z-30 bg-[#004ac6] hover:bg-blue-700 text-white p-4.5 rounded-full shadow-2xl flex items-center gap-2 group hover:scale-105 active:scale-95 transition-all outline-hidden cursor-pointer"
        id="floating-fab-button"
        title="Buka Konsultasi"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap font-sans font-bold text-sm text-white">
          Konsultasi Gratis
        </span>
      </button>

      {/* Admin Panel Floating Trigger Button (Bottom Left) */}
      <button
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-6 left-6 z-30 bg-slate-800 hover:bg-slate-900 text-slate-300 p-2.5 rounded-xl shadow-lg hover:text-white transition-all outline-hidden cursor-pointer border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
        id="admin-floating-fab"
        title="Buka Pengaturan Database"
      >
        <Database className="w-4 h-4 text-indigo-400" />
        <span className="hidden sm:inline">Check Neon DB</span>
      </button>
    </div>
  );
}
