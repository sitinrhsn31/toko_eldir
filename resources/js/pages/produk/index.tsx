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
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Tipe data untuk kategori
interface Category {
    id: number;
    name: string;
}

// Tipe data untuk produk (termasuk relasi kategori)
interface Produk {
    id: number;
    nama: string;
    deskripsi: string;
    harga: number;
    stok: number;
    ukuran: string[]; // Mengubah tipe menjadi array of string
    foto: string;
    categoryId: number;
    category: Category; // Relasi ke model Category
}

// Tipe data untuk objek paginasi
interface PaginatedProduk {
    data: Produk[];
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
    produks: PaginatedProduk;
    categoriesList: Category[];
}

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Produk',
        href: '/produk',
    },
];

// Helper function untuk format angka menjadi Rupiah
const formatRupiah = (angka: number) => {
    // Menangani kasus jika angka adalah 0
    if (angka === 0) {
        return 'Rp 0';
    }

    const numberString = String(angka);
    // Jika tidak ada angka, kembalikan 'Rp' agar placeholder terlihat
    if (!numberString) {
        return 'Rp';
    }

    const cleanedNumber = numberString.replace(/[^,\d]/g, '');
    const split = cleanedNumber.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return `Rp ${rupiah}`;
};

// Helper function untuk menghilangkan format Rupiah
const unformatRupiah = (formattedValue: string): number => {
    const numericValue = parseInt(formattedValue.replace(/[^0-9]/g, ''), 10);
    return isNaN(numericValue) ? 0 : numericValue;
};

export default function Index({ produks, categoriesList }: Props) {
    // State untuk form tambah/edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState<Omit<Produk, 'id' | 'category'>>({
        nama: '',
        deskripsi: '',
        harga: 0,
        stok: 0,
        ukuran: [],
        foto: '',
        categoryId: 0,
    });
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [currentProdukId, setCurrentProdukId] = useState<number | null>(null);

    // State tambahan untuk input harga yang diformat
    const [hargaFormatted, setHargaFormatted] = useState('');

    // Menggunakan useEffect untuk sinkronisasi hargaFormatted dengan formData.harga
    useEffect(() => {
        if (isFormOpen) {
            setHargaFormatted(formatRupiah(formData.harga));
        }
    }, [isFormOpen, formData.harga]);

    // State untuk konfirmasi hapus
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Buka dialog tambah data
    const openAddDialog = () => {
        setIsEdit(false);
        setFormData({
            nama: '',
            deskripsi: '',
            harga: 0,
            stok: 0,
            ukuran: [],
            foto: '',
            categoryId: 0,
        });
        setFotoFile(null);
        setIsFormOpen(true);
    };

    // Buka dialog edit data
    const openEditDialog = (produk: Produk) => {
        setIsEdit(true);
        setCurrentProdukId(produk.id);
        setFormData({
            nama: produk.nama,
            deskripsi: produk.deskripsi,
            harga: produk.harga,
            stok: produk.stok,
            ukuran: produk.ukuran,
            foto: produk.foto,
            categoryId: produk.categoryId,
        });
        setFotoFile(null);
        setIsFormOpen(true);
    };

    // Handler untuk perubahan input harga
    const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = unformatRupiah(inputValue);

        setHargaFormatted(formatRupiah(numericValue));
        setFormData({ ...formData, harga: numericValue });
    };

    // Simpan data produk (baru atau edit)
    const handleSave = () => {
        const dataToSend = new FormData();
        dataToSend.append('nama', formData.nama);
        dataToSend.append('deskripsi', formData.deskripsi);
        dataToSend.append('harga', String(formData.harga)); // Mengirim nilai numerik ke backend
        dataToSend.append('stok', String(formData.stok));

        // Loop melalui array ukuran untuk menambahkannya ke FormData
        formData.ukuran.forEach((ukuranItem, index) => {
            dataToSend.append(`ukuran[${index}]`, ukuranItem);
        });

        dataToSend.append('categoryId', String(formData.categoryId || categoriesList[0]?.id));

        // Tambahkan foto hanya jika ada file baru yang diunggah
        if (fotoFile) {
            dataToSend.append('foto', fotoFile);
        }

        if (isEdit && currentProdukId !== null) {
            // Logika untuk edit
            dataToSend.append('_method', 'PUT'); // Penting untuk Inertia PUT request
            router.post(`/produk/${currentProdukId}`, dataToSend, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        } else {
            // Logika untuk tambah baru
            router.post('/produk', dataToSend, {
                onSuccess: () => {
                    setIsFormOpen(false);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
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
            router.delete(`/produk/${deleteId}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    // Handler untuk checkbox
    const handleUkuranChange = (ukuran: string, checked: boolean | 'indeterminate') => {
        const isChecked = typeof checked === 'boolean' ? checked : false;

        setFormData((prevData) => {
            const newUkuran = isChecked ? [...prevData.ukuran, ukuran] : prevData.ukuran.filter((u) => u !== ukuran);
            return { ...prevData, ukuran: newUkuran };
        });
    };

    const hasProduks = produks && produks.data && produks.data.length > 0;
    const ukuranOptions = ['S', 'M', 'L', 'XL'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Produk</h1>
                    <Button onClick={openAddDialog}>Tambah Produk</Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">No.</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Ukuran</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasProduks ? (
                                produks.data.map((produk, index) => (
                                    <TableRow key={produk.id}>
                                        <TableCell className="font-medium">
                                            {produks.meta ? (produks.meta.current_page - 1) * produks.meta.per_page + index + 1 : index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {produk.foto && (
                                                <img src={`/storage/${produk.foto}`} alt={produk.nama} className="h-16 w-16 rounded object-cover" />
                                            )}
                                        </TableCell>
                                        <TableCell>{produk.nama}</TableCell>
                                        <TableCell>{formatRupiah(produk.harga)}</TableCell> {/* Menggunakan formatRupiah */}
                                        <TableCell>{produk.stok}</TableCell>
                                        <TableCell>{produk.ukuran ? produk.ukuran.join(', ') : ''}</TableCell>
                                        <TableCell>{produk.category ? produk.category.name : 'Tidak ada'}</TableCell>
                                        <TableCell className="space-x-2 text-center">
                                            <Button variant="outline" onClick={() => openEditDialog(produk)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" onClick={() => openDeleteDialog(produk.id)}>
                                                Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center">
                                        Tidak ada data produk yang tersedia.
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
                        <DialogTitle>{isEdit ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                        <DialogDescription>{isEdit ? 'Ubah data produk.' : 'Tambahkan produk baru.'}</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nama" className="text-right">
                                    Nama
                                </Label>
                                <Input
                                    id="nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="deskripsi" className="text-right">
                                    Deskripsi
                                </Label>
                                <Input
                                    id="deskripsi"
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="harga" className="text-right">
                                    Harga
                                </Label>
                                <Input id="harga" type="text" value={hargaFormatted} onChange={handleHargaChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stok" className="text-right">
                                    Stok
                                </Label>
                                <Input
                                    id="stok"
                                    type="number"
                                    value={formData.stok}
                                    onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ukuran" className="text-right">
                                    Ukuran
                                </Label>
                                <div className="col-span-3 flex items-center gap-4">
                                    {ukuranOptions.map((ukuran) => (
                                        <div key={ukuran} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`ukuran-${ukuran}`}
                                                checked={formData.ukuran.includes(ukuran)}
                                                onCheckedChange={(checked) => handleUkuranChange(ukuran, checked)}
                                            />
                                            <label htmlFor={`ukuran-${ukuran}`} className="text-sm leading-none font-medium">
                                                {ukuran}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="foto" className="text-right">
                                    Foto
                                </Label>
                                <Input
                                    id="foto"
                                    type="file"
                                    onChange={(e) => setFotoFile(e.target.files ? e.target.files[0] : null)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="categoryId" className="text-right">
                                    Kategori
                                </Label>
                                <Select
                                    value={formData.categoryId ? String(formData.categoryId) : ''}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoriesList &&
                                            categoriesList.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
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
