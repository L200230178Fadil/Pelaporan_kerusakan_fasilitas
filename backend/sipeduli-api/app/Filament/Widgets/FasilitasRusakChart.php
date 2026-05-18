<?php

namespace App\Filament\Widgets;

use App\Models\Laporan;
use Filament\Widgets\ChartWidget;

class FasilitasRusakChart extends ChartWidget
{
    protected static ?string $heading = 'Diagram Fasilitas Paling Sering Rusak';
    protected static ?string $description = 'Persentase laporan berdasarkan jenis fasilitas yang dilaporkan rusak';
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 'full';

    // Filter bulan (opsional)
    public ?string $filter = 'all';

    protected function getFilters(): ?array
    {
        return [
            'all' => 'Semua Waktu',
            '1'   => 'Januari',
            '2'   => 'Februari',
            '3'   => 'Maret',
            '4'   => 'April',
            '5'   => 'Mei',
            '6'   => 'Juni',
            '7'   => 'Juli',
            '8'   => 'Agustus',
            '9'   => 'September',
            '10'  => 'Oktober',
            '11'  => 'November',
            '12'  => 'Desember',
        ];
    }

    protected function getData(): array
    {
        $query = Laporan::selectRaw('nama_fasilitas, COUNT(*) as total')
            ->groupBy('nama_fasilitas')
            ->orderByDesc('total');

        // Terapkan filter bulan jika bukan 'all'
        if ($this->filter && $this->filter !== 'all') {
            $query->whereMonth('created_at', (int) $this->filter)
                  ->whereYear('created_at', now()->year);
        }

        $data = $query->get();

        $labels = $data->pluck('nama_fasilitas')->toArray();
        $counts = $data->pluck('total')->toArray();

        // Palet warna harmonis
        $colors = [
            '#6366f1', // indigo
            '#f59e0b', // amber
            '#10b981', // emerald
            '#ef4444', // red
            '#3b82f6', // blue
            '#8b5cf6', // violet
            '#f97316', // orange
            '#06b6d4', // cyan
            '#ec4899', // pink
        ];

        // Pastikan jumlah warna cukup
        while (count($colors) < count($labels)) {
            $colors = array_merge($colors, $colors);
        }
        $bgColors = array_slice($colors, 0, count($labels));

        return [
            'datasets' => [
                [
                    'label'           => 'Jumlah Laporan',
                    'data'            => $counts,
                    'backgroundColor' => $bgColors,
                    'borderWidth'     => 2,
                    'borderColor'     => '#ffffff',
                    'hoverOffset'     => 8,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display'  => true,
                    'position' => 'right',
                    'labels'   => [
                        'padding'     => 16,
                        'usePointStyle' => true,
                        'pointStyle'  => 'circle',
                    ],
                ],
                'tooltip' => [
                    'callbacks' => [
                        // Callback dihandle Chart.js secara otomatis untuk persentase
                    ],
                ],
            ],
            'cutout'  => '60%',
            'responsive' => true,
            'maintainAspectRatio' => false,
        ];
    }
}
