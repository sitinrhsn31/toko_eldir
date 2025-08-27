import { Button } from '@/components/ui/button';
import FrontLayout from '@/layouts/front-layout';
import { Head, router } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

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

// Properti halaman, sekarang menerima objek produk
interface Props {
    alrLogin: boolean;
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    produk: Produk | null;
}

export default function ProdukDetail({ alrLogin, canLogin, canRegister, categoriesList, produk }: Props) {
    const [jumlah, setJumlah] = useState<number>(1);
    const [ukuranDipilih, setUkuranDipilih] = useState<string | null>(null); // State baru untuk ukuran

    const handleAddToCart = () => {
        // PERBAIKAN: Periksa apakah pengguna sudah login
        if (alrLogin) {
            alert('Anda harus login untuk menambahkan produk ke keranjang.');
            router.get(route('login')); // Arahkan ke halaman login
            return;
        }

        if (!produk) {
            console.error('Produk tidak valid.');
            return;
        }

        // PERBAIKAN: Periksa apakah ukuran sudah dipilih
        if (!ukuranDipilih) {
            alert('Mohon pilih ukuran produk terlebih dahulu.');
            return;
        }

        // Kirim request POST ke controller
        router.post(
            '/front/keranjang/add',
            {
                produkId: produk.id,
                jumlah: jumlah,
                ukuran: ukuranDipilih, // Kirim data ukuran yang dipilih
            },
            {
                onSuccess: () => {
                    alert('Produk berhasil ditambahkan ke keranjang!');
                },
                onError: (errors) => {
                    console.error('Error saat menambahkan ke keranjang:', errors);
                    alert('Terjadi kesalahan saat menambahkan produk. Coba lagi.');
                },
            },
        );
    };

    if (!produk) {
        return (
            <FrontLayout>
                <Head title="Produk Tidak Ditemukan" />
                <div className="flex min-h-screen items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
                    <p>Produk tidak ditemukan atau tidak tersedia.</p>
                </div>
            </FrontLayout>
        );
    }

    return (
        <FrontLayout>
            <Head title={produk?.nama || 'Detail Produk'} />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Gambar Produk */}
                    <div className="flex items-center justify-center md:col-span-1">
                        {produk?.foto && (
                            <div className="h-[500px] w-full max-w-lg overflow-hidden rounded-lg shadow-lg">
                                <img src={`/storage/${produk.foto}`} alt={produk.nama} className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Detail Produk */}
                    <div className="md:col-span-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{produk?.nama}</h1>
                        <p className="mt-4 text-xl font-semibold text-pink-500">
                            {produk?.harga ? `Rp ${produk.harga.toLocaleString('id-ID')}` : 'Rp 0'}
                        </p>
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Deskripsi</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{produk?.deskripsi}</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detail</h3>
                            <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>
                                    <strong>Stok:</strong> {produk?.stok}
                                </li>
                                {/* Bagian Ukuran: Ubah menjadi tombol */}
                                <li>
                                    <strong>Ukuran:</strong>
                                    <div className="mt-2 flex space-x-2">
                                        {Array.isArray(produk?.ukuran) &&
                                            produk.ukuran.map((ukuran) => (
                                                <Button
                                                    key={ukuran}
                                                    variant="outline"
                                                    className={`border-gray-300 transition-colors ${
                                                        ukuran === ukuranDipilih ? 'border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100' : ''
                                                    }`}
                                                    onClick={() => setUkuranDipilih(ukuran)}
                                                >
                                                    {ukuran}
                                                </Button>
                                            ))}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-6 flex items-center space-x-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Jumlah</h3>
                            <input
                                type="number"
                                min="1"
                                value={jumlah}
                                onChange={(e) => setJumlah(parseInt(e.target.value))}
                                className="w-20 rounded-md border text-center"
                            />
                        </div>
                        <div className="mt-8">
                            <Button className="h-12 w-full text-lg" onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2" />
                                Tambahkan ke Keranjang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}