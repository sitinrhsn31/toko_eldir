import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';

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

export default function ProdukPage({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    // Menghasilkan 20 produk dummy untuk demonstrasi
    const produksToDisplay: Produk[] = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        nama: `Produk Dummy ${index + 1}`,
        deskripsi: 'Deskripsi produk dummy.',
        harga: (index + 1) * 10000,
        stok: Math.floor(Math.random() * 500) + 1,
        ukuran: ['S', 'M'],
        foto: 'https://placehold.co/400x400/E879F9/111827',
    }));

    const ProductCard: React.FC<{ produk: Produk }> = ({ produk }) => {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {produk.foto && (
                    <img
                        src={produk.foto}
                        alt={produk.nama}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <h3 className="text-lg font-semibold">{produk.nama}</h3>
                    <p className="text-gray-500 mt-1">Rp {produk.harga.toLocaleString('id-ID')}</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                        <span>Stok: {produk.stok}</span>
                        <span>Ukuran: {produk.ukuran.join(', ')}</span>
                    </div>
                    <Link href={route('front.produk.show', produk.id)}>
                        <Button className="w-full mt-4">Lihat Detail</Button>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Produk" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Semua Produk
                    </h2>

                    {produksToDisplay && produksToDisplay.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {produksToDisplay.map((produk) => (
                                    <ProductCard key={produk.id} produk={produk} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                            Tidak ada produk yang tersedia saat ini.
                        </div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}
