import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    produksTerbaru: Produk[];
    allProduk: Produk[];
}

// Komponen Card Produk
const ProductCard: React.FC<{ produk: Produk }> = ({ produk }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {produk.foto && (
                <img
                    src={`/storage/${produk.foto}`}
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
                <Button className="w-full mt-4">Lihat Detail</Button>
            </div>
        </div>
    );
};

// Komponen Hero Section Carousel
const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: '/image/hero-1.png',
            title: 'Koleksi Terbaru',
            subtitle: 'Temukan gaya terbaik Anda bersama kami.',
        },
        {
            image: '/image/hero-2.png',
            title: 'Penawaran Spesial',
            subtitle: 'Diskon hingga 50% untuk produk pilihan.',
        },
        {
            image: '/image/hero-3.png',
            title: 'Busana Pria dan Wanita',
            subtitle: 'Gaya modern untuk setiap momen.',
        },
        {
            image: '/image/hero-4.png',
            title: 'Busana Pria dan Wanita',
            subtitle: 'Gaya modern untuk setiap momen.',
        },
    ];

    const goToPrevious = () => {
        const isFirstSlide = currentSlide === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentSlide - 1;
        setCurrentSlide(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentSlide === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentSlide + 1;
        setCurrentSlide(newIndex);
    };

    return (
        <div className="relative">
            <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full rounded-xl object-cover"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white p-4">
                <h1 className="text-4xl sm:text-6xl font-bold">{slides[currentSlide].title}</h1>
                <p className="mt-4 text-lg sm:text-xl">{slides[currentSlide].subtitle}</p>
            </div>

            {/* Navigasi Carousel */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
};

export default function Welcome({ canLogin, canRegister, produksTerbaru, allProduk }: Props) {
    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Welcome" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <HeroSection />

                {/* Produk Terbaru */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Produk Terbaru Kami
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {produksTerbaru.map((produk) => (
                            <ProductCard key={produk.id} produk={produk} />
                        ))}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
