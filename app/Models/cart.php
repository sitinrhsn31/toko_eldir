<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Secara default, Laravel akan menggunakan nama jamak dari nama model.
     * Karena nama tabelnya 'cart' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'cart';

    /**
     * Properti yang dapat diisi secara massal.
     * @var array
     */
    protected $fillable = [
        'produkId',
        'userId',
        'jumlah',
        'totalHarga',
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Mendefinisikan relasi dengan model Produk.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produkId');
    }

    /**
     * Mendefinisikan relasi dengan model User.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
