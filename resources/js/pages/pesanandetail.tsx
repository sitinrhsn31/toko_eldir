import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FrontLayout from '@/layouts/front-layout';

// Custom Textarea component for styling consistency
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
Textarea.displayName = 'Textarea';

// Komponen ikon Star
const StarIcon = ({ fill }: { fill: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-5 w-5 transition-colors ${fill ? 'text-yellow-400' : 'text-gray-400'}`}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

// User data interface
interface User {
    id: number;
    name: string;
}

// Review data interface
interface Review {
    id: number;
    userId: number;
    produkId: number;
    rating: number;
    ulasan: string;
    user: User;
    created_at: string;
}

// Product data interface - updated to include reviews
interface Produk {
    id: number;
    nama: string;
    harga: number;
    deskripsi?: string;
    stok?: number;
    ukuran?: string[];
    foto?: string;
    reviews?: Review[]; // Tambahkan relasi reviews
}

// Transaction data interface - updated to include produk with reviews
interface Transaksi {
    id: number;
    produk: Produk;
    jumlah: number;
    harga: number;
}

// Order data interface - Updated to handle reviews as an array
interface Order {
    id: number;
    name: string;
    alamat: string;
    totalHarga: number;
    status: string;
    transaksi?: Transaksi;
    user: User;
    ongkir?: {
        biaya: number;
    };
}

interface Props {
    alrLogin: boolean;
    order: Order;
}

export default function PesananDetail({ alrLogin, order }: Props) {
    const [rating, setRating] = useState(0);
    const [ulasan, setUlasan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Temukan ulasan untuk produk ini dari data order
    const hasReviewed = !!order.transaksi?.produk.reviews?.find(r => r.userId === order.user.id);
    const userReview = order.transaksi?.produk.reviews?.find(r => r.userId === order.user.id);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        const produkId = order.transaksi?.produk.id;

        // Validasi
        if (!alrLogin) {
            setError('Anda harus login untuk memberikan ulasan.');
            setIsSubmitting(false);
            return;
        }

        if (rating === 0) {
            setError('Mohon berikan rating bintang.');
            setIsSubmitting(false);
            return;
        }
        
        if (!produkId) {
            setError('Detail produk tidak ditemukan.');
            setIsSubmitting(false);
            return;
        }

        // Kirim data ulasan ke backend
        router.post(
            `/pesanan/${order.id}/ulasan`,
            {
                rating,
                ulasan,
                produkId,
            },
            {
                onSuccess: () => {
                    setSuccessMessage('Ulasan berhasil dikirim!');
                    setIsSubmitting(false);
                    router.reload({ only: ['order'] });
                },
                onError: (errors) => {
                    setError('Terjadi kesalahan saat mengirim ulasan. Coba lagi.');
                    console.error('Error saat mengirim ulasan:', errors);
                    setIsSubmitting(false);
                },
            },
        );
    };

    const shippingCost = order.ongkir?.biaya || 0;
    const productCount = order.transaksi ? Math.round((order.totalHarga - shippingCost) / order.transaksi.produk.harga) : 0;

    return (
        <FrontLayout>
            <Head title={'Detail Pesanan'} />
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 font-sans antialiased">
                <title>Detail Pesanan</title>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Detail Pesanan #{order.id}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Status: <span className="font-semibold">{order.status}</span></p>

                    {/* Order Details */}
                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Pengiriman</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Nama: {order.name}</p>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">Alamat: {order.alamat}</p>
                        </div>

                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ringkasan Pesanan</h3>
                            <div className="mt-2 space-y-2">
                                {order.transaksi ? (
                                    <>
                                        <div key={order.transaksi.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>{order.transaksi.produk.nama} ({productCount}x)</span>
                                            <span>Rp {order.transaksi.produk.harga?.toLocaleString('id-ID') || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white">
                                            <span>Subtotal Produk:</span>
                                            <span>Rp {(productCount * order.transaksi.produk.harga).toLocaleString('id-ID')}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p>Tidak ada detail transaksi.</p>
                                )}
                            </div>
                            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                                <span>Total Harga:</span>
                                <span>Rp {order.totalHarga.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Produk</h2>
                        
                        {/* Message Box */}
                        {error && (
                            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-300" role="alert">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-300" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {order.transaksi?.produk && (
                            <div key={order.transaksi.produk.id} className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Produk: {order.transaksi.produk.nama}
                                </h3>
                                {/* Form Ulasan atau Tampilan Ulasan */}
                                {order.status === 'selesai' && !hasReviewed ? (
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mt-4 flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div
                                                    key={star}
                                                    className="cursor-pointer"
                                                    onClick={() => setRating(star)}
                                                >
                                                    <StarIcon fill={star <= rating} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor={`ulasan-${order.transaksi.produk.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tulis Ulasan
                                            </label>
                                            <Textarea
                                                id={`ulasan-${order.transaksi.produk.id}`}
                                                className="mt-1 w-full"
                                                rows={4}
                                                value={ulasan}
                                                onChange={(e) => setUlasan(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <button 
                                                type="submit" 
                                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mt-8 p-4 bg-green-100 rounded-md dark:bg-green-900 text-green-700 dark:text-green-300">
                                        <h3 className="text-lg font-semibold">Ulasan Anda</h3>
                                        <div className="mt-2 flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon key={star} fill={star <= (userReview?.rating || 0)} />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">{userReview?.ulasan}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {order.status !== 'selesai' && (
                            <div className="mt-8 p-4 bg-gray-100 rounded-md dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                <p>Anda dapat memberikan ulasan setelah pesanan ini selesai.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
