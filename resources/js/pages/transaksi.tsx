import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import FrontLayout from '@/layouts/front-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';

// Tipe data untuk order
interface Order {
    id: number;
    totalHarga: number;
    status: 'belum' | 'proses' | 'kirim' | 'selesai';
}

// Tipe data untuk transaksi
interface Transaksi {
    id: number;
    code: string;
    status: 'belum' | 'bayar' | 'tolak';
    order: Order;
}

interface PageProps {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    transaksis: Transaksi[];
}

export default function TransaksiPage() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { transaksis, canLogin, canRegister, categoriesList } = props;

    const handleRefreshStatus = () => {
        // Refresh halaman untuk memperbarui status transaksi
        router.reload({
            only: ['transaksis'], // Hanya me-refresh prop 'transaksis'
            onFinish: () => {
                console.log('Status transaksi diperbarui!');
            },
        });
    };

    return (
        <FrontLayout>
            <Head title="Riwayat Transaksi" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h1>

                {transaksis && transaksis.length > 0 ? (
                    transaksis.map((transaksi) => (
                        <div key={transaksi.id} className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Kode Transaksi: #{transaksi.order.id}</h2>
                                <Button onClick={handleRefreshStatus} variant="outline">
                                    <RefreshCcw className="mr-2 h-4 w-4" />
                                    Refresh Status
                                </Button>
                            </div>
                            <p className={`mb-4 text-xl font-semibold ${transaksi.status === 'bayar' ? 'text-green-500' : 'text-red-500'}`}>
                                Status: {transaksi.status === 'bayar' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                            </p>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Total Harga</TableCell>
                                        <TableCell>Rp {transaksi.order.totalHarga.toLocaleString('id-ID')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Kode Pembayaran</TableCell>
                                        <TableCell>{transaksi.code}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Belum ada transaksi.</p>
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}
