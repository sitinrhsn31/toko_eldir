import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import FrontLayout from '@/layouts/front-layout'; // Impor FrontLayout
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props; // Ambil auth prop

    // Periksa peran pengguna untuk menentukan layout
    const isUserRole = auth.user?.role === 'user';

    // Pilih layout yang akan digunakan
    const LayoutComponent = isUserRole ? FrontLayout : AppLayout;

    return (
        <LayoutComponent {...(isUserRole ? {} : { breadcrumbs: breadcrumbs })}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </LayoutComponent>
    );
}
