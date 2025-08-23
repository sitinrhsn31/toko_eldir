import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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

// Tipe data untuk kategori
interface Category {
    id: number;
    name: string;
}

// Tipe data untuk objek paginasi
interface PaginatedCategories {
    data: Category[];
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
        links: any[]; // Links to other pages
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// Properti halaman
interface Props {
    categories: PaginatedCategories;
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Kategori',
        href: '/category',
    },
];

export default function Index({ categories }: Props) {
    // State untuk form tambah/edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ id: 0, name: '' });

    // State untuk konfirmasi hapus
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Buka dialog tambah data
    const openAddDialog = () => {
        setIsEdit(false);
        setFormData({ id: 0, name: '' });
        setIsFormOpen(true);
    };

    // Buka dialog edit data
    const openEditDialog = (category: Category) => {
        setIsEdit(true);
        setFormData(category);
        setIsFormOpen(true);
    };

    // Simpan data kategori (baru atau edit)
    const handleSave = () => {
        if (isEdit) {
            // Logika untuk edit
            router.put(`/category/${formData.id}`, formData, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
            });
        } else {
            // Logika untuk tambah baru
            router.post('/category', formData, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
            });
        }
    };

    // Buka dialog konfirmasi hapus
    const openDeleteDialog = (id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    // Hapus data
    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/category/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const hasCategories = categories && categories.data && categories.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Kategori</h1>
                    <Button onClick={openAddDialog}>Tambah Kategori</Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead className="text-center w-[250px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasCategories ? (
                                categories.data.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            {categories.meta ? (categories.meta.current_page - 1) * categories.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell className="text-center space-x-2 w-[250px]">
                                            <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(category)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(category.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8">
                                        Tidak ada data yang tersedia.
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
                        <DialogTitle>{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah nama kategori.' : 'Tambahkan kategori baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kategori secara permanen.
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
