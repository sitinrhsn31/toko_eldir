import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FrontLayout from '@/layouts/front-layout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Tipe data untuk produk
interface Produk {
    id: number;
    nama: string;
    harga: number;
    foto: string;
}

// Tipe data untuk item keranjang
interface CartItem {
    id: number;
    produk: Produk;
    jumlah: number;
    totalHarga: number;
}

export default function CartPage({
    canLogin,
    canRegister,
    categoriesList,
}: {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}) {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            produk: {
                id: 1,
                nama: 'Hoodie Bergaya',
                harga: 150000,
                foto: 'https://placehold.co/100x100/E879F9/111827?text=Hoodie',
            },
            jumlah: 1,
            totalHarga: 150000,
        },
        {
            id: 2,
            produk: {
                id: 2,
                nama: 'Kaos Santai',
                harga: 50000,
                foto: 'https://placehold.co/100x100/38A169/111827?text=Kaos',
            },
            jumlah: 2,
            totalHarga: 100000,
        },
    ]);

    const handleRemoveItem = (itemId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const totalBayar = cartItems.reduce((sum, item) => sum + item.totalHarga, 0);

    return (
        <FrontLayout>
            <Head title="Keranjang" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Keranjang Anda</h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Kolom Kiri: Daftar Produk */}
                        <div className="md:col-span-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}>Produk</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <img src={item.produk.foto} alt={item.produk.nama} className="h-16 w-16 rounded object-cover" />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.produk.nama}</TableCell>
                                            <TableCell>Rp {item.produk.harga.toLocaleString('id-ID')}</TableCell>
                                            <TableCell>{item.jumlah}</TableCell>
                                            <TableCell>Rp {item.totalHarga.toLocaleString('id-ID')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Kolom Kanan: Ringkasan Belanja */}
                        <div className="h-fit rounded-lg bg-white p-6 shadow-md md:col-span-1 dark:bg-gray-800">
                            <h2 className="mb-4 text-2xl font-bold">Ringkasan Belanja</h2>
                            <div className="flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>Rp {totalBayar.toLocaleString('id-ID')}</span>
                            </div>
                            <Link href={route('front.checkout')}>
                                <Button className="mt-6 w-full">
                                    Checkout
                                    <ShoppingCart className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="py-16 text-center text-gray-500 dark:text-gray-400">Keranjang Anda kosong.</div>
                )}
            </div>
        </FrontLayout>
    );
}
