import React from "react";
import { ArrowUp, Database } from "lucide-react";

interface FooterProps {
  onOpenConsultation: (service?: string) => void;
}

export default function Footer({ onOpenConsultation }: FooterProps) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 text-xs font-sans" id="footer-section">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left branding and basic socials */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <span className="font-sans font-bold text-base text-[#004ac6]">
            IT Support Hub
          </span>
          <div className="flex gap-4 text-slate-400 font-medium">
            <a href="#" className="hover:text-[#004ac6] transition">Facebook</a>
            <a href="#" className="hover:text-[#004ac6] transition">LinkedIn</a>
            <a href="#" className="hover:text-[#004ac6] transition">Twitter</a>
          </div>
        </div>
        
        {/* Right copyright, legals and db link */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center text-slate-400 font-medium">
          <span>© 2024 IT Support Hub. Seluruh hak cipta dilindungi.</span>
          <span className="hidden md:inline text-slate-200">|</span>
          <a href="#" className="hover:text-[#004ac6] underline transition">Privacy Policy</a>
          <a href="#" className="hover:text-[#004ac6] underline transition">Terms of Service</a>
          
          <span className="hidden md:inline text-slate-200">|</span>
          <button 
            onClick={() => onOpenConsultation("Hubungi Kami")} 
            className="hover:text-[#004ac6] transition font-bold text-slate-500 cursor-pointer"
          >
            Konsultasi Gratis
          </button>

          <button
            onClick={scrollTop}
            className="text-slate-400 hover:text-[#004ac6] transition flex items-center gap-0.5 ml-2 cursor-pointer"
            title="Scroll ke atas"
          >
            Top <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
