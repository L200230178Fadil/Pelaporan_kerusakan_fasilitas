<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = [
        'role',
        'nama',
        'fakultas',
        'prodi',
        'nama_fasilitas',
        'tempat',
        'deskripsi',
        'foto_path',
        'foto_url',
        'foto_perbaikan_path',
        'keterangan_perbaikan',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'foto_perbaikan_url',
    ];

    /**
     * Jika foto_url belum tersimpan tapi foto_path ada,
     * generate URL otomatis dari path storage.
     */
    public function getFotoUrlAttribute($value): ?string
    {
        if ($value) return $value;
        if ($this->foto_path) {
            return asset('storage/' . $this->foto_path);
        }
        return null;
    }

    /**
     * URL untuk foto setelah perbaikan
     */
    public function getFotoPerbaikanUrlAttribute(): ?string
    {
        if ($this->foto_perbaikan_path) {
            return asset('storage/' . $this->foto_perbaikan_path);
        }
        return null;
    }
}
