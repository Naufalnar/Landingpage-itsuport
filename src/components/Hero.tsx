import React from "react";
import { Zap, Server, ChevronRight, Sparkles } from "lucide-react";

interface HeroProps {
  onOpenConsultation: (service?: string) => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const handleScrollToServices = () => {
    const element = document.getElementById("layanan");
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

  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-24" id="home">
      {/* Visual background gradient decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-[#004ac6]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative">
        {/* Left Copy Column */}
        <div className="space-y-6" id="hero-left">
          <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-5.5xl text-slate-900 tracking-tight leading-tight">
            Solusi IT Profesional &amp; <span className="text-[#004ac6] relative inline-block decoration-wavy">Terpercaya</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            Kami menghadirkan layanan dukungan teknologi dengan kecepatan maksimal dan transparansi biaya untuk kebutuhan personal hingga korporasi skala besar.
          </p>
          <div className="pt-4 flex flex-wrap gap-4" id="hero-actions">
            <button
              onClick={() => onOpenConsultation("Konsultasi Umum")}
              className="bg-[#004ac6] hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-sans font-semibold text-base shadow-lg shadow-blue-600/10 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-600/20 active:translate-y-0 transition-all cursor-pointer"
              id="hero-primary-button"
            >
              Konsultasi Gratis
            </button>
            <button
              onClick={handleScrollToServices}
              className="border border-slate-300 text-slate-700 hover:text-[#004ac6] hover:border-[#004ac6] hover:bg-slate-100 bg-white px-8 py-4 rounded-lg font-sans font-semibold text-base hover:translate-y-[-2px] active:translate-y-0 transition-all cursor-pointer"
              id="hero-secondary-button"
            >
              Lihat Layanan
            </button>
          </div>
        </div>

        {/* Right Graphic Column */}
        <div className="relative w-full" id="hero-right">
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 relative group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL269MlAfk-e-9WmnXFtnDGY5AESsOHbuo9CuMnPXIR95cIcpbq2PGO_sezMe4iK4U-WRZw3p1SX1JxpmRkf2fBaJfaibzjefNCUl8oA-Yx4CGY29iLNO84wLTd9X8ONeUjSJcShjLyrdhYo87aa8p3w6e8z2PkAP7tO4mUIo0OK9hK8MBCm3zJxhkXZeEq1illEcJNnwuQweCIkWUIB1v9N2oZv--uzGCWbL-XLP7ybzWh2pk1rm__BwzgKTGtzFjrQEgnj0gj8A"
              alt="IT Support Hub Modern Server Room Environment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              id="hero-room-image"
            />
          </div>

          {/* Floating 'Respon Cepat' Badge */}
          <div 
            className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg border border-slate-200 hidden lg:flex items-center gap-3 animate-bounce-slow cursor-pointer hover:bg-slate-50 transition" 
            onClick={() => onOpenConsultation("Respon Cepat 30 Menit")}
            id="floating-response-badge"
          >
            <div className="w-10 h-10 bg-blue-50 text-[#004ac6] rounded-full flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-[#004ac6]" />
            </div>
            <div>
              <div className="font-sans font-bold text-sm text-slate-800 leading-tight">Respon Cepat</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">Kurang dari 30 menit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
