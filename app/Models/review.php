<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     * Secara default, Laravel akan menggunakan nama jamak dari nama model.
     * Karena nama tabelnya 'review' (tunggal), kita perlu menentukannya secara eksplisit.
     * @var string
     */
    protected $table = 'review';

    /**
     * Properti yang dapat diisi secara massal.
     * @var array
     */
    protected $fillable = [
        'userId',
        'rating',
        'ulasan',
    ];

    /**
     * Properti yang tidak dapat diisi secara massal.
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * Mendefinisikan relasi dengan model User.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
