import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}

export default function AppNavbar({ canLogin, canRegister, categoriesList }: Props) {
    return (
        <nav className="bg-pink-500 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between space-x-8 h-12 items-center">
                    {/* Navigasi Kiri */}
                    <div className="flex space-x-8 h-12 items-center">
                        <Link href={route('home')} className="inline-flex items-center text-sm font-medium hover:underline underline-offset-4">
                            Beranda
                        </Link>
                        <Link href={route('front.produk')} className="inline-flex items-center text-sm font-medium hover:underline underline-offset-4">
                            Produk
                        </Link>

                        {/* Dropdown Kategori */}
                        <Select onValueChange={(value) => window.location.href = value}>
                            <SelectTrigger className="inline-flex items-center text-white text-sm font-medium hover:underline underline-offset-4 bg-transparent border-none focus:ring-0">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoriesList.map((category) => (
                                    <SelectItem key={category.id} value={route('front.produk', { categoryId: category.id })}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Link href={route('front.tentang-kami')} className="inline-flex items-center text-sm font-medium hover:underline underline-offset-4">
                            Tentang Kami
                        </Link>
                    </div>

                    {/* Autentikasi Kanan */}
                    {canLogin ? (
                        <div className="flex items-center space-x-4">
                            <Link href={route('login')} className="font-semibold text-white hover:underline underline-offset-4 transition-colors">
                                Login
                            </Link>
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="font-semibold text-pink-500 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </nav>
    );
}
