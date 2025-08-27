<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Ongkir;
use App\Models\Order;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;
use Dompdf\Dompdf;

use Inertia\Inertia;

class FrontController extends Controller
{
    public function welcome()
    {
        $alrLogin = !Auth::check();

        // Mengambil 4 produk paling baru dari database
        $produksTerbaru = Produk::latest()->take(4)->get();

        return Inertia::render('welcome', [
            'alrLogin' => $alrLogin,
            'user' => Auth::user(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produksTerbaru' => $produksTerbaru,
        ]);
    }

    public function produk(Request $request)
    {
        $alrLogin = !Auth::check();

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
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produks' => $produks,
            'categoriesList' => $categoriesList, // Kirim categoriesList ke view
        ]);
    }

    public function produkdetail(Produk $produk)
    {
        $alrLogin = !Auth::check();
        return Inertia::render('produkdetail', [
            'alrLogin' => $alrLogin,
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
            'ukuran' => 'required|string',
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
                'ukuran' => $request->ukuran
            ]);
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function tentangkami()
    {
        $alrLogin = !Auth::check();
        return Inertia::render('tentang-kami', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    public function cart()
    {
        $alrLogin = !Auth::check();

        // Mendapatkan ID pengguna yang sedang login
        $userId = Auth::id();

        // Mengambil data keranjang berdasarkan userId dan menjumlahkan harga
        $cart = Cart::where('userId', $userId)->with('produk')->get();
        $totalHarga = $cart->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        return Inertia::render('cart', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cartItems' => $cart,
            'totalHarga' => $totalHarga,
        ]);
    }

    public function updateJumlahCart(Request $request)
    {
        $request->validate([
            'cartId' => ['required', 'integer'],
            'jumlah' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem = Cart::where('id', $request->cartId)
            ->where('userId', Auth::id())
            ->first();

        if (!$cartItem) {
            return redirect()->back(); // Arahkan kembali jika item tidak ditemukan
        }

        $cartItem->jumlah = $request->jumlah;
        $cartItem->save();

        // Mengambil ulang data keranjang dan total harga setelah perubahan
        $cart = Cart::where('userId', Auth::id())->with('produk')->get();
        $totalHarga = $cart->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        return Inertia::location(route('front.keranjang'));
    }

    public function destroyCart(Cart $cart)
    {
        // Memastikan item yang dihapus milik pengguna yang sedang login
        if ($cart->userId !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $cart->delete();

        // Mengambil ulang data keranjang dan total harga setelah penghapusan
        $cart = Cart::where('userId', Auth::id())->with('produk')->get();

        $alrLogin = !Auth::check();

        // Mendapatkan ID pengguna yang sedang login
        $userId = Auth::id();

        // Mengambil data keranjang berdasarkan userId dan menjumlahkan harga
        $cart = Cart::where('userId', $userId)->with('produk')->get();
        $totalHarga = $cart->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        return Inertia::location(route('front.keranjang'));
    }

    public function checkout()
    {
        $cart = Cart::where('userId', Auth::id())->with('produk')->get();
        $ongkir = Ongkir::all();
        $alrLogin = !Auth::check();
        return Inertia::render('checkout', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cart' => $cart,
            'ongkir' => $ongkir
        ]);
    }

    public function checkoutProcess(Request $request)
    {
        // Validasi data yang masuk dari front-end
        $request->validate([
            'items' => 'required|array',
            'items.*.id_produk' => 'required|exists:produk,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga' => 'required|numeric',
            'ongkir.id' => 'required|exists:ongkir,id',
            'ongkir.jasa' => 'required|string',
            'ongkir.biaya' => 'required|numeric',
            'total_bayar' => 'required|numeric',
            'shipping_info.nama' => 'required|string',
            'shipping_info.nohp' => 'required|string',
            'shipping_info.alamat' => 'required|string',
        ]);

        // Mengambil data user yang sedang login
        $user = Auth::user();

        // Mulai transaksi database
        DB::beginTransaction();

        try {
            // 1. Buat order baru
            $order = Order::create([
                'userId' => $user->id,
                'ongkirId' => $request->ongkir['id'],
                'name' => $request->shipping_info['nama'],
                'nohp' => $request->shipping_info['nohp'],
                'alamat' => $request->shipping_info['alamat'],
                'totalHarga' => $request->total_bayar,
                'status' => 'belum',
            ]);

            // 2. Konfigurasi Midtrans
            Config::$serverKey = config('services.midtrans.serverKey');
            Config::$isProduction = config('services.midtrans.isProduction');
            Config::$isSanitized = true;
            Config::$is3ds = true;

            // Siapkan detail transaksi untuk Midtrans
            $midtransParams = [
                'transaction_details' => [
                    'order_id' => 'ORDER-' . $order->id,
                    'gross_amount' => $request->total_bayar,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $request->shipping_info['nohp'],
                ],
                'item_details' => array_map(function ($item) {
                    return [
                        'id' => $item['id_produk'],
                        'price' => $item['harga'],
                        'quantity' => $item['jumlah'],
                        'name' => 'Produk',
                    ];
                }, $request->items),
            ];

            // Tambahkan biaya pengiriman ke item details
            $midtransParams['item_details'][] = [
                'id' => 'shipping-' . $order->ongkirId,
                'price' => $request->ongkir['biaya'],
                'quantity' => 1,
                'name' => 'Biaya Pengiriman ' . $request->ongkir['jasa'],
            ];

            $snapToken = Snap::getSnapToken($midtransParams);

            // 3. Buat entri transaksi baru
            Transaksi::create([
                'userId' => $user->id,
                'orderId' => $order->id,
                'produkId' => $request->items[0]['id_produk'],
                'ongkirId' => $order->ongkirId,
                'status' => 'belum',
                'code' => $snapToken,
            ]);

            // 4. Hapus item dari keranjang
            Cart::where('userId', $user->id)->delete();

            // Commit transaksi database
            DB::commit();

            // 5. Kirim snap token kembali ke front-end
            // return Inertia::location(route('front.transaksi', ['order_id' => $order->id]));
            return response()->json([
                'snapToken' => $snapToken,
                'orderId' => $order->id, // Kirim order ID juga jika diperlukan di front-end
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi jika ada kesalahan
            DB::rollBack();

            dd($e);
            // Tangani kesalahan Midtrans dengan mengembalikan respons Inertia
            return back()->with('error', $e->getMessage());
        }
    }

    public function midtransCallback(Request $request)
    {
        // 1. Konfigurasi Midtrans
        Config::$isProduction = config('services.midtrans.isProduction');
        Config::$serverKey = config('services.midtrans.serverKey');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // 2. Buat instance notifikasi Midtrans
        try {
            $notif = new Notification();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // 3. Ambil data notifikasi
        $transaction = $notif->transaction_status;
        $orderId = $notif->order_id;
        $fraud = $notif->fraud_status;

        // 4. Periksa apakah order ID valid
        // Hapus prefix 'ORDER-' saat mencari order
        $originalOrderId = substr($orderId, strlen('ORDER-'));
        $order = Order::where('id', $originalOrderId)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // 5. Logika untuk mengubah status transaksi
        if ($transaction == 'capture') {
            // Untuk pembayaran dengan kartu kredit
            if ($fraud == 'challenge') {
                // Status penipuan (fraud), ubah status order menjadi 'challenge'
                $order->status = 'challenge';
            } else if ($fraud == 'accept') {
                // Pembayaran berhasil, ubah status order menjadi 'success'
                $order->status = 'paid';
            }
        } else if ($transaction == 'settlement') {
            // Pembayaran berhasil (selain kartu kredit), ubah status order menjadi 'paid'
            $order->status = 'paid';
        } else if ($transaction == 'pending') {
            // Transaksi sedang menunggu pembayaran
            $order->status = 'pending';
        } else if ($transaction == 'deny') {
            // Transaksi ditolak
            $order->status = 'denied';
        } else if ($transaction == 'expire') {
            // Transaksi kadaluarsa
            $order->status = 'expired';
        } else if ($transaction == 'cancel') {
            // Transaksi dibatalkan
            $order->status = 'cancelled';
        }

        // 6. Simpan perubahan status
        $order->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

    public function transaksi()
    {
        // Mendapatkan semua transaksi yang dimiliki oleh pengguna yang sedang login
        $transaksis = Transaksi::where('userId', Auth::id())
            ->with(['order', 'ongkir'])
            ->get();

        return Inertia::render('transaksi', [
            'alrLogin' => !Auth::check(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'transaksis' => $transaksis,
        ]);
    }

    public function pesanan()
    {
        // Mendapatkan semua pesanan yang dimiliki oleh pengguna yang sedang login
        $orders = Order::where('userId', Auth::id())
            ->with('ongkir') // Jika Anda ingin menampilkan nama jasa kirim
            ->latest()
            ->get();

        return Inertia::render('pesanan', [
            'alrLogin' => !Auth::check(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'orders' => $orders,
        ]);
    }

    public function printMonthlyReport(Request $request)
    {
        // Validasi input bulan dan tahun
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|digits:4',
        ]);

        $month = $request->input('month');
        $year = $request->input('year');

        // Mendapatkan pesanan yang sudah selesai dalam periode yang dipilih
        $orders = Order::where('status', 'selesai')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->with(['user', 'ongkir'])
            ->get();

        $html = view('pdf.report', compact('orders', 'month', 'year'))->render();

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);

        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $dompdf->stream('Laporan_Pesanan_Selesai_' . $year . '-' . $month . '.pdf', ['Attachment' => false]);
    }
}
