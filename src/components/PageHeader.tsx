import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    count?: number;
    createLabel: string;
    createHref: string;
    showBackButton?: boolean;
    backHref?: string;
}

export default function PageHeader({
                                       title,
                                       count,
                                       createLabel,
                                       createHref,
                                       showBackButton,
                                       backHref = '/'
                                   }: PageHeaderProps) {
    return (
        <div className="w-full max-w-6xl flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <Link href={backHref} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                    </Link>
                )}
                <div>
                    <h1 className="!mb-0 text-left font-bold text-3xl">{title}</h1>
                    {count !== undefined && <p className="text-gray-500 text-sm">{count} Einträge gefunden</p>}
                </div>
            </div>
            <Link href={createHref} className="btn-primary !w-auto px-6">
                {createLabel}
            </Link>
        </div>
    );
}