import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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

export default function CartPage({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
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
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const totalBayar = cartItems.reduce((sum, item) => sum + item.totalHarga, 0);

    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Keranjang" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Keranjang Anda</h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                    {cartItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <img src={item.produk.foto} alt={item.produk.nama} className="w-16 h-16 object-cover rounded" />
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
                        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-2xl font-bold mb-4">Ringkasan Belanja</h2>
                            <div className="flex justify-between font-medium text-lg">
                                <span>Total</span>
                                <span>Rp {totalBayar.toLocaleString('id-ID')}</span>
                            </div>
                            <Link href={route('front.checkout')}>
                                <Button className="w-full mt-6">
                                    Checkout
                                    <ShoppingCart className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        Keranjang Anda kosong.
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}
