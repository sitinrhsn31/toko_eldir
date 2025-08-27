<?php

use App\Http\Controllers\FrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontController::class, 'welcome'])->name('home');

Route::get('/admin/order/report-monthly', [FrontController::class, 'printMonthlyReport'])->name('admin.order.report.monthly');

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/front.php';
require __DIR__ . '/settings.php';
