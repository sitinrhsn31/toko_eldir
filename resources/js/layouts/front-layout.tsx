// front-layout.tsx
import React, { useState, useEffect } from 'react';
import AppFooter from '@/components/app-footer-front';
import AppHeader from '@/components/app-header-front';
import AppNavbar from '@/components/app-navbar-front';
import { PageProps } from '@inertiajs/core';
import { usePage, Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// Definisikan tipe untuk properti yang diharapkan
interface CustomPageProps extends PageProps {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    auth: { user: any | null };
    flash: {
        success?: string;
        order_status?: string;
    };
    cartCount: number; // Tambahkan properti cartCount
}

export default function FrontLayout({ children }: PropsWithChildren) {
    // Menggunakan tipe kustom untuk usePage()
    const { props } = usePage<CustomPageProps>();
    const { canLogin, canRegister, categoriesList, auth, flash, cartCount } = props; // Ambil cartCount dari props

    // State untuk mengelola notifikasi pop-up
    const [notification, setNotification] = useState<string | null>(null);
    const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);

    useEffect(() => {
        // Cek jika flash dan pesan sukses di flash ada
        if (flash && flash.success) {
            setNotification(flash.success);
            // Jika ada status pesanan selesai, aktifkan status pesanan selesai
            if (flash.order_status === 'selesai') {
                setIsOrderComplete(true);
            }
            // Hapus notifikasi setelah beberapa detik
            const timer = setTimeout(() => {
                setNotification(null);
                setIsOrderComplete(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="fixed top-0 left-0 z-20 w-full">
                <AppHeader auth={auth} cartCount={cartCount} /> {/* Kirim cartCount sebagai prop */}
                <AppNavbar canLogin={canLogin} canRegister={canRegister} categoriesList={categoriesList} auth={auth} />
            </div>

            {/* Pop-up Notifikasi */}
            {notification && (
                <div className="fixed top-24 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-green-500 p-4 text-white shadow-lg transition-all duration-300">
                    <p>{notification}</p>
                    {isOrderComplete && (
                        <p className="mt-2 text-sm">
                            Sekarang Anda bisa memberikan <Link href="/ulasan" className="font-bold underline">ulasan</Link> untuk produk tersebut.
                        </p>
                    )}
                </div>
            )}

            <main className="relative isolate pt-[124px]">{children}</main>

            <AppFooter />
        </div>
    );
}
