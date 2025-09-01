<?php

namespace App\Providers;

use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyCsrfToken::except([
            'midtrans-callback',
            'front/midtrans-callback' // Tambahkan kedua rute ini untuk memastikan
        ]);
    }
}
