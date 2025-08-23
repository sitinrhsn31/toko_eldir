import React from 'react';
import { Link } from '@inertiajs/react';

export default function AppFooter() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom Kiri */}
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">ELDIR</h3>
                        <p className="text-sm">
                            Menemukan gaya terbaik Anda bersama kami.
                        </p>
                    </div>

                    {/* Kolom Tengah */}
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">Navigasi</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">Beranda</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Produk</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Kategori</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                        </ul>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">Hubungi Kami</h3>
                        <p className="text-sm">
                            Email: support@eldir.com<br />
                            Telepon: +62 123 4567 890
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                    &copy; 2025 ELDIR. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
