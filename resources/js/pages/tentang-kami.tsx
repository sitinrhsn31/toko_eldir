import React from 'react';
import { Head } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';

export default function TentangKami({ canLogin, canRegister }: { canLogin: boolean, canRegister: boolean }) {
    return (
        <FrontLayout canLogin={canLogin} canRegister={canRegister}>
            <Head title="Tentang Kami" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Tentang ELDIR
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Kami adalah destinasi terdepan untuk koleksi busana terbaru yang stylish dan berkualitas.
                    </p>
                </div>

                <div className="mt-8 max-w-3xl mx-auto text-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Terima kasih telah memilih ELDIR sebagai mitra gaya Anda.
                    </p>
                </div>
            </div>
        </FrontLayout>
    );
}
