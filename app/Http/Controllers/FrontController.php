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
            'user' => Auth::user(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produksTerbaru' => $produksTerbaru,
        ]);
    }

    public function produk(Request $request)
    {
        // Mengambil parameter categoryId dari URL
        $categoryId = $request->query('categoryId');

        // Inisialisasi query builder
        $query = Produk::query();

        // Jika parameter categoryId ada, tambahkan filter ke query
        if ($categoryId) {
            $query->where('categoryId', $categoryId);
        }

        // Ambil data produk dengan paginasi (10 data per halaman)
        $produks = $query->paginate(10);

        // Ambil semua kategori untuk Select
        $categoriesList = Category::all();

        return Inertia::render('produk', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produks' => $produks,
            'categoriesList' => $categoriesList, // Kirim categoriesList ke view
        ]);
    }

    public function produkdetail(Produk $produk)
    {
        return Inertia::render('produkdetail', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produk' => $produk->load('category'), // Gunakan load() untuk memuat relasi
        ]);
    }

    // Metode baru untuk menyimpan data ke keranjang
    public function addToCart(Request $request)
    {
        // Validasi input
        $request->validate([
            'produkId' => 'required|exists:produk,id',
            'jumlah' => 'required|integer|min:1',
        ]);

        // Cek apakah produk sudah ada di keranjang user
        $cartItem = Cart::where('userId', Auth::id())
            ->where('produkId', $request->produkId)
            ->first();

        if ($cartItem) {
            // Jika sudah ada, update jumlahnya
            $cartItem->jumlah += $request->jumlah;
            $cartItem->save();
        } else {
            // Jika belum ada, buat entri baru
            Cart::create([
                'produkId' => $request->produkId,
                'userId' => Auth::id(),
                'jumlah' => $request->jumlah,
            ]);
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function kategori()
    {
        $categories = Category::all();
        return Inertia::render('kategori', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'categories' => $categories, // Ubah nama variabel menjadi `categories` agar lebih jelas
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
