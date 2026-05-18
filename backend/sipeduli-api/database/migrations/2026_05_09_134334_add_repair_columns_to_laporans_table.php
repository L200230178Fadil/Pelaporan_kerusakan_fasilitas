<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            $table->string('foto_perbaikan_path')->after('foto_url')->nullable();
            $table->text('keterangan_perbaikan')->after('foto_perbaikan_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporans', function (Blueprint $table) {
            $table->dropColumn(['foto_perbaikan_path', 'keterangan_perbaikan']);
        });
    }
};
