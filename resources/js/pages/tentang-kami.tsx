import FrontLayout from '@/layouts/front-layout';
import { Head } from '@inertiajs/react';

export default function TentangKami({
    canLogin,
    canRegister,
    categoriesList,
}: {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}) {
    return (
        <FrontLayout>
            <Head title="Tentang Kami" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Tentang ELDIR</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Kami adalah destinasi terdepan untuk koleksi busana terbaru yang stylish dan berkualitas.
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-3xl text-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Terima kasih telah memilih ELDIR sebagai mitra gaya Anda.</p>
                </div>
                <div className="mx-auto mt-8 max-w-3xl text-center">
                    {/* <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Terima kasih telah memilih ELDIR sebagai mitra gaya Anda.
                    </p> */}
                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Hubungi Kami</h3>
                    <p className="text-sm text-gray-900 dark:text-white">
                        Email: support@eldir.com
                        <br />
                        Telepon: +62 123 4567 890
                    </p>
                </div>
            </div>
        </FrontLayout>
    );
}
