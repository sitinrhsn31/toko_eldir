// app-header-front.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ShoppingCart } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    cartCount: number; // Tambahkan properti cartCount
}

export default function AppHeader({ auth, cartCount }: Props) { // Terima cartCount sebagai prop
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <AppLogoIcon className="h-10 fill-current text-white dark:text-black" />
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 flex justify-center px-2">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <Label htmlFor="search" className="sr-only">Cari Barang Apa</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <Input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border-transparent rounded-full leading-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 sm:text-sm transition-all"
                                    placeholder="Cari Barang Apa"
                                    type="search"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Keranjang */}
                    <div className="flex items-center sm:ml-6">
                        {auth.user ? (
                            <Link href={route('front.keranjang')} className="relative ml-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <ShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && ( // Tampilkan notifikasi hanya jika cartCount > 0
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
}
