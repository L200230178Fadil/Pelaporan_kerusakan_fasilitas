<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Kerusakan #{{ $laporan->id }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 0; }
        .container { padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
        .title { color: #2563eb; font-size: 26px; margin: 0; font-weight: bold; }
        .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
        
        .grid { width: 100%; margin-bottom: 20px; }
        .col { vertical-align: top; padding-bottom: 15px; }
        
        .label { font-weight: bold; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #1e293b; }
        
        .box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
        .box-success { background: #f0fdf4; border-color: #bbf7d0; }
        
        .photos { width: 100%; margin-top: 20px; }
        .photo-item { width: 48%; display: inline-block; vertical-align: top; }
        .photo-img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; border: 1px solid #cbd5e1; }
        .photo-label { text-align: center; font-size: 12px; color: #64748b; margin-top: 8px; font-style: italic; }
        
        .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-selesai { background: #dcfce7; color: #166534; }
        .status-proses { background: #dbeafe; color: #1d4ed8; }
        .status-tunggu { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">SIPEDULI - LAPORAN FASILITAS</div>
            <div class="subtitle">Universitas Muhammadiyah Surakarta · Gedung J</div>
        </div>

        <table class="grid">
            <tr>
                <td class="col" width="50%">
                    <div class="label">ID Laporan</div>
                    <div class="value">#{{ str_pad($laporan->id, 5, '0', STR_PAD_LEFT) }}</div>
                </td>
                <td class="col" width="50%">
                    <div class="label">Tanggal Laporan</div>
                    <div class="value">{{ $laporan->created_at->format('d F Y, H:i') }}</div>
                </td>
            </tr>
            <tr>
                <td class="col">
                    <div class="label">Nama Pelapor</div>
                    <div class="value">{{ $laporan->nama }}</div>
                    <div style="font-size: 12px; color: #64748b;">{{ ucfirst($laporan->role) }} {{ $laporan->prodi ? '· ' . $laporan->prodi : '' }}</div>
                </td>
                <td class="col">
                    <div class="label">Status</div>
                    <div class="status-badge status-{{ $laporan->status === 'menunggu' ? 'tunggu' : ($laporan->status === 'diproses' ? 'proses' : 'selesai') }}">
                        {{ $laporan->status }}
                    </div>
                </td>
            </tr>
        </table>

        <div class="box">
            <div class="label">Fasilitas & Lokasi</div>
            <div class="value"><strong>{{ $laporan->nama_fasilitas }}</strong> di {{ $laporan->tempat }}</div>
        </div>

        <div class="box">
            <div class="label">Deskripsi Kerusakan</div>
            <div class="value" style="font-style: italic;">"{{ $laporan->deskripsi }}"</div>
        </div>

        @if($laporan->keterangan_perbaikan)
        <div class="box box-success">
            <div class="label" style="color: #166534;">Catatan Perbaikan (Admin)</div>
            <div class="value">{{ $laporan->keterangan_perbaikan }}</div>
        </div>
        @endif

        <div class="photos">
            @if($laporan->foto_path)
            <div class="photo-item" style="margin-right: 2%;">
                <div class="label">Foto Awal Kerusakan</div>
                <img src="{{ public_path('storage/' . $laporan->foto_path) }}" class="photo-img">
                <div class="photo-label">Bukti laporan dari pelapor</div>
            </div>
            @endif

            @if($laporan->foto_perbaikan_path)
            <div class="photo-item">
                <div class="label">Foto Hasil Perbaikan</div>
                <img src="{{ public_path('storage/' . $laporan->foto_perbaikan_path) }}" class="photo-img">
                <div class="photo-label">Bukti perbaikan oleh pengelola</div>
            </div>
            @endif
        </div>

        <div class="footer">
            Dokumen ini dihasilkan secara otomatis oleh Sistem SiPeduli UMS pada {{ date('d/m/Y H:i') }}.
        </div>
    </div>
</body>
</html>
