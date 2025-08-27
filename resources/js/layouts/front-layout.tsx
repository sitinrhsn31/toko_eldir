import AppFooter from '@/components/app-footer-front';
import AppHeader from '@/components/app-header-front';
import AppNavbar from '@/components/app-navbar-front';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

// Definisikan tipe untuk properti yang diharapkan
interface CustomPageProps extends PageProps {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
    auth: { user: any | null };
}

export default function FrontLayout({ children }: PropsWithChildren) {
    // Menggunakan tipe kustom untuk usePage()
    const { props } = usePage<CustomPageProps>();
    const { canLogin, canRegister, categoriesList, auth } = props;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="fixed top-0 left-0 z-20 w-full">
                <AppHeader />
                <AppNavbar canLogin={canLogin} canRegister={canRegister} categoriesList={categoriesList} auth={auth} />
            </div>

            <main className="relative isolate pt-[124px]">{children}</main>

            <AppFooter />
        </div>
    );
}
