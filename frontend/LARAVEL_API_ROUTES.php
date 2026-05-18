<?php
// ============================================================
// routes/api.php
// Tambahkan route-route ini ke file api.php Laravel Anda
// ============================================================

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FasilitasController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\PerbaikanController;
use App\Http\Controllers\Api\DashboardController;

// ─── Auth ────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});

// ─── Protected Routes ────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('summary', [DashboardController::class, 'summary']);
        Route::get('trend',   [DashboardController::class, 'trend']);
    });

    // Fasilitas (admin: CUD, semua: R)
    Route::apiResource('fasilitas', FasilitasController::class);

    // Laporan
    Route::apiResource('laporan', LaporanController::class);

    // Perbaikan / Monitoring
    Route::prefix('perbaikan')->group(function () {
        Route::get('/',                          [PerbaikanController::class, 'index']);
        Route::get('{id}',                       [PerbaikanController::class, 'show']);
        Route::patch('{id}/status',              [PerbaikanController::class, 'updateStatus']);
        Route::post('{id}/catatan',              [PerbaikanController::class, 'addCatatan']);
        Route::patch('{id}/assign',              [PerbaikanController::class, 'assignTeknisi']);
    });
});
