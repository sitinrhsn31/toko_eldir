import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {category.image && (
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-500 mt-1">{category.description}</p>
                <Link href={route('front.produk', { categoryId: category.id })}>
                    <Button className="w-full mt-4">Lihat Produk</Button>
                </Link>
            </div>
        </div>
    );
};

export default function KategoriPage({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    // Menghasilkan 8 kategori dummy untuk demo
    const categoriesToDisplay: Category[] = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        name: `Kategori ${index + 1}`,
        description: 'Deskripsi singkat tentang kategori ini.',
        image: `https://placehold.co/400x400/FF00FF/FFFFFF?text=Kategori+${index + 1}`,
    }));

    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Kategori" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Jelajahi Kategori
                    </h2>

                    {categoriesToDisplay && categoriesToDisplay.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {categoriesToDisplay.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                            Tidak ada kategori yang tersedia saat ini.
                        </div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}
