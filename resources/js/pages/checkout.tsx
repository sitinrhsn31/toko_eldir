import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontLayout from '@/layouts/front-layout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

interface CartItem {
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
    foto: string;
}

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}

export default function CheckoutPage({ canLogin, canRegister, categoriesList }: Props) {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, nama: 'Hoodie Bergaya', harga: 150000, jumlah: 1, foto: 'https://placehold.co/100x100/E879F9/111827' },
        { id: 2, nama: 'Kaos Keren', harga: 85000, jumlah: 2, foto: 'https://placehold.co/100x100/38A169/111827' },
    ]);
    const [formData, setFormData] = useState({
        nama: '',
        nohp: '',
        alamat: '',
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Perbaikan di sini: Menghitung totalProduk dengan benar
    const totalProduk = cartItems.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    const [ongkir, setOngkir] = useState(25000); // Ongkir dummy
    const totalBayar = totalProduk + ongkir;

    const handleCheckout = () => {
        alert('Checkout berhasil! Redirecting ke halaman transaksi.');
        // router.post(route('transaksi.store'), { /* data checkout */ });
    };

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
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.foto} alt={item.nama} className="h-12 w-12 rounded" />
                                        <div>
                                            <p className="font-medium">{item.nama}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.jumlah} x Rp {item.harga.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex items-center justify-between text-lg font-bold">
                            <span>Total Harga:</span>
                            <span className="text-pink-500">
                                Rp {cartItems.reduce((total, item) => total + item.harga * item.jumlah, 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Formulir Pengiriman */}
                    <div className="md:col-span-1">
                        <h2 className="mb-4 text-2xl font-semibold">Informasi Pengiriman</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCheckout();
                            }}
                            className="space-y-4"
                        >
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
                            <Button type="submit" className="mt-4 w-full">
                                Lakukan Pembayaran
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
