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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import React, { useState } from 'react';

// Tipe data untuk relasi
interface User {
    id: number;
    name: string;
}

interface Ongkir {
    id: number;
    name: string;
    biaya: number; // Menambahkan biaya ongkir
}

interface Produk {
    id: number;
    nama: string;
    harga: number;
}

interface Transaksi {
    id: number;
    jumlah: number;
    produk: Produk;
}

// Tipe data untuk order
interface Order {
    id: number;
    userId: number;
    ongkirId: number;
    name: string;
    nohp: number;
    alamat: string;
    totalHarga: number;
    status: string;
    user: User;
    ongkir: Ongkir;
    transaksi: Transaksi[]; // Tambahkan relasi transaksi
}

// Tipe data untuk objek paginasi
interface PaginatedOrder {
    data: Order[];
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
    };
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

// Properti halaman
interface Props {
    orders: PaginatedOrder;
    usersList: User[];
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

export default function Index({ orders, usersList, ongkirsList }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportDate, setReportDate] = useState('');

    // State untuk modal detail
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const form = useForm({
        userId: 0,
        ongkirId: 0,
        name: '',
        nohp: 0,
        alamat: '',
        totalHarga: 0,
        status: '',
    });

    const openDetailDialog = (order: Order) => {
        setCurrentOrder(order);
        setIsDetailModalOpen(true);
    };

    const openEditDialog = (order: Order) => {
        setIsEdit(true);
        setCurrentOrderId(order.id);
        form.setData({
            userId: order.userId,
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
        console.log(url);

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

    const handlePrintReport = () => {
        setIsReportModalOpen(true);
    };

    const generatePdf = () => {
        if (!reportDate) {
            console.error('Tanggal laporan belum dipilih.');
            return;
        }

        const [year, month] = reportDate.split('-');

        const url = route('admin.order.report.monthly', { month, year });

        window.open(url, '_blank');

        setIsReportModalOpen(false);
    };

    const hasOrders = orders && orders.data && orders.data.length > 0;
    const statusOptions = ['belum', 'proses', 'kirim', 'selesai'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
                    <Button onClick={handlePrintReport}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Cetak Laporan Bulanan
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID Pesanan</TableHead>
                                <TableHead>Pengguna</TableHead>
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
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.user ? order.user.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{order.ongkir ? order.ongkir.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{order.nohp}</TableCell>
                                        <TableCell>{order.alamat}</TableCell>
                                        <TableCell>Rp {order.totalHarga.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="space-x-2 text-center">
                                            <Button variant="outline" onClick={() => openDetailDialog(order)}>
                                                Detail
                                            </Button>
                                            <Button variant="outline" onClick={() => openEditDialog(order)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" onClick={() => openDeleteDialog(order.id)}>
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="py-8 text-center">
                                        Tidak ada data pesanan yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Links */}
                <div className="mt-8 flex justify-center space-x-2">
                    {orders.links.map((link, index) => (
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
                        <DialogTitle>{isEdit ? 'Edit Pesanan' : 'Tambah Pesanan'}</DialogTitle>
                        <DialogDescription>{isEdit ? 'Ubah data pesanan.' : 'Tambahkan pesanan baru.'}</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
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
                                <Select value={form.data.status} onValueChange={(value) => form.setData('status', value)}>
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
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                                Batal
                            </Button>
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

            {/* Report Monthly Dialog */}
            <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cetak Laporan Bulanan</DialogTitle>
                        <DialogDescription>Pilih bulan dan tahun untuk laporan pesanan yang sudah selesai.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="monthYear" className="text-right">
                                Bulan & Tahun
                            </Label>
                            <Input
                                id="monthYear"
                                type="month"
                                value={reportDate}
                                onChange={(e) => setReportDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={generatePdf} disabled={!reportDate}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Pesanan Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Detail Pesanan #{currentOrder?.id}</DialogTitle>
                        <DialogDescription>Informasi lengkap mengenai pesanan ini, termasuk rincian produk.</DialogDescription>
                    </DialogHeader>
                    {currentOrder && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">Informasi Pengguna</h3>
                                    <p>
                                        <strong>Nama:</strong> {currentOrder.user?.name}
                                    </p>
                                    <p>
                                        <strong>No HP:</strong> {currentOrder.nohp}
                                    </p>
                                    <p>
                                        <strong>Alamat:</strong> {currentOrder.alamat}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">Ringkasan Pesanan</h3>
                                    <p>
                                        <strong>Status:</strong> {currentOrder.status}
                                    </p>
                                    <p>
                                        <strong>Biaya Ongkir:</strong> Rp {currentOrder.ongkir?.biaya.toLocaleString('id-ID')}
                                    </p>
                                    <p>
                                        <strong>Total Harga:</strong> Rp {currentOrder.totalHarga.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg font-bold">Rincian Produk</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Produk</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead>Harga Satuan</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentOrder.transaksi && currentOrder.transaksi.length > 0 ? (
                                            currentOrder.transaksi.map((transaksi) => (
                                                <TableRow key={transaksi.id}>
                                                    <TableCell>{transaksi.produk.nama}</TableCell>
                                                    <TableCell>{transaksi.jumlah}</TableCell>
                                                    <TableCell>Rp {transaksi.produk.harga.toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {(transaksi.jumlah * transaksi.produk.harga).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">
                                                    Tidak ada produk dalam pesanan ini.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
