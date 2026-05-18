# Implementasi UI/UX Admin Backend dengan Filament PHP

Permintaan Anda adalah untuk menambahkan **Laravel UI/UX untuk admin/backend**. Karena aplikasi ini berbasis Laravel 12, standar industri saat ini untuk admin panel yang modern, cantik, dan sangat fungsional di ekosistem Laravel adalah **Filament PHP (v3)**.

Meskipun Anda memiliki frontend React (SiPeduli) yang memiliki rintisan (mockup) halaman Dashboard Admin, menggunakan Filament di sisi server (backend Laravel) akan memberikan Anda *Control Panel* bawaan yang sangat kuat (CRUD otomatis, filter, pencarian, dan keamanan) dengan waktu pengembangan yang sangat singkat.

## ⚠️ User Review Required

Saya mengusulkan untuk menginstal **Filament PHP** di dalam backend Laravel Anda. Filament akan memberikan UI/UX yang sangat premium (menggunakan Tailwind CSS, Alpine.js, dan Livewire) secara terpisah dari frontend React Anda.

1. **Apakah Anda setuju menggunakan Filament PHP untuk panel admin backend?** 
   *(Jika Anda lebih memilih untuk melanjutkan pembuatan UI Admin di frontend React dan hanya melengkapi API backend-nya, mohon beritahu saya).*

2. **Akses Panel:** Panel admin Filament ini nantinya akan dapat diakses melalui URL `/admin` di backend Anda (misalnya `http://localhost:8000/admin`).

## Proposed Changes

Jika Anda menyetujui, berikut adalah langkah-langkah yang akan saya lakukan:

### 1. Instalasi Filament PHP
- Menjalankan `composer require filament/filament:"^3.2" -W` di folder `backend/sipeduli-api`.
- Menjalankan `php artisan filament:install --panels` untuk setup awal.

### 2. Pembuatan User Admin
- Membuat perintah atau seeder untuk membuat *User Admin* agar Anda bisa login ke dalam panel `/admin`.

### 3. Pembuatan Resource Filament (CRUD)
- **Laporan Resource:** Membuat antarmuka tabel untuk mengelola Laporan (Melihat daftar laporan, mengubah status dari 'menunggu' menjadi 'diproses'/'selesai', dll).
- *(Opsional)* **Fasilitas Resource:** Membuat antarmuka untuk mengelola data Fasilitas jika tabelnya sudah ada.

### 4. Konfigurasi
- Mengatur konfigurasi panel Filament agar sesuai dengan branding **SiPeduli**.

## Verification Plan

### Automated Tests
- Menjalankan perintah `php artisan route:list` untuk memverifikasi rute `/admin` telah terdaftar.

### Manual Verification
- Anda akan dapat membuka `http://localhost:8000/admin` di browser, login dengan akun admin yang dibuat, dan langsung melihat UI/UX admin yang cantik untuk mengelola data Laporan.
