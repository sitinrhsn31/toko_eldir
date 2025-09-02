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
            vertical-align: top; /* Perbaikan: untuk rata atas pada rowspan */
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
        <h2>Toko Eldir.Id</h2>
        <p>Jl. Kyai H. Usman Dhomiri No. 85, Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40526</p>
        <p>Telepon: +6283124139350 | Email: info@eldirshop.com</p>
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
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Total Harga Produk</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($orders as $order)
                @php
                    $isFirstTransaction = true;
                    $transaksiCount = count($order->transaksi);
                @endphp
                @foreach ($order->transaksi as $transaksi)
                    <tr>
                        @if ($isFirstTransaction)
                            <td rowspan="{{ $transaksiCount + 2 }}">#{{ $order->id }}</td>
                            <td rowspan="{{ $transaksiCount + 2 }}">{{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</td>
                            <td rowspan="{{ $transaksiCount + 2 }}">{{ $order->user->name }}</td>
                        @endif
                        <td>{{ $transaksi->produk->nama ?? 'N/A' }}</td>
                        <td>{{ $transaksi->jumlah }}</td>
                        <td>Rp {{ number_format($transaksi->produk->harga ?? 0, 0, ',', '.') }}</td>
                        <td>Rp {{ number_format(($transaksi->jumlah ?? 0) * ($transaksi->produk->harga ?? 0), 0, ',', '.') }}</td>
                        @if ($isFirstTransaction)
                            <td rowspan="{{ $transaksiCount + 2 }}">{{ ucfirst($order->status) }}</td>
                            @php $isFirstTransaction = false; @endphp
                        @endif
                    </tr>
                @endforeach
                <tr style="background-color: #f9f9f9;">
                    <td colspan="3" style="text-align: right; font-weight: bold;">Biaya Pengiriman</td>
                    <td>Rp {{ number_format($order->ongkir->biaya ?? 0, 0, ',', '.') }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td colspan="3" style="text-align: right; font-weight: bold;">Total Keseluruhan Pesanan</td>
                    <td>Rp {{ number_format($order->totalHarga, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr style="background-color: #e6e6e6;">
                <td colspan="7" class="total">Total Pendapatan Bulan Ini</td>
                <td>Rp {{ number_format($orders->sum('totalHarga'), 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
