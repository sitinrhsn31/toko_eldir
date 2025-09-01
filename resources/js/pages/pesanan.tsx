import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FrontLayout from '@/layouts/front-layout';
import { Head, usePage, Link } from '@inertiajs/react';

// Tipe data untuk order
interface Order {
    id: number;
    name: string;
    nohp: number;
    alamat: string;
    totalHarga: number;
    status: 'belum' | 'proses' | 'kirim' | 'selesai';
    created_at: string;
}

interface PageProps {
    orders: Order[];
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}

export default function PesananPage() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { orders, canLogin, canRegister, categoriesList } = props;

    // Fungsi untuk mendapatkan warna status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'belum':
                return 'text-red-500';
            case 'proses':
                return 'text-yellow-500';
            case 'kirim':
                return 'text-blue-500';
            case 'selesai':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <FrontLayout>
            <Head title="Pesanan Saya" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Pesanan Saya</h1>

                {orders && orders.length > 0 ? (
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <Table>
                            <TableHeader>
                                {/* Perbaikan untuk TableHeader: Pastikan tidak ada spasi di dalam TableRow */}
                                <TableRow>
                                    <TableHead>ID Pesanan</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Total Harga</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    // Perbaikan di sini: Hapus baris baru dan spasi di antara TableRow dan TableCell
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>Rp {order.totalHarga.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <span className={`font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={route('front.pesanan.detail', order.id)} className="text-blue-500 hover:underline">
                                                Detail
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Anda belum memiliki pesanan.</p>
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}