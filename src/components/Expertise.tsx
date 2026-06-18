import React from "react";
import { ClipboardCheck, ShoppingCart, Wrench, Terminal, CheckCircle2 } from "lucide-react";

interface ExpertiseProps {
  onOpenConsultation: (service: string) => void;
}

export default function Expertise({ onOpenConsultation }: ExpertiseProps) {
  const expertises = [
    {
      title: "Tim Audit & Konsultasi",
      icon: <ClipboardCheck className="w-7 h-7 text-[#004ac6]" />,
      items: ["Software License Audit", "Hardware Assessment", "IT Consultation"],
    },
    {
      title: "Tim Procurement",
      icon: <ShoppingCart className="w-7 h-7 text-[#004ac6]" />,
      items: ["Hardware Sourcing", "Budget Optimization", "Delivery & Setup"],
    },
    {
      title: "Tim Technical Support",
      icon: <Wrench className="w-7 h-7 text-[#004ac6]" />,
      items: ["Deep Cleaning", "Thermal Paste Refresh", "Hardware Fixing"],
    },
    {
      title: "Tim OS Specialist",
      icon: <Terminal className="w-7 h-7 text-[#004ac6]" />,
      items: ["Windows Setup Specialist", "Linux Deployment", "Driver Configuration"],
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200" id="tim">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header Block with Grid Flex */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6" id="expertise-header">
          <div className="space-y-2">
            <span className="text-[#004ac6] font-sans font-bold text-xs uppercase tracking-widest block">
              Expertise
            </span>
            <h2 className="font-sans font-bold text-3xl text-slate-900" id="expertise-title">
              Tim Spesialis Kami
            </h2>
          </div>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed max-w-lg" id="expertise-desc">
            Digerakkan oleh para ahli bersertifikat yang siap menangani setiap tantangan teknologi dengan presisi tinggi.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8" id="expertise-grid">
          {expertises.map((exp, idx) => (
            <div
              key={idx}
              onClick={() => onOpenConsultation(exp.title)}
              className="group bg-white p-8 rounded-xl border border-slate-200 hover:border-[#004ac6] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              id={`expertise-card-${idx}`}
            >
              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:from-[#004ac6] group-hover:to-blue-700 group-hover:text-white transition-all duration-300">
                  <div className="group-hover:scale-110 group-hover:text-white text-[#004ac6] transition-all">
                    {exp.icon}
                  </div>
                </div>

                <h3 className="font-sans font-bold text-xl text-slate-900 mb-4 group-hover:text-[#004ac6] transition-colors">
                  {exp.title}
                </h3>

                <ul className="space-y-3.5 mb-6">
                  {exp.items.map((item, idy) => (
                    <li key={idy} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#004ac6] shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Little interactive select text */}
              <div className="text-xs font-semibold text-[#004ac6] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 self-end">
                Pilih Tim Ini untuk Konsultasi &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
