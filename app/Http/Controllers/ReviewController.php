<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Tampilkan daftar sumber daya.
     */
    public function index()
    {
        // Ambil data ulasan dengan relasi user
        $reviews = Review::with('user')->paginate(10);

        // Ambil data untuk dropdown di form
        $usersList = User::all(['id', 'name']);

        return Inertia::render('review/index', [
            'reviews' => $reviews,
            'usersList' => $usersList,
        ]);
    }

    /**
     * Tampilkan formulir untuk membuat sumber daya baru.
     */
    public function create()
    {
        // Mengubah ini untuk Inertia, meskipun tidak digunakan di form
        return Inertia::render('Review/Create');
    }

    /**
     * Store a new review for a product.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Order $order
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Order $order)
    {
        // 1. Validasi input dari frontend
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'ulasan' => ['required', 'string', 'max:1000'],
            'produkId' => ['required', 'integer'],
        ]);

        // 2. Memastikan user yang mengirim ulasan sama dengan pemilik pesanan
        if ($order->userId !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki hak untuk memberikan ulasan pada pesanan ini.'], 403);
        }

        // 3. Memastikan status pesanan sudah 'selesai'
        if ($order->status !== 'selesai') {
            return response()->json(['message' => 'Ulasan hanya dapat diberikan pada pesanan yang sudah selesai.'], 403);
        }

        // 4. Memastikan produk yang diulas ada di dalam pesanan ini
        $transaksi = Transaksi::where('orderId', $order->id)
            ->where('produkId', $request->produkId)
            ->first();

        if (!$transaksi) {
            return response()->json(['message' => 'Produk ini tidak ditemukan di dalam pesanan Anda.'], 404);
        }

        // 5. Memastikan user belum pernah memberikan ulasan pada produk yang sama
        if (Review::where('userId', Auth::id())->where('produkId', $request->produkId)->exists()) {
            return response()->json(['message' => 'Anda sudah memberikan ulasan untuk produk ini.'], 409);
        }

        // 6. Menyimpan ulasan ke database
        try {
            Review::create([
                'userId' => Auth::id(),
                'produkId' => $request->produkId,
                'rating' => $request->rating,
                'ulasan' => $request->ulasan,
                // Mengubah 'orderId' menjadi 'produkId' di sini
            ]);

            return inertia::location(route('front.pesanan.detail', ['order' => $order->id]));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan ulasan: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tampilkan sumber daya yang ditentukan.
     */
    public function show(Review $review)
    {
        // Mengubah ini untuk Inertia
        return Inertia::render('Review/Show', compact('review'));
    }

    /**
     * Tampilkan formulir untuk mengedit sumber daya yang ditentukan.
     */
    public function edit(Review $review)
    {
        // Mengubah ini untuk Inertia
        return Inertia::render('Review/Edit', compact('review'));
    }

    /**
     * Perbarui sumber daya yang ditentukan di penyimpanan.
     */
    public function update(Request $request, Review $review)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'ulasan' => 'required|string',
        ]);

        $review->update($validatedData);

        return redirect()->route('review.index')
            ->with('success', 'Ulasan berhasil diperbarui.');
    }

    /**
     * Hapus sumber daya yang ditentukan dari penyimpanan.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('review.index')
            ->with('success', 'Ulasan berhasil dihapus.');
    }
}
