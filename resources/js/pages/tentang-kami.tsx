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
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Toko Eldir.Id</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Eldir.Id adalah brand fashion lokal asal Cimahi yang berdiri sejak 2016. Didirikan oleh Ella Dira, Eldir.Id menghadirkan busana wanita dengan desain timeless, sederhana, namun tetap berkarakter, serta mengutamakan kualitas dan kenyamanan. Kami berkomitmen menghadirkan fashion yang autentik dan modern melalui media sosial maupun event offline, agar selalu dekat dengan pelanggan.
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-3xl text-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Terima kasih telah memilih Eldir.Id sebagai mitra gaya Anda.</p>
                </div>
                <div className="mx-auto mt-8 max-w-3xl text-center">
                    {/* <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Terima kasih telah memilih ELDIR sebagai mitra gaya Anda.
                    </p> */}
                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Hubungi Kami</h3>
                    <p className="mb-20 text-sm text-gray-900 dark:text-white">
                        Email: elldirelladira@gmail.com
                        <br />
                        Telepon: +6283124139350
                        <br />
                        Alamat Offline: Jl. Kyai H. Usman Dhomiri No.85, Padasuka, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40526
                    </p>
                </div>
            </div>
        </FrontLayout>
    );
}
