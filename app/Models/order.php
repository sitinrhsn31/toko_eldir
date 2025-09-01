<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Produk;
use App\Models\Cart;
use App\Models\Ongkir;
use App\Models\Transaksi;

class Order extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * @var string
     */
    protected $table = 'order';

    /**
     * Properti yang dapat diisi secara massal.
     * @var array
     */
    protected $fillable = [
        'userId',
        'ongkirId',
        'name',
        'nohp',
        'alamat',
        'totalHarga',
        'status',
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Mengubah tipe data kolom 'status' menjadi string saat mengambil dari database.
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
     * Mendefinisikan relasi dengan model Cart.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cartId');
    }

    /**
     * Mendefinisikan relasi dengan model Ongkir.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ongkir()
    {
        return $this->belongsTo(Ongkir::class, 'ongkirId');
    }

    /**
     * Mendefinisikan relasi dengan model Transaksi.
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function transaksi()
    {
        return $this->hasOne(Transaksi::class, 'orderId');
    }

    
}
