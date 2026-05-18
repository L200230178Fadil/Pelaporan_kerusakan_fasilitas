<?php

namespace App\Filament\Widgets;

use App\Models\Laporan;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $total    = Laporan::count();
        $menunggu = Laporan::where('status', 'menunggu')->count();
        $diproses = Laporan::where('status', 'diproses')->count();
        $selesai  = Laporan::where('status', 'selesai')->count();
        $ditolak  = Laporan::where('status', 'ditolak')->count();

        // Persentase selesai
        $pctSelesai = $total > 0 ? round(($selesai / $total) * 100, 1) : 0;

        return [
            Stat::make('Total Laporan', $total)
                ->description('Semua laporan masuk')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Menunggu', $menunggu)
                ->description('Belum diproses')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Diproses', $diproses)
                ->description('Sedang diperbaiki')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('info'),

            Stat::make('Selesai', $selesai)
                ->description("{$pctSelesai}% dari total laporan")
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Ditolak', $ditolak)
                ->description('Laporan tidak valid')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
        ];
    }
}
