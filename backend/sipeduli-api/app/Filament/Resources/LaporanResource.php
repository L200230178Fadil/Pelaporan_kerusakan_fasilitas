<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LaporanResource\Pages;
use App\Filament\Resources\LaporanResource\RelationManagers;
use App\Models\Laporan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanResource extends Resource
{
    protected static ?string $model = Laporan::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('role')
                    ->required(),
                Forms\Components\TextInput::make('nama')
                    ->required(),
                Forms\Components\Select::make('fakultas')
                    ->options([
                        'Fakultas Komunikasi Dan Teknik Informatika' => 'Fakultas Komunikasi Dan Teknik Informatika',
                    ]),
                Forms\Components\TextInput::make('prodi'),
                Forms\Components\Select::make('nama_fasilitas')
                    ->options([
                        'kursi' => 'kursi',
                        'Meja' => 'Meja',
                        'Monitor' => 'Monitor',
                        'Proyektor' => 'Proyektor',
                        'Papan tulis' => 'Papan tulis',
                        'pintu Kelas' => 'pintu Kelas',
                        'AC' => 'AC',
                        'smart tv' => 'smart tv',
                        'LCD' => 'LCD',
                        'Lainnya' => 'Lainnya',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('tempat')
                    ->required(),
                Forms\Components\Textarea::make('deskripsi')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('foto_path')
                    ->image()
                    ->directory('laporan-fotos'),
                Forms\Components\TextInput::make('foto_url')
                    ->url(),
                Forms\Components\Select::make('status')
                    ->options([
                        'menunggu' => 'Menunggu',
                        'diproses' => 'Diproses',
                        'selesai' => 'Selesai',
                        'ditolak' => 'Ditolak',
                    ])
                    ->default('menunggu')
                    ->required(),
                Forms\Components\Section::make('Progres Perbaikan (Admin)')
                    ->schema([
                        Forms\Components\FileUpload::make('foto_perbaikan_path')
                            ->image()
                            ->directory('perbaikan-fotos')
                            ->label('Foto Setelah Perbaikan'),
                        Forms\Components\Textarea::make('keterangan_perbaikan')
                            ->label('Keterangan Perbaikan')
                            ->placeholder('Jelaskan apa yang telah diperbaiki...'),
                    ])
                    ->collapsed(fn ($record) => $record?->status !== 'selesai'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('role')
                    ->searchable(),
                Tables\Columns\TextColumn::make('nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('fakultas')
                    ->searchable(),
                Tables\Columns\TextColumn::make('prodi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('nama_fasilitas')
                    ->searchable(),
                Tables\Columns\TextColumn::make('tempat')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('foto_path')
                    ->label('Foto Laporan'),
                Tables\Columns\ImageColumn::make('foto_perbaikan_path')
                    ->label('Foto Perbaikan'),
                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'menunggu' => 'Menunggu',
                        'diproses' => 'Diproses',
                        'selesai' => 'Selesai',
                        'ditolak' => 'Ditolak',
                    ])
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('download_pdf')
                    ->label('Download PDF')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('info')
                    ->action(function (Laporan $record) {
                        $pdf = Pdf::loadView('pdf.laporan', ['laporan' => $record]);
                        
                        return response()->streamDownload(function () use ($pdf) {
                            echo $pdf->output();
                        }, "laporan-{$record->id}.pdf");
                    }),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLaporans::route('/'),
            'create' => Pages\CreateLaporan::route('/create'),
            'edit' => Pages\EditLaporan::route('/{record}/edit'),
        ];
    }
}
