import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import FrontLayout from '@/layouts/front-layout';
import { Head } from '@inertiajs/react';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';

// Tipe data untuk transaksi
interface Transaksi {
    id: number;
    produk: string;
    jumlah: number;
    totalHarga: number;
    status: 'belum' | 'sudah';
}

export default function TransaksiPage({
    canLogin,
    canRegister,
    categoriesList,
}: {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}) {
    const [transaksi, setTransaksi] = useState<Transaksi>({
        id: 12345,
        produk: 'Hoodie Bergaya, Kaos Santai',
        jumlah: 3,
        totalHarga: 250000,
        status: 'belum',
    });

    const handleRefreshStatus = () => {
        // Simulasi perubahan status
        setTransaksi((prev) => ({
            ...prev,
            status: prev.status === 'belum' ? 'sudah' : 'belum',
        }));
        alert('Status transaksi diperbarui!');
    };

    return (
        <FrontLayout>
            <Head title="Status Transaksi" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Status Transaksi</h1>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Kode Transaksi: #{transaksi.id}</h2>
                        <Button onClick={handleRefreshStatus} variant="outline">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refresh Status
                        </Button>
                    </div>
                    <p className={`mb-4 text-xl font-semibold ${transaksi.status === 'sudah' ? 'text-green-500' : 'text-red-500'}`}>
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
