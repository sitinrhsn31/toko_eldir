<?php

use App\Http\Controllers\FrontController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontController::class, 'welcome'])->name('home');

Route::get('/admin/order/report-monthly', [FrontController::class, 'printMonthlyReport'])->name('admin.order.report.monthly');

// Tambahkan route ini di luar grup 'front' jika perlu, agar bisa diakses oleh Midtrans
Route::post('/midtrans-callback', [FrontController::class, 'midtransCallback'])
    ->name('midtrans.callback')
    ->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

Route::post('/pesanan/{order}/ulasan', [ReviewController::class, 'store'])->middleware(['auth']);

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/front.php';
require __DIR__ . '/settings.php';
