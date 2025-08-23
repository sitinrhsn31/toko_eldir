<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Secara default, Laravel akan menggunakan nama jamak dari nama model.
     * Karena nama tabelnya 'category' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'category';

    /**
     * Properti yang dapat diisi secara massal (mass assignable).
     * Kolom 'name' adalah satu-satunya kolom yang perlu kita lindungi.
     * @var array
     */
    protected $fillable = [
        'name',
    ];
}
