<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Cart;
use App\Models\Ongkir;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Tampilkan daftar sumber daya.
     */
    public function index()
    {
        $orders = Order::with(['user', 'cart', 'ongkir'])->paginate(10);
        $usersList = User::all(['id', 'name']);
        $cartsList = Cart::all(['id', 'jumlah']);
        $ongkirsList = Ongkir::all(['id', 'name']);

        return Inertia::render('order/index', [
            'orders' => $orders,
            'usersList' => $usersList,
            'cartsList' => $cartsList,
            'ongkirsList' => $ongkirsList,
        ]);
    }

    /**
     * Simpan sumber daya yang baru dibuat di penyimpanan.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'cartId' => 'required|exists:cart,id',
            'ongkirId' => 'required|exists:ongkir,id',
            'name' => 'required|string|max:255',
            'nohp' => 'required|integer',
            'alamat' => 'required|string',
            'totalHarga' => 'required|numeric',
            'status' => 'required|in:belum,proses,kirim,selesai',
        ]);

        Order::create($validatedData);

        return redirect()->route('order.index')
                         ->with('success', 'Order berhasil ditambahkan.');
    }

    /**
     * Perbarui sumber daya yang ditentukan di penyimpanan.
     */
    public function update(Request $request, Order $order)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'cartId' => 'required|exists:cart,id',
            'ongkirId' => 'required|exists:ongkir,id',
            'name' => 'required|string|max:255',
            'nohp' => 'required|integer',
            'alamat' => 'required|string',
            'totalHarga' => 'required|numeric',
            'status' => 'required|in:belum,proses,kirim,selesai',
        ]);

        $order->update($validatedData);

        return redirect()->route('order.index')
                         ->with('success', 'Order berhasil diperbarui.');
    }

    /**
     * Hapus sumber daya yang ditentukan dari penyimpanan.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('order.index')
                         ->with('success', 'Order berhasil dihapus.');
    }
}
