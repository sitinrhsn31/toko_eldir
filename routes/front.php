<?php

use App\Http\Controllers\FrontController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'front', 'as' => 'front.'], function () {
    Route::get('/produk', [FrontController::class, 'produk'])->name('produk');


    Route::get('/produk/{id}', [FrontController::class, 'produkdetail'])->name('produk.show');

    Route::get('/kategori', [FrontController::class, 'kategori'])->name('kategori');

    Route::get('/tentang-kami', [FrontController::class, 'tentangkami'])->name('tentang-kami');

    Route::get('/keranjang', [FrontController::class, 'cart'])->name('keranjang');

    Route::get('/checkout', [FrontController::class, 'checkout'])->name('checkout');

    Route::get('/transaksi', [FrontController::class, 'transaksi'])->name('transaksi');
});
