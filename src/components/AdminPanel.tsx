import React, { useState, useEffect } from "react";
import { Server, Database, RefreshCw, Layers, Check, Hourglass, Trash2, Shield, HeartHandshake, Filter } from "lucide-react";
import { Consultation, DbStatus } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [initializingDb, setInitializingDb] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const checkDbStatus = async () => {
    setLoadingDb(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({
        connected: false,
        message: "Gagal berkomunikasi dengan server backend.",
        fallbackActive: true,
      });
    } finally {
      setLoadingDb(false);
    }
  };

  const fetchConsultations = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch("/api/consultations");
      const resData = await res.json();
      if (resData.success) {
        setConsultations(resData.data);
      }
    } catch (err) {
      console.error("Gagal mematangkan data leads.");
    } finally {
      setLoadingLeads(false);
    }
  };

  const initDbTable = async () => {
    setInitializingDb(true);
    setStatusMessage("");
    try {
      const res = await fetch("/api/db-init", { method: "POST" });
      const data = await res.json();
      setStatusMessage(data.message);
      checkDbStatus(); // re-verify
    } catch (err) {
      setStatusMessage("Gagal mengeksekusi skrip inisialisasi tabel.");
    } finally {
      setInitializingDb(false);
    }
  };

  const updateLeadStatus = async (id: number | undefined, newStatus: string) => {
    if (id === undefined) return;
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      alert("Gagal merubah status konsultasi.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkDbStatus();
      fetchConsultations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredConsultations = consultations.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200" id="admin-modal">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold font-sans">Database &amp; Lead Manager Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition focus:outline-hidden cursor-pointer"
          >
            Tutup Dashboard
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" id="admin-body">
          {/* Section 1: Database Status Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="admin-db-status-section">
            {/* Status Card */}
            <div className={`p-4 rounded-lg border ${dbStatus?.connected ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"} flex flex-col justify-between`}>
              <div className="flex items-center justify-between text-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider">Koneksi Neon DB</span>
                <Database className={`w-4 h-4 ${dbStatus?.connected ? "text-emerald-600" : "text-amber-500"}`} />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold font-sans flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${dbStatus?.connected ? "bg-emerald-500" : "bg-amber-400"}`}></span>
                  {dbStatus?.connected ? "Tersambung" : "Tidak Terdeteksi"}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {dbStatus?.message}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50 flex gap-2">
                <button
                  onClick={checkDbStatus}
                  disabled={loadingDb}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingDb ? "animate-spin" : ""}`} /> Test Koneksi
                </button>
              </div>
            </div>

            {/* Migration Card */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider">Migrasi Tabel</span>
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold font-sans mt-2.5">consultations</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pastikan tabel penyimpanan di database Neon Anda sudah dibuat.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <button
                  onClick={initDbTable}
                  disabled={initializingDb}
                  className="w-full text-center px-3 py-1.5 bg-[#004ac6] hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition"
                >
                  {initializingDb ? "Menjalankan..." : "Inisialisasi Tabel & Schema"}
                </button>
              </div>
            </div>

            {/* In-Memory vs Persistent state card */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider">Rute Penyimpanan</span>
                  <Server className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-xl font-bold font-sans mt-2.5">
                  {dbStatus?.connected ? "Neon SQL Engine" : "Memory Fallback"}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {dbStatus?.connected
                    ? "Setiap permohonan konsultasi baru akan tersimpan permanen di Neon Database PostgreSQL cloud Anda."
                    : "Menyimpan data di sandbox memory lokal. Untuk persistensi penuh, tambahkan DATABASE_URL pada Config panel."}
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {statusMessage && <span className="text-indigo-600 font-semibold">{statusMessage}</span>}
              </div>
            </div>
          </div>

          {/* Guidelines on Setup Neon for Developer */}
          {!dbStatus?.connected && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs leading-relaxed text-blue-900" id="dev-setup-guide">
              <h4 className="font-bold mb-1 text-blue-950 font-sans">💡 Panduan Menghubungkan Neon PostgreSQL Database &amp; Vercel:</h4>
              <ol className="list-decimal pl-4.5 space-y-1">
                <li>Buka akun Anda di <a href="https://neon.tech" target="_blank" className="underline font-bold text-blue-700">neon.tech</a> dan buat project database PostgreSQL baru.</li>
                <li>Salin <strong>Connection String</strong> Anda (contoh: <code className="bg-white/80 p-0.5 rounded px-1 text-slate-700 select-all font-mono">postgresql://neondb_owner:***@ep-***.neon.tech/neondb?sslmode=require</code>).</li>
                <li>Tempelkan string tersebut ke variabel lingkungan <strong>DATABASE_URL</strong> di panel pengaturan kredensial platform Anda (Config / Secrets).</li>
                <li>Klik tombol <strong>Inisialisasi Tabel &amp; Schema</strong> di atas untuk memigrasi database consultations secara otomatis.</li>
                <li>Untuk di Vercel: Tambahkan variabel lingkungan yang sama (<code className="font-semibold">DATABASE_URL</code>) pada menu Environment Variables di project Vercel Anda sebelum melakukan deployment.</li>
              </ol>
            </div>
          )}

          {/* Section 2: Incoming Leads Inquiry */}
          <div className="space-y-3.5" id="admin-table-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4.5 h-4.5 text-[#004ac6]" />
                <h3 className="font-sans font-bold text-md text-slate-900">
                  Daftar Pengajuan Konsultasi ({filteredConsultations.length})
                </h3>
              </div>

              {/* Filtering & Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Filter className="w-3.5 h-3.5" /> Filter status:
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1 rounded-md outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Data</option>
                  <option value="Pending">Pending</option>
                  <option value="Dihubungi">Sudah Dihubungi</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <button
                  onClick={fetchConsultations}
                  disabled={loadingLeads}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? "animate-spin" : ""}`} /> Refresh Data
                </button>
              </div>
            </div>

            {/* Table or Placeholder */}
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-slate-400 bg-slate-50">
                Belum ada pengajuan masuk dengan status filter ini. Coba buat konsultasi baru!
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[35vh] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-sans font-bold">Klien / Detail Kontak</th>
                      <th className="py-3 px-4 font-sans font-bold">Segmen / Layanan</th>
                      <th className="py-3 px-4 font-sans font-bold">Deskripsi Kebutuhan / Pesan</th>
                      <th className="py-3 px-4 font-sans font-bold">Waktu Masuk</th>
                      <th className="py-3 px-4 font-sans font-bold">Status Tindak Lanjut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredConsultations.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        {/* Name & Contacts */}
                        <td className="py-3.5 px-4 font-sans font-medium">
                          <div className="font-bold text-slate-900 text-sm">{lead.client_name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{lead.email}</div>
                          <div className="text-xs text-[#004ac6] font-semibold mt-0.5">{lead.phone}</div>
                        </td>

                        {/* Service requested */}
                        <td className="py-3.5 px-4 font-sans font-semibold">
                          <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded font-bold font-sans">
                            {lead.service_type}
                          </span>
                        </td>

                        {/* Problem Message */}
                        <td className="py-3.5 px-4 font-sans text-xs text-slate-600 max-w-xs truncate leading-relaxed">
                          {lead.message || <span className="italic text-slate-400">Tidak ada deskripsi</span>}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {new Date(lead.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Status Select action toggle */}
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className={`px-2 py-1 rounded bg-slate-100 border text-xs font-bold leading-none cursor-pointer outline-hidden ${
                              lead.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : lead.status === "Dihubungi"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="Pending">⚙️ Pending</option>
                            <option value="Dihubungi">📞 Dihubungi</option>
                            <option value="Selesai">✅ Selesai</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
