<?php

use App\Http\Controllers\FrontController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'front', 'as' => 'front.'], function () {
    Route::get('/produk', [FrontController::class, 'produk'])->name('produk');

    Route::get('/produk/{produk}', [FrontController::class, 'produkdetail'])->name('produk.show');

    Route::get('/kategori', [FrontController::class, 'kategori'])->name('kategori');

    Route::get('/tentang-kami', [FrontController::class, 'tentangkami'])->name('tentang-kami');

    Route::get('/keranjang', [FrontController::class, 'cart'])->name('keranjang');
    Route::put('/keranjang/update/{cart}', [FrontController::class, 'updateJumlahCart'])->name('cart.update');
    Route::delete('/keranjang/destroy/{cart}', [FrontController::class, 'destroyCart'])->name('cart.destroy');

    Route::post('/keranjang/add', [FrontController::class, 'addToCart'])->name('keranjang.store');

    Route::get('/checkout', [FrontController::class, 'checkout'])->name('checkout');

    Route::post('/checkout/process', [FrontController::class, 'checkoutProcess'])->name('checkout.process');

    Route::get('/transaksi', [FrontController::class, 'transaksi'])->name('transaksi');

    Route::get('/pesanan', [FrontController::class, 'pesanan'])->name('pesanan');

    Route::get('/pesanan/{order}', [FrontController::class, 'pesanandetail'])->name('pesanan.detail');
});
