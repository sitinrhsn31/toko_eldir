import FrontLayout from '@/layouts/front-layout';
import React, { useEffect, useState } from 'react';

// Custom Textarea component for styling consistency
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-pink-400`}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

// Komponen ikon Star
const StarIcon = ({ fill }: { fill: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill ? 'currentColor' : 'none'}
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
    reviews?: Review[];
}

// Transaction data interface - updated to include produk with reviews
interface Transaksi {
    id: number;
    user: User;
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
    transaksi: Transaksi[] | object | null;
    user: User;
    ongkir?: {
        biaya: number;
    };
    userId: number; // Menambahkan userId untuk mencocokkan struktur data Anda
}

interface Props {
    alrLogin: boolean;
    order: Order;
}

const getXsrfToken = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('XSRF-TOKEN=')) {
            return decodeURIComponent(cookie.substring('XSRF-TOKEN='.length));
        }
    }
    return '';
};

export default function PesananDetail({ alrLogin, order }: Props) {
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [globalSuccessMessage, setGlobalSuccessMessage] = useState<string | null>(null);

    // Perbaikan utama: Tambahkan pengecekan di awal untuk memastikan order tidak undefined.
    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-16 font-sans antialiased dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Pesanan Tidak Ditemukan</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Mohon periksa kembali ID pesanan Anda.</p>
                </div>
            </div>
        );
    }

    const shippingCost = order.ongkir?.biaya || 0;

    // Perbaikan utama: pastikan data transaksi adalah array sebelum di-map.
    const transactions = Array.isArray(order.transaksi) ? order.transaksi : [];

    // Sub-komponen untuk ulasan, diletakkan di dalam komponen utama agar lebih mudah diatur
    const ReviewComponent = ({ transaksi, orderStatus, userId }: { transaksi: Transaksi; orderStatus: string; userId: number }) => {
        const [rating, setRating] = useState(0);
        const [ulasan, setUlasan] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [userReview, setUserReview] = useState<Review | null>(null);
        const [hasReviewed, setHasReviewed] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [successMessage, setSuccessMessage] = useState<string | null>(null);

        // Memeriksa apakah ulasan sudah ada saat komponen dimuat
        useEffect(() => {
            if (Array.isArray(transaksi.produk.reviews)) {
                const existingReview = transaksi.produk.reviews.find((r) => r.userId === userId);
                if (existingReview) {
                    setUserReview(existingReview);
                    setHasReviewed(true);
                }
            }
        }, [transaksi.produk.reviews, userId]);

        const handleReviewSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            setSuccessMessage(null);
            setIsSubmitting(true);

            if (rating === 0) {
                setError('Mohon berikan rating bintang.');
                setIsSubmitting(false);
                return;
            }

            const xsrfToken = getXsrfToken();
            if (!xsrfToken) {
                setError('Token keamanan tidak ditemukan. Mohon refresh halaman.');
                setIsSubmitting(false);
                return;
            }

            try {
                // Menggunakan fetch untuk simulasi pengiriman data ke server
                const response = await fetch(`/pesanan/${transaksi.id}/ulasan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': xsrfToken, // Perbaikan: Menggunakan header yang benar
                    },
                    body: JSON.stringify({
                        rating,
                        ulasan,
                        produkId: transaksi.produk.id,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Gagal mengirim ulasan');
                }

                // Mengupdate state secara lokal untuk mensimulasikan reload
                const newReview = {
                    id: Math.random(),
                    userId,
                    produkId: transaksi.produk.id,
                    rating,
                    ulasan,
                    user: { id: userId, name: 'Anda' },
                    created_at: new Date().toISOString(),
                };
                setUserReview(newReview);
                setHasReviewed(true);
                setSuccessMessage('Ulasan berhasil dikirim!');
            } catch (err) {
                setError('Terjadi kesalahan saat mengirim ulasan. Coba lagi.');
                console.error('Error saat mengirim ulasan:', err);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <>
                {error && (
                    <div className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-800 dark:text-red-300" role="alert">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mt-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-800 dark:text-green-300" role="alert">
                        {successMessage}
                    </div>
                )}

                {orderStatus === 'selesai' && !hasReviewed ? (
                    <form onSubmit={handleReviewSubmit}>
                        <div className="mt-4 flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="cursor-pointer" onClick={() => setRating(star)}>
                                    <StarIcon fill={star <= rating} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <label htmlFor={`ulasan-${transaksi.produk.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tulis Ulasan
                            </label>
                            <Textarea
                                id={`ulasan-${transaksi.produk.id}`}
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
                                className="w-full rounded-md bg-pink-600 px-4 py-2 font-bold text-white transition-colors hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                            </button>
                        </div>
                    </form>
                ) : orderStatus === 'selesai' && hasReviewed ? (
                    <div className="mt-8 rounded-md bg-green-100 p-4 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <h3 className="text-lg font-semibold">Ulasan Anda</h3>
                        <div className="mt-2 flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon key={star} fill={star <= (userReview?.rating || 0)} />
                            ))}
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{userReview?.ulasan}</p>
                    </div>
                ) : (
                    <div className="mt-8 rounded-md bg-gray-100 p-4 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <p>Anda dapat memberikan ulasan setelah pesanan ini selesai.</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <FrontLayout>
            <div className="min-h-screen bg-gray-50 py-16 font-sans antialiased dark:bg-gray-900">
                <title>Detail Pesanan</title>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Detail Pesanan #{order.id}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Status: <span className="font-semibold">{order.status}</span>
                    </p>

                    {/* Order Details */}
                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Pengiriman</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Nama: {order.name}</p>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">Alamat: {order.alamat}</p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ringkasan Pesanan</h3>
                            <div className="mt-2 space-y-2">
                                {/* Gunakan variabel 'transactions' untuk memastikan data adalah array */}
                                {transactions.map((transaksi: Transaksi) => (
                                    <div key={transaksi.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>
                                            {transaksi.produk.nama} ({transaksi.jumlah}x)
                                        </span>
                                        <span>Rp {(transaksi.jumlah * transaksi.harga).toLocaleString('id-ID')}</span>
                                    </div>
                                ))}
                                {order.ongkir?.biaya && (
                                    <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white">
                                        <span>Biaya Pengiriman:</span>
                                        <span>Rp {order.ongkir.biaya.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                                <span>Total Harga:</span>
                                <span>Rp {order.totalHarga.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="mt-12 border-t border-gray-200 pt-12 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Produk</h2>

                        {globalError && (
                            <div className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-700 dark:bg-red-800 dark:text-red-300" role="alert">
                                {globalError}
                            </div>
                        )}
                        {globalSuccessMessage && (
                            <div
                                className="mt-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-green-800 dark:text-green-300"
                                role="alert"
                            >
                                {globalSuccessMessage}
                            </div>
                        )}

                        {/* Looping untuk setiap produk yang bisa diulas */}
                        {transactions.map((transaksi: Transaksi) => (
                            <div key={transaksi.id} className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Produk: {transaksi.produk.nama}</h3>
                                <ReviewComponent transaksi={transaksi} orderStatus={order.status} userId={order.userId} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
