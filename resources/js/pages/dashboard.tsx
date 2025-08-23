import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DataPoint {
    name: string;
    value: number;
}

interface Props {
    TotalProduk: number;
    TotalOrder: number;
    TotalTransaksi: number;
}

export default function Dashboard({ TotalProduk, TotalOrder, TotalTransaksi }: Props) {
    const data: DataPoint[] = [
        { name: 'Produk', value: TotalProduk },
        { name: 'Pesanan', value: TotalOrder },
        { name: 'Income', value: TotalTransaksi }, // Asumsi TotalTransaksi adalah total pendapatan
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <h1 className="text-2xl font-bold">Penyimpanan</h1>
            
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {/* Total Produk Card */}
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center p-4">
                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl font-bold">{TotalProduk}</h2>
                        <p className="text-sm">Total Produk</p>
                        <p className="text-xs text-gray-500">Total keseluruhan produk</p>
                    </div>
                </div>

                {/* Total Pesanan Card */}
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center p-4">
                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl font-bold">{TotalOrder}</h2>
                        <p className="text-sm">Total Pesanan</p>
                        <p className="text-xs text-gray-500">Total keseluruhan pesanan</p>
                    </div>
                </div>

                {/* Total Income Card */}
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center p-4">
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold">Rp {TotalTransaksi.toLocaleString('id-ID')},-</h2>
                        <p className="text-sm">Total Transaksi</p>
                        <p className="text-xs text-gray-500">Total keseluruhan transaksi</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-gray-200 dark:bg-gray-800 p-4">
                <div className="relative z-10 w-full h-full">
                    <h3 className="text-lg font-semibold mb-4 text-center">Statistik Penyimpanan & Pendapatan</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        </AppLayout>
    );
}
