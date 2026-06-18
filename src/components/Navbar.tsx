import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

interface NavbarProps {
  onOpenConsultation: (service?: string) => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenConsultation, onOpenAdmin }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("layanan");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      
      const hargaElement = document.getElementById("harga");
      const timElement = document.getElementById("tim");

      if (timElement && scrollPos >= timElement.offsetTop) {
        setActiveSection("tim");
      } else if (hargaElement && scrollPos >= hargaElement.offsetTop) {
        setActiveSection("harga");
      } else {
        setActiveSection("layanan");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 h-18 flex justify-between items-center">
        {/* Brand */}
        <button 
          onClick={() => {
            setActiveSection("layanan");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-sans font-bold text-2xl text-[#004ac6] hover:opacity-90 transition-opacity cursor-pointer focus:outline-hidden"
          id="nav-logo-button"
        >
          IT Support Hub
        </button>

        {/* Links */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => scrollToSection("tim")}
            className={`font-sans font-semibold text-sm pb-1 transition-all focus:outline-hidden cursor-pointer ${
              activeSection === "tim"
                ? "text-[#004ac6] border-b-2 border-[#004ac6]"
                : "text-slate-500 hover:text-[#004ac6] hover:border-b-2 hover:border-[#004ac6] border-b-2 border-transparent"
            }`}
            id="nav-layanan-link"
          >
            Layanan
          </button>
          <button
            onClick={() => scrollToSection("harga")}
            className={`font-sans font-semibold text-sm pb-1 transition-all focus:outline-hidden cursor-pointer ${
              activeSection === "harga"
                ? "text-[#004ac6] border-b-2 border-[#004ac6]"
                : "text-slate-500 hover:text-[#004ac6] hover:border-b-2 hover:border-[#004ac6] border-b-2 border-transparent"
            }`}
            id="nav-harga-link"
          >
            Harga
          </button>
          <button
            onClick={() => scrollToSection("tim")}
            className={`font-sans font-semibold text-sm pb-1 transition-all focus:outline-hidden cursor-pointer ${
              activeSection === "tim"
                ? "text-[#004ac6] border-b-2 border-[#004ac6]"
                : "text-slate-500 hover:text-[#004ac6] hover:border-b-2 hover:border-[#004ac6] border-b-2 border-transparent"
            }`}
            id="nav-tim-link"
          >
            Tim
          </button>
          <button
            onClick={onOpenAdmin}
            className="font-sans font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md transition focus:outline-hidden cursor-pointer"
            id="nav-admin-link"
          >
            Admin Panel
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onOpenConsultation("Konsultasi Umum")}
          className="bg-[#004ac6] hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-sans font-semibold text-sm hover:shadow-md transition-all active:scale-95 focus:outline-hidden cursor-pointer"
          id="nav-consultation-button"
        >
          Konsultasi Gratis
        </button>
      </div>
    </nav>
  );
}
