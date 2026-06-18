import React from "react";
import { Mail, Link2, Share2, Camera, Code } from "lucide-react";

interface ExpertiseProps {
  onOpenConsultation: (service: string) => void;
}

export default function Expertise({ onOpenConsultation }: ExpertiseProps) {
  const teamMembers = [
    {
      name: "Sarah Adeline",
      role: "Team Audit & Konsultasi",
      email: "sarah.a@itsupporthub.com",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8rb_oKOmaXBddZhDC8JXYDOXzuz6B3Z22b-EIP60GRxpWdyrBNPJb2qr-YhR-yTLtuz8eBfh_xYYmJgwzGTL5U1HKC82xGms-e1fEwToWq9JTM3DCqzLdNthgHQlT87DJyyDtezYyu8owPSIzqTmgiRwIs9bQxgv0Afgk9waiSpHH8wCdG9tJJd5X7ZJAdFyFpWwl7RAhu3aGg4JTcqlt8sLxj0nI5tX7ujlxttJ-IOC8uCpZV6RjNCuRCug8y6Vki2Rhd0hfMYA",
      actions: ["link", "share"]
    },
    {
      name: "Budi Santoso",
      role: "Team Procurement",
      email: "budi.s@itsupporthub.com",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA60EuWZTQ2rh9xLmUpsi3JGXkpwiXJmRpp_GmK5OWVocCYzEgfHjCrTZoVSKPSVQ_1XxcX6HYMJELQ3MSd_ggD96d9Egv9ypmfkS8D8IgLndloA2WtKUPgQ8kO9bQ3eUwoNZ1n8etnfApQ9nUYagxg6nzF_xqVIbLQl4ekmJrlUxgGAdk7HZD-3EXz6Jw3R4RDa2yR-SlMiXghziMhS5_VWICd1f-LT2-noa1A2rdaq20FQlGgtvHJhbx_JJdthL0q06L9cq-RGa4",
      actions: ["link"]
    },
    {
      name: "Dina Lestari",
      role: "Team Technical Support",
      email: "dina.l@itsupporthub.com",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLXC2117sZfk32PStfnuATIwrTfctovA7M5kIHZpIFo5MzrdRvj2Vd3VluNf_24LGNALnM-YPCmngvx6WbNg_Qviplec0twmb8ek2jsmRZ5fTRI_NuX2oFYnGlugeDyQwwqZkeQrTkyxpU5l9L4tq2sr2wJzfC3FCTkHs98CG0s7QbSZRxCYAkM3eG4RfVYhEJDNxAvZ7ziosgRjpXHphepSjIJHi_ctZOlSt8w_xP65QXFpzCNUboGRE9cIXAVY8bOqMc6Pei7QM",
      actions: ["link", "camera"]
    },
    {
      name: "Rizky Pratama",
      role: "Team OS Specialist",
      email: "rizky.p@itsupporthub.com",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNXK-ovL49w3-y1N0SyRmasiEBVbogYo8l6A9649RHFV5djh3vOcwxCc-79w-_OGfiL93mTBvoN4POqEUJLSPqumzBavP9aHO9mDUYpsBzdNicKKDdzN6clC5oCCcN-o7yVnwqaqF92EKmNq3RXfZv5oQcd960NcPCs4z3QHFUruZv07ew4mwZGhtYW3VxRAq1C5AajXVKtExcdmWIvDhuBKedwRiMYau4wJFJhU6rPR3fvNTCefw3J-Ha-d_sw42cFlnU55Oze6Y",
      actions: ["link", "code"]
    }
  ];

  const handleAction = (actionType: string, memberName: string) => {
    if (actionType === "share") {
      if (navigator.share) {
        navigator.share({
          title: `IT Support Hub - ${memberName}`,
          text: `Perkenalkan ${memberName} dari IT Support Hub Spesialis Kami.`,
          url: window.location.href
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert(`Tautan halaman profil ${memberName} disalin ke clipboard!`);
      }
    } else {
      // Default action: scroll to consultation form
      const element = document.getElementById("booking-section") || document.getElementById("harga");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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

        {/* 4 Cards Grid with profiles from image prompt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" id="expertise-grid">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-[#004ac6] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              id={`team-member-${idx}`}
            >
              <div>
                {/* Photo Container - matching mockup but with real img tag! */}
                <div className="aspect-square w-full rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100">
                  <img
                    src={member.imgUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="mb-4">
                  <h3 className="font-sans font-bold text-lg text-slate-900 mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-[#004ac6] font-sans font-semibold text-xs">
                    {member.role}
                  </p>
                </div>

                {/* Email details with Mail Icon */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-500 hover:text-[#004ac6] transition">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${member.email}`} className="text-xs font-medium truncate max-w-full">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Actions to Match design exactly */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                {member.actions.includes("link") && (
                  <button
                    onClick={() => handleAction("link", member.name)}
                    className="w-8 h-8 bg-slate-50 hover:bg-blue-50 text-[#004ac6] hover:text-blue-700 rounded-full flex items-center justify-center transition border border-slate-100 cursor-pointer"
                    title="Konsultasi langsung"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                )}
                {member.actions.includes("share") && (
                  <button
                    onClick={() => handleAction("share", member.name)}
                    className="w-8 h-8 bg-slate-50 hover:bg-blue-50 text-[#004ac6] hover:text-blue-700 rounded-full flex items-center justify-center transition border border-slate-100 cursor-pointer"
                    title="Bagikan Profil"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                {member.actions.includes("camera") && (
                  <button
                    onClick={() => handleAction("camera", member.name)}
                    className="w-8 h-8 bg-slate-50 hover:bg-blue-50 text-[#004ac6] hover:text-blue-700 rounded-full flex items-center justify-center transition border border-slate-100 cursor-pointer"
                    title="Spesialis Instalasi kamera & hardware"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                {member.actions.includes("code") && (
                  <button
                    onClick={() => handleAction("code", member.name)}
                    className="w-8 h-8 bg-slate-50 hover:bg-blue-50 text-[#004ac6] hover:text-blue-700 rounded-full flex items-center justify-center transition border border-slate-100 cursor-pointer"
                    title="Spesialis Konfigurasi CLI & Scripting"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
