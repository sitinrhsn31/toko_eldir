import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Tipe data untuk transaksi
interface Transaksi {
    id: number;
    produk: string;
    jumlah: number;
    totalHarga: number;
    status: 'belum' | 'sudah';
}

export default function TransaksiPage({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    const [transaksi, setTransaksi] = useState<Transaksi>({
        id: 12345,
        produk: 'Hoodie Bergaya, Kaos Santai',
        jumlah: 3,
        totalHarga: 250000,
        status: 'belum',
    });

    const handleRefreshStatus = () => {
        // Simulasi perubahan status
        setTransaksi(prev => ({
            ...prev,
            status: prev.status === 'belum' ? 'sudah' : 'belum',
        }));
        alert('Status transaksi diperbarui!');
    };

    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Status Transaksi" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Status Transaksi</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Kode Transaksi: #{transaksi.id}</h2>
                        <Button onClick={handleRefreshStatus} variant="outline">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Refresh Status
                        </Button>
                    </div>
                    <p className={`text-xl font-semibold mb-4 ${transaksi.status === 'sudah' ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {transaksi.status === 'sudah' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                    </p>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Produk</TableCell>
                                <TableCell>{transaksi.produk}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Jumlah Produk</TableCell>
                                <TableCell>{transaksi.jumlah}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Total Harga</TableCell>
                                <TableCell>Rp {transaksi.totalHarga.toLocaleString('id-ID')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </FrontLayout>
    );
}
