<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FrontController extends Controller
{
    public function welcome()
    {
        // Mengambil 4 produk paling baru dari database
        $produksTerbaru = Produk::latest()->take(4)->get();

        return Inertia::render('welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produksTerbaru' => $produksTerbaru,
        ]);
    }

    public function produk()
    {
        $semuaProduk = Produk::all();
        return Inertia::render('produk', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'semuaProduk' => $semuaProduk,
        ]);
    }

    public function produkdetail(Produk $produk)
    {
        return Inertia::render('ProdukDetail', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produk' => $produk,
        ]);
    }

    public function kategori()
    {
        $category = Category::all();
        return Inertia::render('kategori', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'kategori' => $category,
        ]);
    }

    public function tentangkami()
    {
        return Inertia::render('tentang-kami', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    public function cart()
    {
        // Mendapatkan ID pengguna yang sedang login
        $userId = Auth::id();

        // Mengambil data keranjang berdasarkan userId dan menjumlahkan harga
        $cart = Cart::where('userId', $userId)->with('produk')->get();
        $totalHarga = $cart->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        return Inertia::render('cart', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cartItems' => $cart,
            'totalHarga' => $totalHarga,
        ]);
    }

    public function checkout()
    {
        //
    }

    public function transaksi()
    {
        //
    }
}
