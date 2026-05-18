# SiPeduli v2 — Frontend React (Tanpa Login)
Sistem Pelaporan Fasilitas Gedung J — UMS | Capstone 2026

## Struktur File

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx     # Wrapper: Navbar + footer + Toaster
│   │   └── Navbar.jsx        # Header publik (Dashboard + Buat Laporan)
│   └── ui/
│       └── index.jsx         # Badge, Spinner, Modal, FieldGroup, EmptyState
├── pages/
│   ├── DashboardPage.jsx     # Beranda: statistik + daftar laporan + filter
│   └── FormLaporanPage.jsx   # Form laporan dinamis per role
├── services/
│   └── api.js                # Axios, endpoint /api/laporan
├── utils/
│   └── helpers.js            # Format tanggal, status config, daftar fakultas/prodi
├── App.jsx                   # Router (React Router v7)
├── main.jsx
└── index.css
```

## Instalasi

```bash
npm install
npm run dev
# Buka http://localhost:5173
```

## Alur Form Laporan

1. Pelapor pilih **role**: Mahasiswa / Dosen / Staf
2. **Mahasiswa** → input Nama + Fakultas (dropdown) + Prodi (dropdown dinamis)
   **Dosen/Staf** → input Nama saja
3. Input **Nama Fasilitas** (bebas ketik, tidak perlu database fasilitas)
4. Input **Lokasi/Tempat** (cth: Ruang J403)
5. Input **Deskripsi Kerusakan** (min. 20 karakter)
6. Upload **Foto** (opsional, maks. 5MB)
7. Kirim → tampil halaman sukses

## Laravel Setup

Lihat `LARAVEL_GUIDE.php` untuk:
- Route API yang dibutuhkan
- Contoh implementasi LaporanController
- Kolom migration tabel laporan

### CORS (config/cors.php)
```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => false,
```

### Storage foto
```bash
php artisan storage:link
```

## Tech Stack
React 19 · React Router 7 · Axios · React Hook Form · Lucide React · Tailwind CSS 3 · date-fns · Vite 6
