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
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class FrontController extends Controller
{
    public function welcome()
    {
        $alrLogin = !Auth::check();

        // Mengambil 4 produk paling baru dari database
        $produksTerbaru = Produk::latest()->take(4)->get();

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('welcome', [
            'alrLogin' => $alrLogin,
            'user' => Auth::user(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produksTerbaru' => $produksTerbaru,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
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

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('produk', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produks' => $produks,
            'categoriesList' => $categoriesList, // Kirim categoriesList ke view
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
        ]);
    }

    public function produkdetail(Produk $produk)
    {
        $alrLogin = Auth::check();

        // Memuat relasi 'category' dan 'reviews.user'
        $produk->load(['category', 'reviews.user']);

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('produkdetail', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'produk' => $produk,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
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

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('tentang-kami', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
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

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('cart', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cartItems' => $cart,
            'totalHarga' => $totalHarga,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
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

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('checkout', [
            'alrLogin' => $alrLogin,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'cart' => $cart,
            'ongkir' => $ongkir,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
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

        // Mulai transaksi database untuk memastikan semua operasi berhasil atau gagal bersamaan
        DB::beginTransaction();

        try {
            // Cek stok dan kurangi stok produk di awal
            foreach ($request->items as $item) {
                // Mengunci baris produk untuk menghindari race condition
                $produk = Produk::lockForUpdate()->find($item['id_produk']);

                // Pastikan produk ada dan stok cukup
                if (!$produk || $produk->stok < $item['jumlah']) {
                    throw new \Exception('Stok untuk produk ' . $produk->nama_produk . ' tidak mencukupi.');
                }

                // Kurangi stok produk
                $produk->stok -= $item['jumlah'];
                $produk->save();
            }

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

            // Generate order ID yang lebih unik untuk Midtrans
            $midtransOrderId = 'ORDER-' . $order->id . '-' . uniqid();

            // Siapkan detail transaksi untuk Midtrans
            $midtransParams = [
                'transaction_details' => [
                    'order_id' => $midtransOrderId,
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
                        // Anda mungkin perlu mengambil nama produk dari database jika tidak dikirim dari front-end
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

            // 3. Buat entri transaksi baru untuk setiap produk
            foreach ($request->items as $item) {
                Transaksi::create([
                    'userId' => $user->id,
                    'orderId' => $order->id,
                    'produkId' => $item['id_produk'],
                    'jumlah' => $item['jumlah'],
                    'harga' => $item['harga'],
                    'ongkirId' => $order->ongkirId,
                    'status' => 'belum',
                    'code' => $snapToken,
                ]);
            }

            // 4. Hapus item dari keranjang setelah berhasil
            Cart::where('userId', $user->id)->delete();

            // Commit transaksi database
            DB::commit();

            // 5. Kirim snap token dan order ID kembali ke front-end
            return response()->json([
                'snapToken' => $snapToken,
                'orderId' => $order->id,
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi jika ada kesalahan
            DB::rollBack();

            // Tangani kesalahan dengan mengembalikan respons yang jelas
            return response()->json([
                'error' => 'Midtrans API is returning API error. HTTP status code: 400 API response: ' . $e->getMessage()
            ], 500);
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

        // Pastikan pesanan ditemukan sebelum melanjutkan, untuk menghindari error
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Cari transaksi terkait
        $transaksi = Transaksi::where('orderId', $order->id)->first();
        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi not found'], 404);
        }

        // 5. Logika untuk mengubah status transaksi di kedua tabel
        switch ($transaction) {
            case 'capture':
            case 'settlement':
                if ($fraud == 'challenge') {
                    // Jika butuh verifikasi (fraud challenge)
                    $order->status = 'proses';
                    $transaksi->status = 'bayar';
                } else {
                    // Pembayaran berhasil
                    $order->status = 'proses';
                    $transaksi->status = 'bayar';
                }
                break;
            case 'pending':
                // Transaksi sedang menunggu pembayaran
                $order->status = 'belum';
                $transaksi->status = 'belum';
                break;
            case 'deny':
            case 'expire':
            case 'cancel':
                // Transaksi gagal, kadaluarsa, atau dibatalkan
                // Untuk transaksi, status 'tolak' lebih tepat
                $order->status = 'selesai'; // atau 'batal' jika ada
                $transaksi->status = 'tolak';
                break;
        }

        // 6. Simpan perubahan status di kedua tabel
        $order->save();
        $transaksi->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

    public function transaksi()
    {
        // Mendapatkan semua transaksi yang dimiliki oleh pengguna yang sedang login
        $transaksis = Transaksi::where('userId', Auth::id())
            ->with(['order', 'ongkir'])
            ->get();

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('transaksi', [
            'alrLogin' => !Auth::check(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'transaksis' => $transaksis,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
        ]);
    }

    public function pesanan()
    {
        // Mendapatkan semua pesanan yang dimiliki oleh pengguna yang sedang login
        $orders = Order::where('userId', Auth::id())
            ->with('ongkir') // Jika Anda ingin menampilkan nama jasa kirim
            ->latest()
            ->get();

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('pesanan', [
            'alrLogin' => !Auth::check(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'orders' => $orders,
            'cartCount' => $cartCount, // Kirim cartCount ke frontend
        ]);
    }

    public function pesanandetail(Order $order)
    {
        // Memastikan hanya pengguna yang memiliki pesanan yang dapat melihatnya
        if ($order->userId !== Auth::id()) {
            abort(403);
        }

        // Memuat relasi 'transaksi' dengan relasi 'produk' dan 'reviews' di dalamnya
        $order->load(['transaksi.produk.reviews']);

        // Inisialisasi cartCount
        $cartCount = 0;

        // Periksa apakah pengguna sedang login untuk mengambil jumlah keranjang
        if (Auth::check()) {
            $cartCount = Cart::where('userId', Auth::id())->count();
        }

        return Inertia::render('pesanandetail', [
            'alrLogin' => Auth::check(),
            'order' => $order,
            'cartCount' => $cartCount,
        ]);
    }

    public function printMonthlyReport(Request $request)
    {
        $request->validate([
            'month' => 'required|numeric|between:1,12',
            'year' => 'required|integer|digits:4',
        ]);

        $month = $request->input('month');
        $year = $request->input('year');

        // Mendapatkan pesanan yang sudah selesai
        $orders = Order::where('status', 'selesai')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->with(['user', 'transaksi', 'produk', 'ongkir'])
            ->get();

        if ($orders->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data pesanan selesai pada bulan dan tahun yang dipilih.'], 404);
        }

        // Mengubah angka bulan menjadi nama bulan
        $monthName = \Carbon\Carbon::createFromDate($year, $month, 1)->locale('id')->monthName;

        $html = view('pdf.report', compact('orders', 'monthName', 'year'))->render();

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $dompdf->stream('Laporan_Pesanan_Selesai_' . $monthName . '_' . $year . '.pdf', ['Attachment' => false]);
    }
}
