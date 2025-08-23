<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ongkir extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Karena nama tabelnya 'ongkir' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'ongkir';

    /**
     * Properti yang dapat diisi secara massal.
     * @var array
     */
    protected $fillable = [
        'name',
        'biaya',
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * @var array
     */
    protected $guarded = ['id'];
}
