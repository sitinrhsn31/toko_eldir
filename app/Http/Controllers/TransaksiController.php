<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\User;
use App\Models\Order;
use App\Models\Ongkir;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    /**
     * Tampilkan daftar sumber daya.
     */
    public function index()
    {
        // Ambil data transaksi dengan relasi user, order, dan ongkir
        $transaksis = Transaksi::with(['user', 'order', 'produk', 'ongkir'])->paginate(10);

        // Ambil data untuk dropdown di form
        $usersList = User::all(['id', 'name']);
        $ordersList = Order::all(['id']); // Asumsi Anda hanya butuh ID untuk order
        $ongkirsList = Ongkir::all(['id', 'name']);

        return Inertia::render('transaksi/index', [
            'transaksis' => $transaksis,
            'usersList' => $usersList,
            'ordersList' => $ordersList,
            'ongkirsList' => $ongkirsList,
        ]);
    }

    /**
     * Tampilkan formulir untuk membuat sumber daya baru.
     */
    public function create()
    {
        // Mengubah ini untuk Inertia, meskipun tidak digunakan di form
        return Inertia::render('Transaksi/Create');
    }

    /**
     * Simpan sumber daya yang baru dibuat di penyimpanan.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'orderId' => 'required|exists:order,id',
            'ongkirId' => 'required|exists:ongkir,id',
            'status' => 'required|in:belum,bayar,tolak',
            'code' => 'required|string|max:255',
        ]);

        Transaksi::create($validatedData);

        return redirect()->route('transaksi.index')
                         ->with('success', 'Transaksi berhasil ditambahkan.');
    }

    /**
     * Tampilkan sumber daya yang ditentukan.
     */
    public function show(Transaksi $transaksi)
    {
        // Mengubah ini untuk Inertia
        return Inertia::render('Transaksi/Show', compact('transaksi'));
    }

    /**
     * Tampilkan formulir untuk mengedit sumber daya yang ditentukan.
     */
    public function edit(Transaksi $transaksi)
    {
        // Mengubah ini untuk Inertia
        return Inertia::render('Transaksi/Edit', compact('transaksi'));
    }

    /**
     * Perbarui sumber daya yang ditentukan di penyimpanan.
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'orderId' => 'required|exists:order,id',
            'ongkirId' => 'required|exists:ongkir,id',
            'status' => 'required|in:belum,bayar,tolak',
            'code' => 'required|string|max:255',
        ]);

        $transaksi->update($validatedData);

        return redirect()->route('transaksi.index')
                         ->with('success', 'Transaksi berhasil diperbarui.');
    }

    /**
     * Hapus sumber daya yang ditentukan dari penyimpanan.
     */
    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();

        return redirect()->route('transaksi.index')
                         ->with('success', 'Transaksi berhasil dihapus.');
    }
}
