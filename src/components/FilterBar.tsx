'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    searchPlaceholder?: string;
    filterOptions?: {
        key: string;
        label: string;
        options: FilterOption[];
    }[];
}

export default function FilterBar({ searchPlaceholder = 'Suchen...', filterOptions = [] }: FilterBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (searchTerm !== currentQ) {
                updateURL('q', searchTerm);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete('page');

        const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;

        startTransition(() => {
            router.push(newURL);
            router.refresh();
        });
    };

    const resetFilters = () => {
        setSearchTerm('');
        const params = new URLSearchParams(searchParams.toString());

        filterOptions.forEach(opt => params.delete(opt.key));
        params.delete('q');
        params.delete('page');

        const remainingParams = params.toString();
        const newURL = remainingParams ? `${pathname}?${remainingParams}` : pathname;

        startTransition(() => {
            router.push(newURL);
            router.refresh();
        });
    };

    const activeFiltersCount = Array.from(searchParams.keys()).filter(k => k !== 'origin').length;

    return (
        <section className={`w-full max-w-6xl mb-12 p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md transition-all ${isPending ? 'opacity-60 cursor-wait' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 relative">
                    <label className="input-label">Suche</label>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                    />
                    {isPending && (
                        <div className="absolute right-3 bottom-3 animate-spin h-4 w-4 border-2 border-[var(--primary)] border-t-transparent rounded-full" />
                    )}
                </div>

                {filterOptions.map((filter) => (
                    <div key={filter.key} className="md:col-span-3">
                        <label className="input-label">{filter.label}</label>
                        <select
                            value={searchParams.get(filter.key) || ''}
                            onChange={(e) => updateURL(filter.key, e.target.value)}
                            className="input-field cursor-pointer"
                        >
                            <option value="">Alle anzeigen</option>
                            {filter.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <div className="md:col-span-1 flex justify-end">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="h-[46px] px-4 text-sm font-medium text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}