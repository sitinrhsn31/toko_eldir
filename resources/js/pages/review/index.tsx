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

interface Produk {
    id: number;
    nama: string;
}

// Tipe data untuk ulasan
interface Review {
    id: number;
    userId: number;
    produkId: number;
    rating: number;
    ulasan: string;
    user: User;
    produk: Produk;
    created_at: string;
}

// Tipe data untuk objek paginasi
interface PaginatedReview {
    data: Review[];
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
    reviews: PaginatedReview;
    usersList: User[];
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ulasan',
        href: '/review',
    },
];

export default function Index({ reviews, usersList }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const form = useForm({
        userId: 0,
        rating: 0,
        ulasan: '',
    });

    const openEditDialog = (review: Review) => {
        setIsEdit(true);
        setCurrentReviewId(review.id);
        form.setData({
            userId: review.userId,
            rating: review.rating,
            ulasan: review.ulasan,
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        const url = isEdit && currentReviewId !== null ? `/review/${currentReviewId}` : '/review';

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
            router.delete(`/review/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const hasReviews = reviews && reviews.data && reviews.data.length > 0;
    const ratingOptions = [1, 2, 3, 4, 5];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ulasan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Ulasan</h1>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">No.</TableHead>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Ulasan</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasReviews ? (
                                reviews.data.map((review, index) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="font-medium">
                                            {reviews.meta ? (reviews.meta.current_page - 1) * reviews.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>{review.user ? review.user.name : 'Tidak ada'}</TableCell>
                                        <TableCell>{review.produk ? review.produk.nama : 'Tidak ada'}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell>{review.ulasan}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            {/* <Button
                                                variant="outline"
                                                onClick={() => openEditDialog(review)}
                                            >
                                                Edit
                                            </Button> */}
                                            <Button
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(review.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Tidak ada data ulasan yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Links */}
                <div className="mt-8 flex justify-center space-x-2">
                    {reviews.links.map((link, index) => (
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
                        <DialogTitle>{isEdit ? 'Edit Ulasan' : 'Tambah Ulasan'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah data ulasan.' : 'Tambahkan ulasan baru.'}
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
                                <Label htmlFor="rating" className="text-right">
                                    Rating
                                </Label>
                                <Select
                                    value={form.data.rating ? String(form.data.rating) : ''}
                                    onValueChange={(value) => form.setData('rating', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ratingOptions.map((rating) => (
                                            <SelectItem key={rating} value={String(rating)}>
                                                {rating}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="ulasan" className="text-right mt-2">
                                    Ulasan
                                </Label>
                                <textarea
                                    id="ulasan"
                                    value={form.data.ulasan}
                                    onChange={(e) => form.setData('ulasan', e.target.value)}
                                    className="col-span-3 border rounded-md p-2"
                                    rows={4}
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus ulasan secara permanen.
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
