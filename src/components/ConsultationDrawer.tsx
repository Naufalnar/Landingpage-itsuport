import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { Consultation } from "../types";

interface ConsultationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
  onSuccess: () => void;
}

export default function ConsultationDrawer({
  isOpen,
  onClose,
  selectedService,
  onSuccess,
}: ConsultationDrawerProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    service_type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dbSuccessMessage, setDbSuccessMessage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      service_type: selectedService || prev.service_type || "Konsultasi Umum",
    }));
  }, [selectedService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setDbSuccessMessage("");

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (resData.success) {
        setSubmitted(true);
        setDbSuccessMessage(resData.message);
        onSuccess();
      } else {
        setErrorMsg(resData.message || "Gagal mengirimkan formulir.");
      }
    } catch (err) {
      setErrorMsg("Koneksi gagal. Silakan coba kembali beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      client_name: "",
      email: "",
      phone: "",
      service_type: selectedService || "Konsultasi Umum",
      message: "",
    });
    setSubmitted(false);
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="consultation-drawer-container">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        id="drawer-backdrop"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="drawer-panel-wrapper">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300 pointer-events-auto border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#004ac6] to-blue-700 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-sans">Konsultasi Gratis</h2>
              <p className="text-xs text-blue-100 mt-1">Dapatkan estimasi biaya & saran taktis dalam 30 menit</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-hidden text-white"
              id="close-drawer-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6" id="drawer-scroll-body">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#004ac6] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 leading-snug">Respon Cepat Terjamin</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Tim teknisi spesialis kami akan meninjau keluhan Anda dan merespon kembali dalam kurun waktu kurang dari 30 menit.
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] rounded-lg outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: budi@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] rounded-lg outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] rounded-lg outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pilih Segmen / Tipe Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] bg-white rounded-lg outline-hidden text-sm cursor-pointer"
                  >
                    <option value="Konsultasi Umum">Konsultasi Umum / Lainnya</option>
                    <option value="Segmen Personal">Segmen Personal (Hardware/OS/Bundling)</option>
                    <option value="Segmen UMKM">Segmen UMKM (Audit & Sourcing rutin)</option>
                    <option value="Segmen Enterprise">Segmen Enterprise (Full Corporate Audit / Mass Sourcing)</option>
                    <option value="Tim Audit & Konsultasi">Tim Audit & Konsultasi</option>
                    <option value="Tim Procurement">Tim Procurement</option>
                    <option value="Tim Technical Support">Tim Technical Support</option>
                    <option value="Tim OS Specialist">Tim OS Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Masalah / Pesan Tambahan
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Jelaskan kebutuhan IT Anda, seri perangkat, versi OS, atau jumlah lisensi yang ingin diaudit secara singkat..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] rounded-lg outline-hidden text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-300 cursor-pointer flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Memproses data...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Formulir Konsultasi
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-center items-center gap-1.5 text-center text-xs text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Data pribadi Anda dijamin aman & rahasia
                </div>
              </form>
            ) : (
              <div className="text-center py-8 px-4 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-5 animate-pulse">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Formulir Dikirim!</h3>
                <p className="text-sm text-slate-500 mt-2.5 max-w-sm leading-relaxed">
                  Terima kasih, <strong>{formData.client_name}</strong>. Tim spesialis di IT Support Hub telah menerima permohonan konsultasi gratis Anda.
                </p>

                {dbSuccessMessage && (
                  <div className="mt-4 p-3.5 bg-blue-50 text-blue-800 text-xs text-left rounded-lg border border-blue-100 leading-relaxed font-mono w-full">
                    {dbSuccessMessage}
                  </div>
                )}

                <div className="mt-8 space-y-3 w-full">
                  <button
                    onClick={onClose}
                    className="w-full bg-[#004ac6] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Tutup Menu
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Kirim Form Lainnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
