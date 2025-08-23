import React from 'react';
import { Head } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';   
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

// Tipe data untuk produk
interface Produk {
    id: number;
    nama: string;
    deskripsi: string;
    harga: number;
    stok: number;
    ukuran: string[];
    foto: string;
}

// Properti halaman
interface Props {
    canLogin: boolean;
    canRegister: boolean;
}

export default function ProdukDetail({ canLogin, canRegister }: Props) {
    // Data produk dummy untuk demo
    const produk: Produk = {
        id: 1,
        nama: 'Hoodie Bergaya',
        deskripsi: 'Hoodie keren dengan bahan yang nyaman dan desain modern. Cocok untuk semua acara kasual.',
        harga: 150000,
        stok: 50,
        ukuran: ['S', 'M', 'L', 'XL'],
        foto: 'https://placehold.co/800x800/22C55E/FFFFFF?text=Produk+Demo',
    };

    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title={produk.nama} />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gambar Produk */}
                    <div className="md:col-span-1">
                        <img
                            src={produk.foto}
                            alt={produk.nama}
                            className="w-full h-auto object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Detail Produk */}
                    <div className="md:col-span-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{produk.nama}</h1>
                        <p className="mt-4 text-xl font-semibold text-pink-500">Rp {produk.harga.toLocaleString('id-ID')}</p>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Deskripsi</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{produk.deskripsi}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detail</h3>
                            <ul className="mt-2 text-gray-600 dark:text-gray-400 space-y-2">
                                <li><strong>Stok:</strong> {produk.stok}</li>
                                <li><strong>Ukuran:</strong> {produk.ukuran.join(', ')}</li>
                            </ul>
                        </div>

                        <div className="mt-8">
                            <Button className="w-full h-12 text-lg">
                                <ShoppingCart className="mr-2" />
                                Tambahkan ke Keranjang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
