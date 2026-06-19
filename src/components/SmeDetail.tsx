import React, { useState } from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Coins, 
  CalendarDays, 
  Check, 
  Send, 
  Network, 
  HardDrive, 
  FileText, 
  HelpCircle,
  ArrowLeft
} from "lucide-react";

interface SmeDetailProps {
  onBackToHome: () => void;
  onOpenConsultation: (service?: string) => void;
}

export default function SmeDetail({ onBackToHome, onOpenConsultation }: SmeDetailProps) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const payload = {
      client_name: formData.name,
      email: `${formData.businessName.toLowerCase().replace(/\s+/g, "") || "client"}@it-umkm.com`,
      phone: formData.phone,
      service_type: "Audit & Rekomendasi UMKM",
      message: `Nama UMKM: ${formData.businessName}. Pesan: ${formData.message}`
    };

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      setLoading(false);
      setSuccessMsg("Selamat! Permintaan konsultasi Anda berhasil diproses. Membuka WhatsApp untuk terhubung...");

      // Direct to WhatsApp
      const whatsappNumber = "6281234567890"; // Ganti nomor di sini
      const text = `Halo IT Support Hub,\n\nSaya ingin konsultasi Gratis Audit Infrastruktur IT.\n\n*Nama:* ${formData.name}\n*UMKM/Bisnis:* ${formData.businessName}\n*No. HP/WA:* ${formData.phone}\n*Pesan:* ${formData.message}\n\nTerima kasih.`;
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");

      // Reset form
      setFormData({ name: "", businessName: "", phone: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setSuccessMsg("Terjadi kendala jaringan tapi data dicoba dialihkan ke WhatsApp.");
      
      const whatsappNumber = "6281234567890";
      const text = `Halo IT Support Hub,\n\nSaya ingin konsultasi Gratis Audit Infrastruktur IT.\n\n*Nama:* ${formData.name}\n*UMKM/Bisnis:* ${formData.businessName}\n*No. HP/WA:* ${formData.phone}\n*Pesan:* ${formData.message}\n\nTerima kasih.`;
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    }
  };

  // Quick WhatsApp trigger for a specific plan
  const selectPlan = (planName: string, price: string) => {
    const whatsappNumber = "6281234567890";
    const text = `Halo IT Support Hub,\n\nSaya tertarik dengan paket Audit IT Segmen UMKM:\n*Paket:* ${planName}\n*Biaya:* ${price}\n\nMohon informasi selanjutnya. Terima kasih!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  const scrollToBooking = () => {
    const element = document.getElementById("booking-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans" id="sme-detail-panel">
      {/* Banner / Navigation Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4.5 px-6 shadow-xs sticky top-18 z-20">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-[#004ac6] px-4 py-2.5 rounded-lg border border-slate-200 transition cursor-pointer shadow-xs active:scale-95"
              id="back-to-home-btn"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              &larr; Kembali ke Beranda (Halaman Utama)
            </button>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-[#004ac6] bg-blue-50 px-2.5 py-1 rounded-md hidden sm:inline">
              Detail Layanan Audit UMKM
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Melihat: Segmen Layanan Khusus UMKM
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100" id="sme-detail-hero">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Column information */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#004ac6]/5 text-[#004ac6] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-[#004ac6]/10">
              <span className="w-2 h-2 bg-[#004ac6] rounded-full animate-ping"></span>
              Khusus Segmen UMKM
            </div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-4.5xl text-slate-900 tracking-tight leading-tight">
              Audit &amp; Rekomendasi <br />
              <span className="text-[#004ac6]">Infrastruktur IT</span>
            </h1>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              Optimalkan efisiensi operasional bisnis Anda dengan evaluasi mendalam terhadap sistem IT saat ini. Kami memberikan langkah strategis untuk skalabilitas tanpa biaya tinggi.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={scrollToBooking}
                className="bg-[#004ac6] hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-sans font-bold text-sm shadow-md transition-all cursor-pointer"
                id="hero-sme-consultation"
              >
                Konsultasi Sekarang
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById("benefits-section");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 px-8 py-4 rounded-lg font-sans font-bold text-sm transition-all cursor-pointer"
                id="hero-sme-more"
              >
                Lihat Detail Layanan
              </button>
            </div>
          </div>

          {/* Right Column image mockup matching screenshot */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL269MlAfk-e-9WmnXFtnDGY5AESsOHbuo9CuMnPXIR95cIcpbq2PGO_sezMe4iK4U-WRZw3p1SX1JxpmRkf2fBaJfaibzjefNCUl8oA-Yx4CGY29iLNO84wLTd9X8ONeUjSJcShjLyrdhYo87aa8p3w6e8z2PkAP7tO4mUIo0OK9hK8MBCm3zJxhkXZeEq1illEcJNnwuQweCIkWUIB1v9N2oZv--uzGCWbL-XLP7ybzWh2pk1rm__BwzgKTGtzFjrQEgnj0gj8A" 
                alt="Infrastructure Servers Audit"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                id="sme-audit-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why UMKM Nees Audit (Benefits) section matching screenshot */}
      <section className="py-20 bg-[#f8fafc] border-b border-slate-200" id="benefits-section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-sans font-bold text-2.5xl sm:text-3xl text-slate-900 tracking-tight">
              Mengapa UMKM Membutuhkan Audit?
            </h2>
            <p className="text-slate-500 font-sans text-sm">
              Masalah IT yang tidak terdeteksi sejak dini dapat menyebabkan kerugian finansial dan kebocoran data yang fatal.
            </p>
          </div>

          {/* Grid layout from draft screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="benefits-grid">
            
            {/* Card 1: Keamanan data berlapis */}
            <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-xs space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#004ac6] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-slate-900">
                Keamanan Data Berlapis
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kami mengaudit celah keamanan pada jaringan dan perangkat kerja karyawan Anda untuk mencegah serangan siber yang mengincar bisnis kecil.
              </p>
            </div>

            {/* Card 2: Kecepatan Sistem */}
            <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-xs space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#004ac6] rounded-xl flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-slate-900">
                Kecepatan Sistem
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Identifikasi bottleneck pada hardware dan software yang menghambat produktivitas harian tim Anda.
              </p>
            </div>

            {/* Card 3: Efisiensi Biaya */}
            <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-xs space-y-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-[#004ac6] rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-lg text-slate-900">
                Efisiensi Biaya
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rekomendasi perangkat yang tepat guna. Jangan beli hardware mahal yang tidak Anda butuhkan.
              </p>
            </div>

            {/* Card 4: Double width / special features card */}
            <div className="bg-gradient-to-r from-[#004ac6] to-blue-700 p-8 rounded-xl text-white md:col-span-2 lg:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-lg">
              {/* background graphic */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-6 translate-x-6">
                <Network className="w-64 h-64 text-white" />
              </div>

              <div className="space-y-3 z-10 max-w-2xl">
                <h4 className="font-sans font-bold text-xl md:text-2.5xl">
                  Laporan Strategis 12 Bulan
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Bukan sekadar perbaikan instan. Kami memberikan roadmap pengembangan IT untuk bisnis Anda selama setahun ke depan untuk mendukung skalabilitas.
                </p>
              </div>

              <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-lg grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3px]" />
                  <span>Proyeksi Skalabilitas Jaringan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3px]" />
                  <span>Rencana Backup Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3px]" />
                  <span>Standarisasi Perangkat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-300 stroke-[3px]" />
                  <span>Estimasi Anggaran IT</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing comparison audit package matching standard screenshot */}
      <section className="py-20 bg-white" id="prices-sme-section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-sans font-bold text-2.5xl sm:text-3xl text-slate-900 tracking-tight">
              Transparansi Biaya Audit
            </h2>
            <p className="text-slate-500 font-sans text-sm">
              Pilih paket yang paling sesuai dengan skala operasional kantor Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
            {/* Tier 1: Startup Friendly */}
            <div className="bg-[#f8fafc] border border-slate-200 p-8 rounded-xl flex flex-col justify-between hover:border-[#004ac6] transition shadow-xs">
              <div className="space-y-4">
                <span className="text-[#004ac6] font-sans font-bold text-xs uppercase tracking-wider block">
                  Startup Friendly
                </span>
                <div className="flex items-baseline">
                  <span className="text-slate-500 text-lg font-bold">Rp</span>
                  <span className="text-slate-900 text-3xl font-extrabold mx-1">1.5Jt</span>
                  <span className="text-slate-400 text-xs">/audit</span>
                </div>
                <ul className="space-y-3 text-slate-600 text-xs pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Maksimal 5 Perangkat/Karyawan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Audit Jaringan WI-FI Dasar
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Laporan Rekomendasi PDF
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => selectPlan("Startup Friendly", "Rp 1.5jt / Audit")}
                className="w-full py-3 mt-8 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer text-center"
              >
                Pilih Startup
              </button>
            </div>

            {/* Tier 2: Scale-Up Business */}
            <div className="bg-white border-2 border-[#004ac6] p-8 rounded-xl flex flex-col justify-between relative shadow-lg transform md:scale-103 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#004ac6] text-white px-4 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider">
                Terpopuler
              </div>
              <div className="space-y-4">
                <span className="text-[#004ac6] font-sans font-bold text-xs uppercase tracking-wider block">
                  Scale-Up Business
                </span>
                <div className="flex items-baseline">
                  <span className="text-slate-500 text-lg font-bold">Rp</span>
                  <span className="text-slate-900 text-3xl font-extrabold mx-1">3.5Jt</span>
                  <span className="text-slate-400 text-xs">/audit</span>
                </div>
                <ul className="space-y-3 text-slate-600 text-xs pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Maksimal 20 Perangkat
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Audit Keamanan Cyber (Firewall)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Evaluasi Server/NAS Kantor
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Roadmap Implementasi 12 Bulan
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => selectPlan("Scale-up Business", "Rp 3.5jt / Audit")}
                className="w-full py-3 mt-8 bg-[#004ac6] hover:bg-blue-700 text-white rounded-lg text-xs font-bold font-sans transition-all cursor-pointer text-center"
              >
                Pilih Scale-Up
              </button>
            </div>

            {/* Tier 3: Enterprise segment */}
            <div className="bg-[#f8fafc] border border-slate-200 p-8 rounded-xl flex flex-col justify-between hover:border-[#004ac6] transition shadow-xs">
              <div className="space-y-4">
                <span className="text-slate-500 font-sans font-bold text-xs uppercase tracking-wider block">
                  Enterprise
                </span>
                <div className="flex items-baseline">
                  <span className="text-slate-900 text-2.5xl font-extrabold">Custom</span>
                </div>
                <p className="text-slate-500 text-xs">
                  Untuk kantor dengan &gt;50 karyawan, cabang tersebar, atau kebutuhan infrastruktur data center khusus.
                </p>
                <div className="flex items-center gap-2 bg-blue-50 text-[#004ac6] p-2 rounded-lg text-xs font-medium">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Konsultasi Kebutuhan Khusus</span>
                </div>
              </div>
              <button 
                onClick={() => selectPlan("Enterprise Custom", "Harga Nego/Custom")}
                className="w-full py-3 mt-8 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold font-sans transition shadow-xs cursor-pointer text-center"
              >
                Hubungi Tim Ahli
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form matched exact to screenshot design */}
      <section className="py-20 bg-slate-50 border-t border-slate-200" id="booking-section">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-5">
            {/* Left promo panel inside card */}
            <div className="md:col-span-2 bg-[#004ac6] p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Network className="w-32 h-32" />
              </div>

              <div className="space-y-6 relative z-10">
                <h3 className="font-sans font-bold text-2xl leading-snug">
                  Konsultasi Sekarang
                </h3>
                <p className="text-blue-100 text-xs font-medium">
                  Isi formulir singkat di bawah ini, tim teknis kami akan menghubungi Anda via WhatsApp dalam kurun waktu kurang dari 24 jam.
                </p>
              </div>

              <div className="space-y-4 relative z-10 pt-8 border-t border-blue-500/50">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Dukungan Cepat</div>
                    <div className="text-[10px] text-blue-100 mt-0.5">Respon dalam 15 menit untuk konsultasi awal.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Ahli Bersertifikasi</div>
                    <div className="text-[10px] text-blue-100 mt-0.5">Tim kami memiliki sertifikasi internasional (CCNA, CompTIA).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Fields */}
            <form onSubmit={handleSubmit} className="md:col-span-3 p-8 space-y-4" id="sme-detail-consultation-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1.5" htmlFor="sme-form-name">
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    id="sme-form-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#004ac6] focus:bg-white rounded-lg p-3 text-slate-800 placeholder-slate-400 text-sm focus:ring-1 focus:ring-[#004ac6] outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold mb-1.5" htmlFor="sme-form-business">
                    Nama Bisnis / UMKM
                  </label>
                  <input 
                    type="text" 
                    id="sme-form-business"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Nama Perusahaan Anda"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#004ac6] focus:bg-white rounded-lg p-3 text-slate-800 placeholder-slate-400 text-sm focus:ring-1 focus:ring-[#004ac6] outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1.5" htmlFor="sme-form-phone">
                  Nomor WhatsApp
                </label>
                <input 
                  type="tel" 
                  id="sme-form-phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#004ac6] focus:bg-white rounded-lg p-3 text-slate-800 placeholder-slate-400 text-sm focus:ring-1 focus:ring-[#004ac6] outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1.5" htmlFor="sme-form-msg">
                  Pesan Singkat (Opsional)
                </label>
                <textarea 
                  id="sme-form-msg"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ceritakan sedikit masalah IT Anda..."
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#004ac6] focus:bg-white rounded-lg p-3 text-slate-800 placeholder-slate-400 text-sm focus:ring-1 focus:ring-[#004ac6] outline-hidden transition"
                />
              </div>

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-100 font-sans font-bold text-sm py-4 rounded-lg shadow-md hover:translate-y-[-1px] active:translate-y-0 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Menyimpan data..." : "Kirim ke WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
