import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Komponen Textarea yang dibuat sendiri
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-pink-400`}
                ref={ref}
                {...props}
            />
        );
    }
);

// Tipe data untuk ulasan
interface User {
    id: number;
    name: string;
}

interface Review {
    id: number;
    userId: number;
    produkId: number;
    rating: number;
    ulasan: string;
    user: User; // Relasi ke pengguna
    created_at: string;
}

// Tipe data untuk produk
interface Produk {
    id: number;
    nama: string;
    deskripsi: string;
    harga: number;
    stok: number;
    ukuran: string[];
    foto: string;
    reviews: Review[]; // Tambahkan properti ulasan
}

// Properti halaman
interface Props {
    alrLogin: boolean;
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    produk: Produk | null;
}

export default function ProdukDetail({ alrLogin, canLogin, canRegister, categoriesList, produk }: Props) {
    const [jumlah, setJumlah] = useState<number>(1);
    const [ukuranDipilih, setUkuranDipilih] = useState<string | null>(null);

    // State dan form untuk ulasan
    const [rating, setRating] = useState(0);
    const [ulasan, setUlasan] = useState('');

    const handleAddToCart = () => {
        if (!alrLogin) {
            // Hindari penggunaan alert()
            // alert('Anda harus login untuk menambahkan produk ke keranjang.');
            router.get(route('login'));
            return;
        }

        if (!produk) {
            console.error('Produk tidak valid.');
            return;
        }

        if (!ukuranDipilih) {
            // Hindari penggunaan alert()
            // alert('Mohon pilih ukuran produk terlebih dahulu.');
            return;
        }

        router.post(
            '/front/keranjang/add',
            {
                produkId: produk.id,
                jumlah: jumlah,
                ukuran: ukuranDipilih,
            },
            {
                onSuccess: () => {
                    // Hindari penggunaan alert()
                    // alert('Produk berhasil ditambahkan ke keranjang!');
                },
                onError: (errors) => {
                    console.error('Error saat menambahkan ke keranjang:', errors);
                    // Hindari penggunaan alert()
                    // alert('Terjadi kesalahan saat menambahkan produk. Coba lagi.');
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
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Tombol kembali yang dipindahkan ke atas grid */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-8 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-gray-800 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800"
                    aria-label="Kembali"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-semibold">Kembali</span>
                </button>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Gambar Produk */}
                    <div className="relative flex items-center justify-center md:col-span-1">
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

                {/* Bagian Ulasan */}
                <div className="mt-8 border-t pt-8  ">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Produk</h2>
                    
                    {/* Daftar ulasan yang sudah ada */}
                    <div className="mt-8 space-y-8">
                        {produk?.reviews && produk.reviews.length > 0 ? (
                            produk.reviews.map((review) => (
                                <div key={review.id} className="border-b pb-8">
                                    <div className="flex items-center space-x-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {review.user.name}
                                        </h4>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">{review.ulasan}</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Belum ada ulasan untuk produk ini.</p>
                        )}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
