import React from "react";
import { Share2, ArrowUp, Database, Calendar } from "lucide-react";

interface FooterProps {
  onOpenConsultation: (service?: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenConsultation, onOpenAdmin }: FooterProps) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: "IT Support Hub",
        text: "Layanan infrastruktur dan solusi IT terpercaya untuk Anda.",
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Tautan aplikasi telah disalin ke clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 py-16 text-slate-600 font-sans" id="footer-section">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12" id="footer-columns">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-sans font-bold text-2xl text-[#004ac6]">
              IT Support Hub
            </h3>
            <p className="text-slate-500 font-sans text-sm leading-relaxed max-w-sm">
              Penyedia layanan infrastruktur dan dukungan IT terintegrasi dengan standar kualitas tinggi untuk efisiensi operasional bisnis Anda.
            </p>
          </div>

          {/* Links 1: Perusahaan */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#layanan" className="hover:text-[#004ac6] transition">Tentang Kami</a>
              </li>
              <li>
                <button onClick={() => onOpenConsultation("Hubungi Kami")} className="hover:text-[#004ac6] text-left transition cursor-pointer">Kontak Kami</button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-left text-slate-500 hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer">
                  <Database className="w-3.5 h-3.5" /> Konfigurasi Neon DB
                </button>
              </li>
            </ul>
          </div>

          {/* Links 2: Layanan */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
              Layanan
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#harga" className="hover:text-[#004ac6] transition">Daftar Harga</a>
              </li>
              <li>
                <button onClick={() => onOpenConsultation("Konsultasi Umum")} className="hover:text-[#004ac6] text-left transition cursor-pointer">Konsultasi Gratis</button>
              </li>
              {/* Share button */}
              <li>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#004ac6] text-left transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#004ac6]" /> Bagikan Tautan
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright list */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-xs text-slate-400 font-medium">
          <p>© 2024 IT Support Hub. Solusi Teknologi Terpercaya. Di-deploy lewat Vercel.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-[#004ac6] underline transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#004ac6] underline transition">Terms of Service</a>
            <button
              onClick={scrollTop}
              className="inline-flex items-center gap-1 hover:text-[#004ac6] transition cursor-pointer focus:outline-hidden"
              title="Scroll ke atas"
            >
              Kembali ke Atas <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
