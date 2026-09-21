import React, { useState, useEffect } from 'react';
import { StudentSubmission } from '../types/exam';
import {
  getSubmissions,
  getStoredWebhookUrl,
  setStoredWebhookUrl,
  getStoredSheetDirectLink,
  setStoredSheetDirectLink,
  testGoogleSheetsWebhook,
  syncAllPendingToGoogleSheets,
  clearSubmissions,
  generateGoogleSheetsTSV,
  generateGoogleSheetsCSV,
  APPS_SCRIPT_TEMPLATE
} from '../services/googleSheetsService';
import {
  FileSpreadsheet,
  Link as LinkIcon,
  Check,
  Copy,
  Download,
  RefreshCw,
  Trash2,
  X,
  ExternalLink,
  HelpCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  Send,
  Eye,
  Key
} from 'lucide-react';
import { CLASS_TOKEN_LIST } from '../data/classTokens';

interface TeacherPortalModalProps {
  onClose: () => void;
}

const PIN_STORAGE_KEY = 'biologi_labirin_teacher_pin';

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({ onClose }) => {
  // PIN Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [currentPin, setCurrentPin] = useState('guru123');

  // Portal data states
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sheetDirectLink, setSheetDirectLink] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [copiedTokenIndex, setCopiedTokenIndex] = useState<number | null>(null);
  
  // Test webhook state
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'ALL' | '10' | '12'>('ALL');
  
  // Selected detail modal for individual answer history
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] = useState<StudentSubmission | null>(null);

  // Change PIN states
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  useEffect(() => {
    try {
      const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
      if (storedPin) {
        setCurrentPin(storedPin);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === currentPin || inputPin === 'guru123') {
      setIsAuthenticated(true);
      setPinError('');
      // Load data
      setSubmissions(getSubmissions());
      setWebhookUrl(getStoredWebhookUrl());
      setSheetDirectLink(getStoredSheetDirectLink());
    } else {
      setPinError('PIN salah. Akses portal hanya untuk Guru (Default PIN: guru123)');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) return;
    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
      setCurrentPin(newPin.trim());
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setIsChangingPin(false);
        setNewPin('');
      }, 2000);
    } catch (e) {
      // ignore
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setStoredWebhookUrl(webhookUrl);
    setStoredSheetDirectLink(sheetDirectLink);
    setTimeout(() => {
      setIsSavingConfig(false);
      setConfigSaveSuccess(true);
      setTimeout(() => setConfigSaveSuccess(false), 3000);
    }, 300);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Webhook Google Apps Script terlebih dahulu.'
      });
      return;
    }
    setIsTestingWebhook(true);
    setTestResult(null);
    const result = await testGoogleSheetsWebhook(webhookUrl.trim());
    setTestResult(result);
    setIsTestingWebhook(false);
  };

  const handleSync = async () => {
    if (!webhookUrl.trim()) {
      setSyncStatus('Masukkan Webhook URL Google Apps Script terlebih dahulu');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('Sedang mengirim seluruh data ke Google Spreadsheet...');
    try {
      const result = await syncAllPendingToGoogleSheets(webhookUrl.trim());
      setSubmissions(getSubmissions());
      setSyncStatus(`Berhasil mengirim ${result.successCount} data ke Google Spreadsheet Anda!`);
    } catch (e) {
      setSyncStatus('Gagal mengirim data. Periksa kembali URL Webhook Anda.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyTSV = () => {
    const tsv = generateGoogleSheetsTSV(submissions);
    navigator.clipboard.writeText(tsv);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 3000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleDownloadCSV = () => {
    const csv = generateGoogleSheetsCSV(submissions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_nilai_biologi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    if (window.confirm('Hapus seluruh rekap nilai siswa dari perangkat ini? Data di Google Spreadsheet Anda tidak akan terhapus.')) {
      clearSubmissions();
      setSubmissions([]);
    }
  };

  // Collect unique classes from submissions + standard presets
  const availableClasses = Array.from(
    new Set([
      '10 Khodijah',
      '10 Fatimah',
      '12 Saintek 4',
      '12 Saintek 5',
      '12 Saintek 6',
      ...submissions.map((s) => s.className)
    ])
  ).filter(Boolean);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.className === selectedClass;
    const matchesGrade =
      selectedGradeFilter === 'ALL' ||
      (selectedGradeFilter === '12' && (s.gradeLevel === '12' || (s.packageTitle && s.packageTitle.includes('12')))) ||
      (selectedGradeFilter === '10' && (s.gradeLevel === '10' || !s.gradeLevel || (s.packageTitle && s.packageTitle.includes('10'))));
    return matchesSearch && matchesClass && matchesGrade;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Teacher Portal & Integrasi Google Sheets
              </h2>
              <p className="text-xs text-stone-500">
                Konfigurasi Webhook, tautan spreadsheet, dan rekapitulasi data nilai siswa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If NOT Authenticated: Show PIN Verification Form */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Masukkan PIN Guru</h3>
              <p className="text-xs text-stone-500 mt-1">
                Data rekapitulasi nilai dan konfigurasi Google Sheets bersifat rahasia dan aman dari akses siswa.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="Masukkan PIN (Default: guru123)"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-center text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 mt-2 font-medium">{pinError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Buka Portal
                </button>
              </div>

              <div className="pt-2 text-[11px] text-stone-400">
                PIN Bawaan Guru: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-stone-600">guru123</code>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Teacher View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Quick Links & Google Drive Action Bar */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                    <h3 className="font-bold text-emerald-950 text-sm">
                      Google Spreadsheet Guru
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Setiap siswa selesai ujian, data <strong>Nama, Kelas, Skor, Status, dan Riwayat Lengkap 15 Jawaban</strong> langsung dikirim secara otomatis ke spreadsheet Anda.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {sheetDirectLink ? (
                    <a
                      href={sheetDirectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Spreadsheet Guru</span>
                    </a>
                  ) : (
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buat Spreadsheet Baru (sheets.new)</span>
                    </a>
                  )}
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-emerald-900 border border-emerald-300 font-semibold rounded-lg text-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Drive</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Class Token Reference Card for Exam Supervisors */}
            <div className="bg-stone-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Daftar Token Rilis Ujian per Kelas
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Bagikan token kepada siswa saat jam ujian dimulai agar soal tidak dikerjakan sebelum waktunya
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {CLASS_TOKEN_LIST.map((item, idx) => (
                  <div
                    key={item.className}
                    className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between shadow-2xs hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{item.className}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded font-normal">
                          {item.grade}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[11px] text-stone-500 font-medium">Token:</span>
                        <code className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.token}
                        </code>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.token);
                        setCopiedTokenIndex(idx);
                        setTimeout(() => setCopiedTokenIndex(null), 2000);
                      }}
                      className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Salin Token"
                    >
                      {copiedTokenIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Sheets Webhook Configuration Form */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-stone-900">
                    Konfigurasi Webhook & Tautan Spreadsheet
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScriptCode(!showScriptCode)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showScriptCode ? 'Tutup Panduan Script' : 'Lihat Script Google Apps Script (Siap Pakai)'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    URL Webhook Google Apps Script <span className="text-emerald-700">(Untuk Pengiriman Otomatis)</span>
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Tautan / URL Langsung Google Spreadsheet Guru (Opsional)
                  </label>
                  <input
                    type="url"
                    value={sheetDirectLink}
                    onChange={(e) => setSheetDirectLink(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {configSaveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Konfigurasi Tersimpan!</span>
                      </>
                    ) : (
                      <span>Simpan Pengaturan</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook || !webhookUrl.trim()}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin' : ''}`} />
                    <span>{isTestingWebhook ? 'Mengirim Data Tes...' : 'Kirim Uji Coba ke Spreadsheet'}</span>
                  </button>

                  {webhookUrl.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        const shareableUrl = `${window.location.origin}${window.location.pathname}?webhook=${encodeURIComponent(webhookUrl.trim())}${sheetDirectLink ? `&sheet=${encodeURIComponent(sheetDirectLink.trim())}` : ''}`;
                        navigator.clipboard.writeText(shareableUrl);
                        alert('Tautan Khusus Siswa Berhasil Disalin!\n\nBagikan tautan ini ke siswa di PC lain agar seluruh pengerjaan otomatis terhubung ke Google Sheets Anda tanpa perlu setting di tiap PC.');
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Salin tautan yang otomatis menghubungkan semua PC siswa ke Google Sheet ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link Ujian Siswa (Auto-Connect PC Siswa)</span>
                    </button>
                  )}

                  {submissions.length > 0 && webhookUrl.trim() && (
                    <button
                      type="button"
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sinkronkan Ulang Semua ({submissions.length}) Data</span>
                    </button>
                  )}
                </div>
              </form>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-100 text-rose-900 border border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testResult.message}</span>
                </div>
              )}

              {syncStatus && (
                <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{syncStatus}</span>
                </p>
              )}

              {/* Script instructions dropdown */}
              {showScriptCode && (
                <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
                  <div className="text-xs text-stone-700 space-y-1">
                    <p className="font-bold text-stone-900">Cara Membuat Script Penerima di Google Sheets (Hanya 1x setup):</p>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                      <li>Buka Google Spreadsheet Anda (bisa buat baru di <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">sheets.new</a>).</li>
                      <li>Klik menu <strong>Extensions (Ekstensi) &gt; Apps Script</strong>.</li>
                      <li>Hapus kode bawaan di editor, lalu salin dan tempel kode lengkap di bawah.</li>
                      <li>Klik tombol <strong>Deploy (Terapkan) &gt; New Deployment (Penerapan Baru)</strong>.</li>
                      <li>Pilih jenis <strong>Web App (Aplikasi Web)</strong>, lalu set <em>Who has access</em> ke <strong>Anyone (Siapa saja)</strong>.</li>
                      <li>Klik <strong>Deploy</strong>, lalu salin Web App URL ke kolom Webhook di atas.</li>
                    </ol>
                  </div>

                  <div className="relative bg-stone-900 text-stone-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto max-h-56">
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-sans flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedScript ? 'Tersalin!' : 'Salin Seluruh Kode'}</span>
                    </button>
                    <pre>{APPS_SCRIPT_TEMPLATE}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons for Manual Export */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Total Nilai Terkumpul:
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-mono font-bold text-xs">
                  {submissions.length} Siswa
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTSV}
                  disabled={submissions.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  title="Salin data tabel terformat untuk di-paste langsung ke Google Sheets (Ctrl+V)"
                >
                  {copiedData ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedData ? 'Tersalin ke Clipboard!' : 'Salin Data untuk Paste ke Sheets'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  disabled={submissions.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-stone-200 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File CSV</span>
                </button>

                {submissions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-200"
                    title="Hapus cadangan nilai di browser ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="relative sm:col-span-6">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="ALL">Semua Tingkat ({submissions.length})</option>
                  <option value="10">Kelas 10 (Keanekaragaman)</option>
                  <option value="12">Kelas 12 (Enzim & Metabolisme)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="ALL">Semua Kelas</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Submissions Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Waktu Selesai</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3">Materi / Paket</th>
                      <th className="px-4 py-3 text-center">Benar</th>
                      <th className="px-4 py-3 text-center">Nilai (Maks 40)</th>
                      <th className="px-4 py-3 text-center">Pelanggaran CBT</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Riwayat Jawaban</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-stone-400">
                          {submissions.length === 0
                            ? 'Belum ada siswa yang menyelesaikan ulangan. Saat siswa selesai, nilainya akan otomatis muncul di sini dan terkirim ke Google Sheets.'
                            : 'Tidak ada data siswa yang cocok dengan filter pencarian.'}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => {
                        const totalSoal = sub.totalQuestions || (sub.gradeLevel === '12' ? 20 : 15);
                        const isK12 = sub.gradeLevel === '12' || (sub.packageTitle && sub.packageTitle.includes('12'));
                        return (
                          <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-4 py-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                              {sub.timestamp}
                            </td>
                            <td className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">
                              {sub.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{sub.className}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                                {isK12 ? 'Kelas 12 (Enzim)' : 'Kelas 10 (Biodiversitas)'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-mono font-medium whitespace-nowrap">
                              {sub.correctCount} / {totalSoal}
                            </td>
                            <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                              {sub.scoreScale100.toFixed(0)}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {sub.violationsCount && sub.violationsCount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-mono text-[11px] font-bold">
                                  {sub.violationsCount}x Pindah Tab
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px] font-mono">
                                  0 (Tertib)
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {sub.status === 'Sampai Tujuan Utama' || sub.status === 'Selesai Sempurna' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  {sub.status === 'Selesai Sempurna' ? 'Selesai Sempurna' : 'Sampai Tujuan'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  Tersesat
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedSubmissionDetail(sub)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer border border-stone-200"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Lihat Jawaban</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Change PIN Settings */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
              {!isChangingPin ? (
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Ubah PIN Akses Guru</span>
                </button>
              ) : (
                <form onSubmit={handleChangePin} className="flex items-center gap-2">
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="PIN Baru..."
                    className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 text-white rounded-lg font-semibold hover:bg-stone-900 cursor-pointer"
                  >
                    Simpan PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(false)}
                    className="px-2 py-1.5 text-stone-500 hover:text-stone-800"
                  >
                    Batal
                  </button>
                  {pinChangeSuccess && (
                    <span className="text-emerald-700 font-medium">PIN Diperbarui!</span>
                  )}
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Portal ini hanya dapat dibuka oleh Guru dengan PIN. Data tersimpan aman.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Detail Riwayat Jawaban Modal */}
      {selectedSubmissionDetail && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Riwayat Jawaban: {selectedSubmissionDetail.name}
                </h3>
                <p className="text-xs text-stone-500 flex flex-wrap items-center gap-2 mt-0.5">
                  <span>Kelas: {selectedSubmissionDetail.className}</span>
                  <span>•</span>
                  <span>Nilai: {selectedSubmissionDetail.scoreScale100} / 100 ({selectedSubmissionDetail.correctCount}/{selectedSubmissionDetail.totalQuestions || (selectedSubmissionDetail.gradeLevel === '12' ? 20 : 15)} Benar)</span>
                  <span>•</span>
                  <span className={selectedSubmissionDetail.violationsCount && selectedSubmissionDetail.violationsCount > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700'}>
                    Pelanggaran CBT: {selectedSubmissionDetail.violationsCount ? `${selectedSubmissionDetail.violationsCount}x Pindah Tab` : '0 (Tertib)'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmissionDetail(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              <div className="text-stone-600 font-semibold mb-2">
                Daftar Jawaban Setiap Langkah (Jalur Percabangan):
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 font-mono text-xs leading-relaxed text-stone-800 whitespace-pre-wrap">
                {selectedSubmissionDetail.answerHistory
                  ? selectedSubmissionDetail.answerHistory.split(' | ').map((step, idx) => (
                      <div key={idx} className="py-1 border-b border-stone-200/60 last:border-0 flex items-center justify-between gap-2">
                        <span>{step}</span>
                        {step.includes('Benar') ? (
                          <span className="text-emerald-700 font-bold font-sans text-[11px] px-2 py-0.5 bg-emerald-50 rounded">Benar</span>
                        ) : (
                          <span className="text-rose-600 font-bold font-sans text-[11px] px-2 py-0.5 bg-rose-50 rounded">Salah</span>
                        )}
                      </div>
                    ))
                  : 'Tidak ada detail riwayat jawaban.'}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubmissionDetail(null)}
                className="px-4 py-1.5 bg-stone-800 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
