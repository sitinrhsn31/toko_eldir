import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FrontLayout from '@/layouts/front-layout';
import { Head, Link, router } from '@inertiajs/react'; // Import router
import React from 'react';

// Tipe data untuk kategori
interface Category {
    id: number;
    name: string;
}

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

// Tipe data untuk objek paginasi
interface PaginatedProduk {
    data: Produk[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: Category[]; // Tambahkan categoriesList di props
    produks: PaginatedProduk;
}

export default function ProdukPage({ canLogin, canRegister, produks, categoriesList }: Props) {
    // ... (sisanya sama dengan kode yang sudah diperbaiki sebelumnya)

    const ProductCard: React.FC<{ produk: Produk }> = ({ produk }) => {
        return (
            <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
                {produk.foto && <img src={`/storage/${produk.foto}`} alt={produk.nama} className="h-48 w-full object-cover" />}
                <div className="p-4">
                    <h3 className="text-lg font-semibold">{produk.nama}</h3>
                    <p className="mt-1 text-gray-500">Rp {produk.harga.toLocaleString('id-ID')}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                        <span>Stok: {produk.stok}</span>
                        <span>Ukuran: {produk.ukuran.join(', ')}</span>
                    </div>
                    <Link href={route('front.produk.show', produk.id)}>
                        <Button className="mt-4 w-full">Lihat Detail</Button>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <FrontLayout>
            <Head title="Produk" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mt-0">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Semua Produk</h2>

                        {/* Dropdown Kategori */}
                        <Select onValueChange={(value) => router.visit(value)}>
                            <SelectTrigger className="inline-flex items-center gap-1 rounded-lg border-0 bg-white px-4 py-2 text-sm font-semibold text-pink-500 transition-colors hover:bg-gray-100">
                                <SelectValue placeholder="Filter Kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-800">
                                <SelectItem value={route('front.produk')}>Semua Kategori</SelectItem>
                                {categoriesList.map((category) => (
                                    <SelectItem key={category.id} value={route('front.produk', { categoryId: category.id })}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {produks.data && produks.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                                {produks.data.map((produk) => (
                                    <ProductCard key={produk.id} produk={produk} />
                                ))}
                            </div>

                            {/* Pagination Links */}
                            <div className="mt-8 flex justify-center space-x-2">
                                {produks.links.map((link, index) => (
                                    <React.Fragment key={index}>
                                        {link.url === null ? (
                                            <span
                                                className={`rounded-md border px-3 py-2 text-sm leading-4 text-gray-400`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <Link
                                                href={link.url}
                                                className={`rounded-md border px-3 py-2 text-sm leading-4 ${link.active ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-16 text-center text-gray-500 dark:text-gray-400">Tidak ada produk yang tersedia saat ini.</div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}
