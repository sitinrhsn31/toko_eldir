<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
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
     * Simpan sumber daya yang baru dibuat di penyimpanan.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'ulasan' => 'required|string',
        ]);

        Review::create($validatedData);

        return redirect()->route('review.index')
                         ->with('success', 'Ulasan berhasil ditambahkan.');
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
