<?php
// ============================================================
// routes/api.php — SiPeduli (tanpa auth)
// ============================================================
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LaporanController;

// Semua endpoint publik — tidak perlu auth
Route::prefix('laporan')->group(function () {
    Route::get('/',     [LaporanController::class, 'index']);   // GET  /api/laporan
    Route::post('/',    [LaporanController::class, 'store']);   // POST /api/laporan
    Route::get('/{id}', [LaporanController::class, 'show']);   // GET  /api/laporan/{id}
});

// ============================================================
// Contoh LaporanController (app/Http/Controllers/Api/)
// ============================================================
//
// public function index(Request $request)
// {
//     $query = Laporan::query()->latest();
//
//     if ($request->search) {
//         $query->where(function($q) use ($request) {
//             $q->where('nama_fasilitas', 'like', "%{$request->search}%")
//               ->orWhere('deskripsi',    'like', "%{$request->search}%");
//         });
//     }
//
//     if ($request->status) $query->where('status', $request->status);
//
//     $data = $query->paginate($request->per_page ?? 10);
//
//     // Tambahkan stats
//     $stats = [
//         'total'    => Laporan::count(),
//         'menunggu' => Laporan::where('status', 'menunggu')->count(),
//         'diproses' => Laporan::where('status', 'diproses')->count(),
//         'selesai'  => Laporan::where('status', 'selesai')->count(),
//     ];
//
//     return response()->json(['data' => $data, 'stats' => $stats]);
// }
//
// public function store(Request $request)
// {
//     $validated = $request->validate([
//         'role'           => 'required|in:mahasiswa,dosen,staf',
//         'nama'           => 'required|string|max:100',
//         'fakultas'       => 'required_if:role,mahasiswa|nullable|string',
//         'prodi'          => 'required_if:role,mahasiswa|nullable|string',
//         'nama_fasilitas' => 'required|string|max:150',
//         'tempat'         => 'required|string|max:200',
//         'deskripsi'      => 'required|string|min:20',
//         'foto'           => 'nullable|image|max:5120',
//     ]);
//
//     if ($request->hasFile('foto')) {
//         $validated['foto_path'] = $request->file('foto')->store('laporan', 'public');
//         $validated['foto_url']  = asset('storage/' . $validated['foto_path']);
//     }
//
//     $validated['status'] = 'menunggu';
//     $laporan = Laporan::create($validated);
//
//     return response()->json($laporan, 201);
// }

// ============================================================
// Migration columns yang dibutuhkan di tabel laporan:
// ============================================================
// $table->string('role');              // mahasiswa | dosen | staf
// $table->string('nama');
// $table->string('fakultas')->nullable();
// $table->string('prodi')->nullable();
// $table->string('nama_fasilitas');
// $table->string('tempat');
// $table->text('deskripsi');
// $table->string('foto_path')->nullable();
// $table->string('foto_url')->nullable();
// $table->enum('status', ['menunggu','diproses','selesai','ditolak'])->default('menunggu');
