<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransaksiController;
// use App\Http\Controllers\CartController;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::resource('dashboard', DashboardController::class);
    Route::resource('category', CategoryController::class);
    Route::resource('produk', ProdukController::class);
    Route::resource('order', OrderController::class);
    Route::resource('transaksi', TransaksiController::class);
    // Route::resource('cart', CartController::class);
    Route::resource('ongkir', OngkirController::class);
    Route::resource('review', ReviewController::class);
});
