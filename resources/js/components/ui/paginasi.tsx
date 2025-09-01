import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Tipe data untuk tautan paginasi dari Laravel
interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

// Properti untuk komponen paginasi
interface PaginationProps {
    links: LinkItem[];
}

export default function Pagination({ links }: PaginationProps) {
    // Filter tautan yang tidak diperlukan (seperti label '...')
    const filteredLinks = links.filter((link) => !link.label.includes('...'));

    return (
        <nav className="flex items-center justify-center space-x-2 mt-8">
            {filteredLinks.map(({ url, label, active }, index) => {
                // Tentukan kelas untuk tautan yang tidak aktif
                const inactiveClasses = 'rounded-md border px-3 py-2 text-sm leading-4 text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200';
                // Tentukan kelas untuk tautan yang aktif
                const activeClasses = 'rounded-md border px-3 py-2 text-sm leading-4 bg-primary text-primary-foreground transition-colors duration-200';
                // Tentukan kelas untuk tautan yang dinonaktifkan
                const disabledClasses = 'rounded-md border px-3 py-2 text-sm leading-4 text-gray-400 cursor-not-allowed';

                // Tentukan konten (ikon atau label) berdasarkan label
                let content;
                if (label.includes('Previous')) {
                    content = <ChevronLeft className="h-4 w-4" />;
                } else if (label.includes('Next')) {
                    content = <ChevronRight className="h-4 w-4" />;
                } else {
                    content = <span dangerouslySetInnerHTML={{ __html: label }} />;
                }

                // Tentukan apakah tautan tersebut dinonaktifkan
                const isDisabled = url === null;

                return (
                    <div key={index}>
                        {isDisabled ? (
                            <span className={disabledClasses}>
                                {content}
                            </span>
                        ) : (
                            <Link href={url} className={active ? activeClasses : inactiveClasses}>
                                {content}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
