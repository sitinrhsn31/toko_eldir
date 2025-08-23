import React, { PropsWithChildren } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppHeader from '@/components/app-header-front';
import AppNavbar from '@/components/app-navbar-front';
import AppFooter from '@/components/app-footer-front';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    categoriesList: { id: number; name: string }[];
}

export default function FrontLayout({ children }: PropsWithChildren<Props>) {
    const { props } = usePage();
    const canLogin = props.canLogin as boolean;
    const canRegister = props.canRegister as boolean;
    const categoriesList = props.categoriesList as { id: number; name: string }[];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="fixed top-0 left-0 w-full z-20">
                <AppHeader />
                <AppNavbar canLogin={canLogin} canRegister={canRegister} categoriesList={categoriesList} />
            </div>

            <main className="relative isolate pt-[124px]">
                {children}
            </main>

            <AppFooter />
        </div>
    );
}
