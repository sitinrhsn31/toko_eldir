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

// Tipe data untuk ongkir
interface Ongkir {
    id: number;
    name: string;
    biaya: number;
}

// Tipe data untuk objek paginasi
interface PaginatedOngkir {
    data: Ongkir[];
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
    ongkirs: PaginatedOngkir;
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ongkir',
        href: '/ongkir',
    },
];

export default function Index({ ongkirs }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentOngkirId, setCurrentOngkirId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        biaya: 0,
    });

    const openAddDialog = () => {
        setIsEdit(false);
        form.reset();
        setIsFormOpen(true);
    };

    const openEditDialog = (ongkir: Ongkir) => {
        setIsEdit(true);
        setCurrentOngkirId(ongkir.id);
        form.setData({
            name: ongkir.name,
            biaya: ongkir.biaya,
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        const url = isEdit && currentOngkirId !== null ? `/ongkir/${currentOngkirId}` : '/ongkir';

        if (isEdit) {
            // Menggunakan form.put() untuk operasi edit
            form.put(url, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                }
            });
        } else {
            form.post(url, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                }
            });
        }
    };

    const openDeleteDialog = (id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/ongkir/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const hasOngkirs = ongkirs && ongkirs.data && ongkirs.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ongkir" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Ongkir</h1>
                    <Button onClick={openAddDialog}>Tambah Ongkir</Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">No.</TableHead>
                                <TableHead>Nama Layanan</TableHead>
                                <TableHead>Biaya</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasOngkirs ? (
                                ongkirs.data.map((ongkir, index) => (
                                    <TableRow key={ongkir.id}>
                                        <TableCell className="font-medium">
                                            {ongkirs.meta ? (ongkirs.meta.current_page - 1) * ongkirs.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>{ongkir.name}</TableCell>
                                        <TableCell>{ongkir.biaya}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(ongkir)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(ongkir.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Tidak ada data ongkir yang tersedia.
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
                        <DialogTitle>{isEdit ? 'Edit Ongkir' : 'Tambah Ongkir'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah data ongkir.' : 'Tambahkan ongkir baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama Layanan
                                </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="biaya" className="text-right">
                                    Biaya
                                </Label>
                                <Input
                                    id="biaya"
                                    type="number"
                                    value={form.data.biaya}
                                    onChange={(e) => form.setData('biaya', parseFloat(e.target.value))}
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data ongkir secara permanen.
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
