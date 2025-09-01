<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Karena nama tabelnya 'transaksi' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'transaksi';

    /**
     * Properti yang dapat diisi secara massal.
     * @var array
     */
    protected $fillable = [
        'userId',
        'orderId',
        'produkId',
        'ongkirId',
        'status',
        'code',
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Tipe data untuk kolom 'status' (enum).
     * @var array
     */
    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Mendefinisikan relasi dengan model User.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    /**
     * Mendefinisikan relasi dengan model Order.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }

    /**
     * Mendefinisikan relasi dengan model Produk.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produkId');
    }

    /**
     * Mendefinisikan relasi dengan model Ongkir.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ongkir()
    {
        return $this->belongsTo(Ongkir::class, 'ongkirId');
    }
}
