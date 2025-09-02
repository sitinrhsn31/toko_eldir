import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FrontLayout from '@/layouts/front-layout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Mendeklarasikan ulang antarmuka Window untuk menyertakan properti snap
declare global {
    interface Window {
        snap: any;
    }
}

// Pastikan struktur data ini sesuai dengan data dari database Anda.
interface CartItem {
    id: number;
    jumlah: number;
    produk: {
        id: number;
        nama: string;
        harga: number;
        foto: string;
    };
}

interface OngkirItem {
    id: number;
    name: string;
    biaya: number;
}

interface PageProps {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    cart: CartItem[];
    ongkir: OngkirItem[];
    // Menambahkan properti indeks untuk mengatasi error TypeScript
    [key: string]: any;
}

export default function CheckoutPage() {
    const { props } = usePage<PageProps>();
    const { cart, ongkir } = props;

    // State untuk data form pengiriman
    const [formData, setFormData] = useState({
        nama: '',
        nohp: '',
        alamat: '',
    });

    // State untuk ongkos kirim yang dipilih dan snap token
    const [biayaOngkir, setBiayaOngkir] = useState(0);
    const [selectedOngkir, setSelectedOngkir] = useState<OngkirItem | null>(null);
    const [snapToken, setSnapToken] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [jasaKirim, setJasaKirim] = useState<string>('');

    // Mengatur biaya ongkir awal ke biaya ongkir pertama jika ada
    useEffect(() => {
        if (ongkir && ongkir.length > 0) {
            setSelectedOngkir(ongkir[0]);
            setBiayaOngkir(ongkir[0].biaya);
            setJasaKirim(ongkir[0].name);
        }
    }, [ongkir]);

    // Menangani perubahan input form
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Menangani perubahan select jasa kirim
    const handleOngkirChange = (value: string) => {
        const foundOngkir = ongkir.find((item) => item.name === value);
        if (foundOngkir) {
            setSelectedOngkir(foundOngkir);
            setBiayaOngkir(foundOngkir.biaya);
            setJasaKirim(foundOngkir.name);
        }
    };

    // Menghitung total produk
    const totalProduk = cart.reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0);
    const totalBayar = totalProduk + biayaOngkir;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOngkir) {
            toast.error('Silakan pilih jasa kirim.');
            return;
        }

        setIsProcessing(true);

        // Data yang akan dikirim ke backend
        const checkoutData = {
            items: cart.map((item) => ({
                id_produk: item.produk.id,
                jumlah: item.jumlah,
                harga: item.produk.harga,
                cartId: item.id,
            })),
            ongkir: {
                id: selectedOngkir.id,
                jasa: selectedOngkir.name,
                biaya: selectedOngkir.biaya,
            },
            total_bayar: totalBayar,
            shipping_info: formData,
        };

        try {
            const response = await axios.post('/front/checkout/process', checkoutData);
            const { snapToken } = response.data;
            setSnapToken(snapToken);
        } catch (error: any) {
            setIsProcessing(false);
            console.error('Checkout error:', error.response.data);
            toast.error(error.response.data.message || 'Terjadi kesalahan saat memproses checkout.');
        }
    };

    // Efek ini akan berjalan ketika snapToken berubah (dari null menjadi string)
    useEffect(() => {
        if (snapToken) {
            // Memastikan snap.js sudah dimuat
            if (window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: (result: any) => {
                        console.log('Payment success:', result);
                        toast.success('Pembayaran berhasil!');
                        // Redirect ke halaman sukses menggunakan Inertia
                        window.location.href = `/front/pesanan`;
                    },
                    onPending: (result: any) => {
                        console.log('Payment pending:', result);
                        toast('Menunggu pembayaran...'); // Menggunakan toast()
                        window.location.href = `/front/pesanan`;
                    },
                    onError: (result: any) => {
                        console.error('Payment failed:', result);
                        toast.error('Pembayaran gagal.');
                    },
                    onClose: () => {
                        console.log('Pop-up closed without payment.');
                        toast('Pembayaran dibatalkan.'); // Menggunakan toast()
                    },
                });
            } else {
                console.error('Midtrans Snap.js is not loaded.');
                toast.error('Gagal memuat Midtrans. Mohon refresh halaman.');
            }
        }
    }, [snapToken]);

    return (
        <FrontLayout>
            <Head title="Checkout" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 rounded-lg bg-white p-8 shadow-md md:grid-cols-2 dark:bg-gray-800">
                    {/* Ringkasan Pesanan */}
                    <div className="md:col-span-1">
                        <h2 className="mb-4 text-2xl font-semibold">Ringkasan Pesanan</h2>
                        <ul className="space-y-4">
                            {cart.map((item) => (
                                <li key={item.id} className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center space-x-4">
                                        <img src={`/storage/${item.produk.foto}`} alt={item.produk.nama} className="h-12 w-12 rounded" />
                                        <div>
                                            <p className="font-medium">{item.produk.nama}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.jumlah} x Rp {item.produk.harga.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">Rp {(item.produk.harga * item.jumlah).toLocaleString('id-ID')}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">Total Produk:</span>
                                <span className="font-semibold text-pink-500">Rp {totalProduk.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">Biaya Pengiriman:</span>
                                <span className="font-semibold text-pink-500">Rp {biayaOngkir.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-dashed pt-4 text-xl font-extrabold">
                            <span>Total Bayar:</span>
                            <span className="text-pink-600">Rp {totalBayar.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* Formulir Pengiriman */}
                    <div className="md:col-span-1">
                        <h2 className="mb-4 text-2xl font-semibold">Informasi Pengiriman</h2>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input id="nama" value={formData.nama} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <Label htmlFor="nohp">Nomor HP</Label>
                                <Input id="nohp" type="tel" value={formData.nohp} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <Label htmlFor="alamat">Alamat Lengkap</Label>
                                <Input id="alamat" value={formData.alamat} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <Label htmlFor="jasa_kirim">Jasa Kirim</Label>
                                <Select onValueChange={handleOngkirChange} value={jasaKirim}>
                                    <SelectTrigger id="jasa_kirim" className="w-full">
                                        <SelectValue placeholder="Pilih Jasa Kirim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ongkir.length > 0 &&
                                            ongkir.map((item) => (
                                                <SelectItem key={item.id} value={item.name}>
                                                    {item.name} - Rp {item.biaya.toLocaleString('id-ID')}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="mt-4 w-full" disabled={isProcessing}>
                                {isProcessing ? 'Memproses...' : 'Lakukan Pembayaran'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
