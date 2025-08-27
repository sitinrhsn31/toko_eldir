<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Pesanan Selesai</title>
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

    <h1>Laporan Pesanan Selesai Bulan {{ $month }} Tahun {{ $year }}</h1>
    <table>
        <thead>
            <tr>
                <th>ID Pesanan</th>
                <th>Pengguna</th>
                <th>Tanggal</th>
                <th>Total Harga</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($orders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ $order->user->name }}</td>
                    <td>{{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</td>
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
