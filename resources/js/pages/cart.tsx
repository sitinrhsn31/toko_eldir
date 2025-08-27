import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FrontLayout from '@/layouts/front-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

// Tipe data untuk produk
interface Produk {
    id: number;
    nama: string;
    harga: number;
    foto: string;
}

// PERBAIKAN: Tambahkan 'ukuran' ke dalam tipe CartItem
interface CartItem {
    id: number;
    produk: Produk;
    jumlah: number;
    ukuran: string; // Tambahkan properti ukuran di sini
}

export default function cart({
    canLogin,
    canRegister,
    categoriesList,
    cartItems: initialCartItems,
    totalHarga,
}: {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    cartItems: CartItem[];
    totalHarga: number;
}) {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            newQuantity = 1;
        }

        const updatedCartItems = cartItems.map(item =>
            item.id === itemId ? { ...item, jumlah: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        router.put(`/front/keranjang/update/${itemId}`, {
            cartId: itemId,
            jumlah: newQuantity,
        }, {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (itemId: number) => {
        // Konfirmasi sebelum menghapus (gunakan modal kustom, jangan alert)
        if (confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
             router.delete(`/front/keranjang/destroy/${itemId}`, {
                preserveScroll: true,
            });
        }
    };

    const totalBayar = cartItems.reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0);

    return (
        <FrontLayout>
            <Head title="Keranjang" />
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Keranjang Anda</h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Kolom Kiri: Daftar Produk */}
                        <div className="md:col-span-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}>Produk</TableHead>
                                        <TableHead>Ukuran</TableHead> {/* Tambahkan header ukuran */}
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <img
                                                    src={`/storage/${item.produk.foto}`}
                                                    alt={item.produk.nama}
                                                    className="h-16 w-16 rounded object-cover"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.produk.nama}</TableCell>
                                            <TableCell>{item.ukuran}</TableCell> {/* Tampilkan ukuran di sini */}
                                            <TableCell>Rp {item.produk.harga.toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.jumlah - 1)}>
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.jumlah}
                                                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                                        className="w-12 text-center rounded-md border border-gray-300"
                                                    />
                                                    <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.id, item.jumlah + 1)}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>Rp {(item.produk.harga * item.jumlah).toLocaleString('id-ID')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Kolom Kanan: Ringkasan Belanja */}
                        <div className="h-fit rounded-lg bg-white p-6 shadow-md md:col-span-1 dark:bg-gray-800">
                            <h2 className="mb-4 text-2xl font-bold">Ringkasan Belanja</h2>
                            <div className="flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>Rp {totalBayar.toLocaleString('id-ID')}</span>
                            </div>
                            <Link href={route('front.checkout')}>
                                <Button className="mt-6 w-full">
                                    Checkout
                                    <ShoppingCart className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="py-16 text-center text-gray-500 dark:text-gray-400">Keranjang Anda kosong.</div>
                )}
            </div>
        </FrontLayout>
    );
}