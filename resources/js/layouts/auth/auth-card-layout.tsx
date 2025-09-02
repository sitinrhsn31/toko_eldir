import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <div className="w-full flex justify-start">
                    <button
                        onClick={() => window.history.back()}
                        className="mb-8 flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-gray-800 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-semibold">Kembali</span>
                    </button>
                </div>
            <div className="flex w-full flex-col items-center justify-start max-w-md">
                <div className="flex w-full flex-col items-center gap-6">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                        <div className="flex h-9 w-9 items-center justify-center">
                            <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                        </div>
                    </Link>

                    <Card className="w-full rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
