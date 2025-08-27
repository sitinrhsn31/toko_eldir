import { Button } from '@/components/ui/button';
import FrontLayout from '@/layouts/front-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

// Tipe data untuk kategori
interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
}

// Komponen Card Kategori
const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
            {/* Pastikan path foto benar */}
            {category.image && <img src={`/storage/${category.image}`} alt={category.name} className="h-48 w-full object-cover" />}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="mt-1 text-gray-500">{category.description}</p>
                {/* Link akan mengarahkan ke halaman produk dengan filter kategori */}
                <Link href={route('front.produk', { categoryId: category.id })}>
                    <Button className="mt-4 w-full">Lihat Produk</Button>
                </Link>
            </div>
        </div>
    );
};

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categories: Category[]; // Ubah dari categoriesList menjadi categories
}

export default function KategoriPage({ canLogin, canRegister, categories }: Props) {
    return (
        <FrontLayout>
            <Head title="Kategori" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mt-8">
                    <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Jelajahi Kategori</h2>

                    {categories && categories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-gray-500 dark:text-gray-400">Tidak ada kategori yang tersedia saat ini.</div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}
