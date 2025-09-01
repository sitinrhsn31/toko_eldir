<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name', 'Laravel') }} - Laporan Pesanan Selesai {{ $monthName }} Tahun {{ $year }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 12px;
            color: #666;
        }
        .divider {
            border-bottom: 2px solid #333;
            margin-bottom: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
            text-align: right;
            padding-right: 16px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>ELDIRSHOP</h2>
        <p>Jl. Contoh No. 123, Kota Contoh, Kode Pos 12345</p>
        <p>Telepon: (021) 1234567 | Email: info@eldirshop.com</p>
    </div>
    <div class="divider"></div>

    <h1>Laporan Pesanan Selesai</h1>
    <h1>Bulan {{ $monthName }} Tahun {{ $year }}</h1> 
    <table>
        <thead>
            <tr>
                <th>ID Pesanan</th>
                <th>Tanggal</th>
                <th>Pengguna</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($orders as $order)
                @php
                    // Pastikan relasi dan properti ada sebelum melakukan perhitungan
                    $shippingCost = $order->ongkir ? $order->ongkir->harga : 0;
                    $productPrice = ($order->transaksi && $order->transaksi->produk) ? $order->transaksi->produk->harga : 0;
                    $productCount = 0;

                    if ($order->totalHarga > $shippingCost && $productPrice > 0) {
                        $productCount = round(($order->totalHarga - $shippingCost) / $productPrice);
                    }
                @endphp
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</td>
                    <td>{{ $order->user->name }}</td>
                    <td>{{ $order->transaksi->produk->nama ?? 'Tidak Ada' }}</td>
                    <td>{{ $productCount }}</td>
                    <td>Rp {{ number_format($order->totalHarga, 0, ',', '.') }}</td>
                    <td>{{ ucfirst($order->status) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3" class="total">Total Pendapatan</td>
                <td colspan="2">Rp {{ number_format($orders->sum('totalHarga'), 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>