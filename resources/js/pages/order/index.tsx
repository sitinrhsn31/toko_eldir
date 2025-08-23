import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Tipe data untuk relasi
interface User {
    id: number;
    name: string;
}

interface Cart {
    id: number;
}

interface Ongkir {
    id: number;
    name: string;
}

// Tipe data untuk order
interface Order {
    id: number;
    userId: number;
    cartId: number;
    ongkirId: number;
    name: string;
    nohp: number;
    alamat: string;
    totalHarga: number;
    status: string;
    user: User;
    cart: Cart;
    ongkir: Ongkir;
}

// Tipe data untuk objek paginasi
interface PaginatedOrder {
    data: Order[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: any[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// Properti halaman
interface Props {
    orders: PaginatedOrder;
    usersList: User[];
    cartsList: Cart[];
    ongkirsList: Ongkir[];
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Pesanan',
        href: '/order',
    },
];

export default function Index({ orders, usersList, cartsList, ongkirsList }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({
        userId: 0,
        cartId: 0,
        ongkirId: 0,
        name: '',
        nohp: 0,
        alamat: '',
        totalHarga: 0,
        status: '',
    });

    const openEditDialog = (order: Order) => {
        setIsEdit(true);
        setCurrentOrderId(order.id);
        form.setData({
            userId: order.userId,
            cartId: order.cartId,
            ongkirId: order.ongkirId,
            name: order.name,
            nohp: order.nohp,
            alamat: order.alamat,
            totalHarga: order.totalHarga,
            status: order.status,
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        const url = isEdit && currentOrderId !== null ? `/order/${currentOrderId}` : '/order';

        if (isEdit) {
            form.put(url, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        }
    };

    const openDeleteDialog = (id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/order/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const hasOrders = orders && orders.data && orders.data.length > 0;
    const statusOptions = ['belum', 'proses', 'kirim', 'selesai'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">No.</TableHead>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Keranjang</TableHead>
                                <TableHead>Ongkir</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>No HP</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Total Harga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasOrders ? (
                                orders.data.map((order, index) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {orders.meta ? (orders.meta.current_page - 1) * orders.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>{order.user ? order.user.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{order.cart ? order.cart.id : 'Tidak ada'}</TableCell>
                                        <TableCell>{order.ongkir ? order.ongkir.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{order.nohp}</TableCell>
                                        <TableCell>{order.alamat}</TableCell>
                                        <TableCell>{order.totalHarga}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(order)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(order.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8">
                                        Tidak ada data pesanan yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Pesanan' : 'Tambah Pesanan'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah data pesanan.' : 'Tambahkan pesanan baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="userId" className="text-right">
                                    Pengguna
                                </Label>
                                <Select
                                    value={form.data.userId ? String(form.data.userId) : ''}
                                    onValueChange={(value) => form.setData('userId', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Pengguna" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usersList.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cartId" className="text-right">
                                    Keranjang
                                </Label>
                                <Select
                                    value={form.data.cartId ? String(form.data.cartId) : ''}
                                    onValueChange={(value) => form.setData('cartId', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Keranjang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cartsList.map((cart) => (
                                            <SelectItem key={cart.id} value={String(cart.id)}>
                                                {cart.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ongkirId" className="text-right">
                                    Ongkir
                                </Label>
                                <Select
                                    value={form.data.ongkirId ? String(form.data.ongkirId) : ''}
                                    onValueChange={(value) => form.setData('ongkirId', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Ongkir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ongkirsList.map((ongkir) => (
                                            <SelectItem key={ongkir.id} value={String(ongkir.id)}>
                                                {ongkir.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nohp" className="text-right">
                                    No HP
                                </Label>
                                <Input
                                    id="nohp"
                                    type="number"
                                    value={form.data.nohp}
                                    onChange={(e) => form.setData('nohp', parseInt(e.target.value))}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="alamat" className="text-right">
                                    Alamat
                                </Label>
                                <Input
                                    id="alamat"
                                    value={form.data.alamat}
                                    onChange={(e) => form.setData('alamat', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="totalHarga" className="text-right">
                                    Total Harga
                                </Label>
                                <Input
                                    id="totalHarga"
                                    type="number"
                                    value={form.data.totalHarga}
                                    onChange={(e) => form.setData('totalHarga', parseFloat(e.target.value))}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(value) => form.setData('status', value)}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pesanan secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
