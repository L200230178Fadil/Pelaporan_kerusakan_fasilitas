<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaporanController extends Controller
{
    /**
     * GET /api/laporan
     * Query params: search, status, page, per_page
     */
    public function index(Request $request)
    {
        $query = Laporan::query()->latest();

        // Filter pencarian: nama_fasilitas atau deskripsi
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_fasilitas', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('nama', 'like', "%{$search}%")
                  ->orWhere('tempat', 'like', "%{$search}%");
            });
        }

        // Filter status
        if ($status = $request->status) {
            $query->where('status', $status);
        }

        $perPage = min((int)($request->per_page ?? 10), 100);
        $data    = $query->paginate($perPage);

        // Statistik keseluruhan (bukan hanya yang terfilter)
        $stats = [
            'total'    => Laporan::count(),
            'menunggu' => Laporan::where('status', 'menunggu')->count(),
            'diproses' => Laporan::where('status', 'diproses')->count(),
            'selesai'  => Laporan::where('status', 'selesai')->count(),
            'ditolak'  => Laporan::where('status', 'ditolak')->count(),
        ];

        return response()->json([
            'data'  => $data,
            'stats' => $stats,
        ]);
    }

    /**
     * POST /api/laporan
     * multipart/form-data (karena ada upload foto)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role'           => 'required|in:mahasiswa,dosen,staf',
            'nama'           => 'required|string|max:100',
            'fakultas'       => 'required_if:role,mahasiswa|nullable|string|max:200',
            'prodi'          => 'required_if:role,mahasiswa|nullable|string|max:200',
            'nama_fasilitas' => 'required|string|max:150',
            'tempat'         => 'required|string|max:200',
            'deskripsi'      => 'required|string|min:20',
            'foto'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Upload foto jika ada
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('laporan-fotos', 'public');
            $validated['foto_path'] = $path;
            $validated['foto_url']  = asset('storage/' . $path);
        }

        // Hapus key 'foto' (file) dari validated sebelum insert
        unset($validated['foto']);

        $validated['status'] = 'menunggu';

        $laporan = Laporan::create($validated);

        return response()->json($laporan, 201);
    }

    /**
     * GET /api/laporan/{id}
     */
    public function show($id)
    {
        $laporan = Laporan::find($id);

        if (! $laporan) {
            return response()->json(['message' => 'Laporan tidak ditemukan.'], 404);
        }

        return response()->json($laporan);
    }
}
