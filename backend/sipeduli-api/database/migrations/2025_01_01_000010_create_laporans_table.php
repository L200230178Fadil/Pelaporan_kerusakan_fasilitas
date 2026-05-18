<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporans', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['mahasiswa', 'dosen', 'staf']);
            $table->string('nama', 100);
            $table->string('fakultas')->nullable();   // hanya mahasiswa
            $table->string('prodi')->nullable();      // hanya mahasiswa
            $table->string('nama_fasilitas', 150);
            $table->string('tempat', 200);
            $table->text('deskripsi');
            $table->string('foto_path')->nullable();  // path di storage
            $table->string('foto_url')->nullable();   // URL publik
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])
                  ->default('menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporans');
    }
};
