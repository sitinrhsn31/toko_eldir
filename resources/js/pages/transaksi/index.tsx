import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
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

interface Order {
    id: number;
    name: string;
}

interface Produk {
    id: number;
    nama: string;
}

interface Ongkir {
    id: number;
    name: string;
}

// Tipe data untuk transaksi
interface Transaksi {
    id: number;
    userId: number;
    orderId: number;
    produkId: number;
    ongkirId: number;
    status: string;
    code: string;
    user: User;
    order: Order;
    produk: Produk;
    ongkir: Ongkir;
}

// Tipe data untuk objek paginasi
interface PaginatedTransaksi {
    data: Transaksi[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    }
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

// Properti halaman
interface Props {
    transaksis: PaginatedTransaksi;
    usersList: User[];
    ordersList: Order[];
    ongkirsList: Ongkir[];
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transaksi',
        href: '/transaksi',
    },
];

export default function Index({ transaksis, usersList, ordersList, ongkirsList }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentTransaksiId, setCurrentTransaksiId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({
        userId: 0,
        orderId: 0,
        ongkirId: 0,
        status: '',
        code: '',
    });

    const openEditDialog = (transaksi: Transaksi) => {
        setIsEdit(true);
        setCurrentTransaksiId(transaksi.id);
        form.setData({
            userId: transaksi.userId,
            orderId: transaksi.orderId,
            ongkirId: transaksi.ongkirId,
            status: transaksi.status,
            code: transaksi.code,
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        const url = isEdit && currentTransaksiId !== null ? `/transaksi/${currentTransaksiId}` : '/transaksi';

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
            router.delete(`/transaksi/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const hasTransaksis = transaksis && transaksis.data && transaksis.data.length > 0;
    const statusOptions = ['belum', 'bayar', 'tolak'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Transaksi</h1>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">No.</TableHead>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Ongkir</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasTransaksis ? (
                                transaksis.data.map((transaksi, index) => (
                                    <TableRow key={transaksi.id}>
                                        <TableCell className="font-medium">
                                            {transaksis.meta ? (transaksis.meta.current_page - 1) * transaksis.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>{transaksi.user ? transaksi.user.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{transaksi.order ? transaksi.order.id : 'Tidak ada'}</TableCell>
                                        <TableCell>{transaksi.produk ? transaksi.produk.nama : 'Tidak ada'}</TableCell>
                                        <TableCell>{transaksi.ongkir ? transaksi.ongkir.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{transaksi.status}</TableCell>
                                        <TableCell>{transaksi.code}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(transaksi)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(transaksi.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Tidak ada data transaksi yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Links */}
                <div className="mt-8 flex justify-center space-x-2">
                    {transaksis.links.map((link, index) => (
                        <React.Fragment key={index}>
                            {link.url === null ? (
                                <span
                                    className={`rounded-md border px-3 py-2 text-sm leading-4 text-gray-400`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <Link
                                    href={link.url}
                                    className={`rounded-md border px-3 py-2 text-sm leading-4 ${link.active ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah data transaksi.' : 'Tambahkan transaksi baru.'}
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
                                <Label htmlFor="orderId" className="text-right">
                                    Order
                                </Label>
                                <Select
                                    value={form.data.orderId ? String(form.data.orderId) : ''}
                                    onValueChange={(value) => form.setData('orderId', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ordersList.map((order) => (
                                            <SelectItem key={order.id} value={String(order.id)}>
                                                {order.id}
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">
                                    Kode
                                </Label>
                                <Input
                                    id="code"
                                    value={form.data.code}
                                    onChange={(e) => form.setData('code', e.target.value)}
                                    className="col-span-3"
                                />
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus transaksi secara permanen.
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
