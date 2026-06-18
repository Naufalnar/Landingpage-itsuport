import React from "react";
import { Check, Info, HelpCircle } from "lucide-react";

interface PricingProps {
  onOpenConsultation: (service: string) => void;
}

export default function Pricing({ onOpenConsultation }: PricingProps) {
  return (
    <section className="py-20 bg-white border-b border-slate-200" id="harga">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title block */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-[#004ac6] font-sans font-bold text-xs uppercase tracking-widest block">
            Pricing Plans
          </span>
          <h2 className="font-sans font-bold text-3xl text-slate-900">
            Daftar Layanan &amp; Harga Transparan
          </h2>
        </div>

        {/* Pricing columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2" id="pricing-tiers-wrapper">
          {/* Segmen Personal */}
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl flex flex-col justify-between hover:border-[#004ac6] transition-all group" id="tier-personal">
            <div className="mb-8">
              <h3 className="font-sans font-bold text-xl text-slate-900 mb-1">
                Segmen Personal
              </h3>
              <p className="text-slate-500 font-sans text-xs">
                Solusi tepat untuk kebutuhan harian Anda.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1" id="personal-tier-list">
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Cleaning Hardware</span>
                <span className="font-sans font-bold text-sm text-[#004ac6]">150rb</span>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Install Ulang OS</span>
                <span className="font-sans font-bold text-sm text-[#004ac6]">100rb</span>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Paket Bundling</span>
                <span className="font-sans font-bold text-sm text-[#004ac6]">200rb</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenConsultation("Segmen Personal")}
              className="w-full py-3 rounded-lg border border-[#004ac6] text-[#004ac6] font-sans font-bold text-sm hover:bg-[#004ac6]/5 active:scale-98 transition-all cursor-pointer"
              id="personal-cta"
            >
              Pilih Layanan
            </button>
          </div>

          {/* Segmen UMKM (Terpopuler Featured Card) */}
          <div className="bg-slate-50 border-2 border-[#004ac6] p-8 rounded-xl flex flex-col justify-between relative shadow-xl transform md:scale-103 z-10" id="tier-umkm">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#004ac6] text-white px-4 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider">
              Terpopuler
            </div>

            <div className="mb-8">
              <h3 className="font-sans font-bold text-xl text-[#004ac6] mb-1">
                Segmen UMKM
              </h3>
              <p className="text-slate-500 font-sans text-xs">
                Mendukung pertumbuhan bisnis lokal.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1" id="umkm-tier-list">
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Audit &amp; Rekomendasi</span>
                <span className="font-sans font-bold text-sm text-[#004ac6]">500rb</span>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Pengadaan Perangkat</span>
                <span className="font-sans font-semibold text-sm text-[#004ac6] italic">Nego</span>
              </li>
              <li className="flex justify-between items-center py-2.5 border-b border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Maintenance Rutin</span>
                <span className="font-sans font-bold text-sm text-[#004ac6]">75rb/PC</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenConsultation("Segmen UMKM")}
              className="w-full py-3 rounded-lg bg-[#004ac6] text-white font-sans font-bold text-sm shadow-md hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
              id="umkm-cta"
            >
              Pilih Layanan
            </button>
          </div>

          {/* Segmen Enterprise */}
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl flex flex-col justify-between hover:border-[#004ac6] transition-all group" id="tier-enterprise">
            <div className="mb-8">
              <h3 className="font-sans font-bold text-xl text-slate-900 mb-1">
                Segmen Enterprise
              </h3>
              <p className="text-slate-500 font-sans text-xs">
                Infrastruktur IT skala besar &amp; kompleks.
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1" id="enterprise-tier-list">
              <li className="flex flex-col py-2 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm font-medium">Full IT Corporate Audit</span>
                  <span className="font-sans font-bold text-sm text-[#004ac6]">Mulai 2.5jt</span>
                </div>
              </li>
              <li className="flex flex-col py-2 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm font-medium">Pengadaan Massal</span>
                  <span className="font-sans font-semibold text-xs text-[#004ac6] italic">Custom Quote</span>
                </div>
              </li>
              <li className="flex items-center gap-2 py-2.5 text-slate-600 text-xs font-semibold">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />
                Dedicated Account Manager
              </li>
            </ul>

            <button
              onClick={() => onOpenConsultation("Segmen Enterprise")}
              className="w-full py-3 rounded-lg border border-[#004ac6] text-[#004ac6] font-sans font-bold text-sm hover:bg-[#004ac6]/5 active:scale-98 transition-all cursor-pointer"
              id="enterprise-cta"
            >
              Hubungi Kami
            </button>
          </div>
        </div>

        {/* Big CTA Pill below */}
        <div className="mt-16 text-center" id="pricing-consult-cta">
          <button
            onClick={() => onOpenConsultation("Konsultasi Umum")}
            className="inline-flex items-center gap-2.5 bg-blue-50 hover:bg-blue-100 text-[#004ac6] px-10 py-4.5 rounded-full font-sans font-bold text-md transition-all active:scale-95 border border-blue-200 hover:border-[#004ac6] shadow-sm cursor-pointer"
            id="pricing-pill-cta-button"
          >
            <HelpCircle className="w-5 h-5 animate-pulse text-[#004ac6]" />
            Konsultasi Gratis Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
