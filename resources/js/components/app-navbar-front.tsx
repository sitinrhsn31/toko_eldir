import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string; // Tambahkan role jika diperlukan
        } | null;
    };
}

export default function MyNavbar({ auth, canLogin, canRegister }: Props) {
    // Fungsi untuk logout
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <nav className="bg-pink-500 text-white shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-12 items-center justify-between space-x-8">
                    {/* Navigasi Kiri */}
                    <div className="flex h-12 items-center space-x-8">
                        <Link href={route('home')} className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline">
                            Beranda
                        </Link>
                        <Link
                            href={route('front.produk')}
                            className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
                        >
                            Produk
                        </Link>

                        {/* Dropdown Kategori dengan gaya tombol */}
                        {/* <Select onValueChange={(value) => (window.location.href = value)}>
                            <SelectTrigger className="inline-flex items-center gap-1 rounded-lg border-0 bg-white px-4 py-2 text-sm font-semibold text-pink-500 transition-colors hover:bg-gray-100">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-gray-800">
                                {categoriesList.map((category) => (
                                    <SelectItem key={category.id} value={route('front.kategori', { categoryId: category.id })}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select> */}

                        <Link
                            href={route('front.tentang-kami')}
                            className="inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
                        >
                            Tentang Kami
                        </Link>
                        {auth.user ? (
                            <Link href={route('front.pesanan')}>Pesanan Saya</Link>
                        ) : null }

                    </div>

                    {/* Autentikasi Kanan */}
                    <div className="flex items-center space-x-4">
                        {/* Memeriksa apakah pengguna sudah login */}
                        {auth.user ? (
                            // Tampilkan Dropdown Menu jika pengguna sudah login
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-white hover:bg-white/20">
                                        {auth.user.name} <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('profile.edit')}>Pengaturan Profil</Link>
                                    </DropdownMenuItem>
                                    {auth.user.role === 'admin' && (
                                        <DropdownMenuItem asChild>
                                            <Link href={route('dashboard')}>Dashboard Admin</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // Tampilkan tombol Login/Register jika belum login
                            <>
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="font-semibold text-white underline-offset-4 transition-colors hover:underline"
                                    >
                                        Login
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-white px-4 py-2 font-semibold text-pink-500 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-white focus:outline-none"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
