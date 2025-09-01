<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Secara default, Laravel akan menggunakan nama jamak dari nama model.
     * Karena nama tabelnya 'produk' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'produk';

    /**
     * Properti yang dapat diisi secara massal (mass assignable).
     * @var array
     */
    protected $fillable = [
        'categoryId',
        'nama',
        'deskripsi',
        'harga',
        'stok',
        'ukuran',
        'foto', // Memastikan foto dapat diisi
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * Jika Anda ingin mengizinkan semua kolom diisi, gunakan:
     * protected $guarded = [];
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Mengubah tipe data kolom 'ukuran' menjadi array saat mengambil dari database.
     * @var array
     */
    protected $casts = [
        'ukuran' => 'array',
    ];

    /**
     * Mendefinisikan relasi dengan model Category.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    /**
     * Mendefinisikan relasi dengan model Cart.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cart()
    {
        return $this->hasMany(Cart::class, 'produkId');
    }

    /**
     * Mendefinisikan relasi dengan model Transaksi.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'produkId');
    }
    
    // Relasi baru untuk ulasan
    public function reviews()
    {
        return $this->hasMany(Review::class, 'produkId');
    }
}
