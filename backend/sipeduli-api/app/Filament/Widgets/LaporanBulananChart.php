<?php

namespace App\Filament\Widgets;

use App\Models\Laporan;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class LaporanBulananChart extends ChartWidget
{
    protected static ?string $heading = 'Grafik Laporan per Bulan';
    protected static ?string $description = 'Jumlah laporan yang masuk setiap bulan sepanjang tahun ini';
    protected static ?int $sort = 2;
    protected int|string|array $columnSpan = 'full';

    // Filter tahun yang ditampilkan
    public ?string $filter = null;

    protected function getFilters(): ?array
    {
        $years = [];
        for ($y = now()->year; $y >= now()->year - 2; $y--) {
            $years[(string) $y] = (string) $y;
        }
        return $years;
    }

    protected function getData(): array
    {
        $year = $this->filter ?? now()->year;

        $namabulan = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];

        // Inisialisasi data 12 bulan
        $menunggu = array_fill(0, 12, 0);
        $diproses = array_fill(0, 12, 0);
        $selesai  = array_fill(0, 12, 0);
        $ditolak  = array_fill(0, 12, 0);

        $driver = (new Laporan)->getConnection()->getDriverName();
        $monthExpr = $driver === 'sqlite' ? "strftime('%m', created_at)" : 'MONTH(created_at)';

        Laporan::selectRaw("{$monthExpr} as bulan, status, COUNT(*) as total")
            ->whereYear('created_at', $year)
            ->groupBy('bulan', 'status')
            ->get()
            ->each(function ($row) use (&$menunggu, &$diproses, &$selesai, &$ditolak) {
                $idx = $row->bulan - 1;
                match ($row->status) {
                    'menunggu' => $menunggu[$idx] = $row->total,
                    'diproses' => $diproses[$idx] = $row->total,
                    'selesai'  => $selesai[$idx]  = $row->total,
                    'ditolak'  => $ditolak[$idx]  = $row->total,
                    default    => null,
                };
            });

        return [
            'datasets' => [
                [
                    'label'           => 'Menunggu',
                    'data'            => $menunggu,
                    'backgroundColor' => '#f59e0b',
                    'borderRadius'    => 4,
                ],
                [
                    'label'           => 'Diproses',
                    'data'            => $diproses,
                    'backgroundColor' => '#3b82f6',
                    'borderRadius'    => 4,
                ],
                [
                    'label'           => 'Selesai',
                    'data'            => $selesai,
                    'backgroundColor' => '#10b981',
                    'borderRadius'    => 4,
                ],
                [
                    'label'           => 'Ditolak',
                    'data'            => $ditolak,
                    'backgroundColor' => '#ef4444',
                    'borderRadius'    => 4,
                ],
            ],
            'labels' => $namabulan,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display'  => true,
                    'position' => 'top',
                ],
                'tooltip' => [
                    'mode' => 'index',
                ],
            ],
            'scales' => [
                'x' => [
                    'stacked' => true,
                    'grid'    => ['display' => false],
                ],
                'y' => [
                    'stacked'    => true,
                    'beginAtZero' => true,
                    'ticks'      => ['stepSize' => 1],
                ],
            ],
            'responsive' => true,
            'maintainAspectRatio' => false,
        ];
    }
}
