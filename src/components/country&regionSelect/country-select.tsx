import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { Input } from "@/src/components/ui/input";
import { filterCountries, CountryRegion } from "./helpers";
//@ts-ignore
import { allCountries as countryRegionData } from "country-region-data";
import { useEffect, useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
    priorityOptions?: string[];
    whitelist?: string[];
    blacklist?: string[];
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
    defaultValue?: string;
}

function CountrySelect({
    priorityOptions = [],
    whitelist = [],
    blacklist = [],
    onChange = () => { },
    className,
    placeholder = "Pays",
    defaultValue = "",
}: CountrySelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [countries, setCountries] = useState<CountryRegion[]>([]);

    useEffect(() => {
        // Transform raw array data into objects
        const transformedData: CountryRegion[] = (countryRegionData as any[]).map((c) => ({
            countryName: c[0],
            countryShortCode: c[1],
            regions: c[2].map((r: any) => ({
                name: r[0],
                shortCode: r[1],
            })),
        }));

        setCountries(
            filterCountries(transformedData, priorityOptions, whitelist, blacklist),
        );
    }, []);

    const filteredCountries = useMemo(() => {
        if (!searchQuery) return countries;
        const lowerQuery = searchQuery.toLowerCase();
        return countries.filter((c) =>
            c.countryName.toLowerCase().includes(lowerQuery) ||
            c.countryShortCode.toLowerCase().includes(lowerQuery)
        );
    }, [countries, searchQuery]);

    const selectedCountry = useMemo(() => {
        return countries.find((c) => c.countryShortCode === defaultValue);
    }, [countries, defaultValue]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between bg-background/50 border-border/50 font-normal", className)}
                >
                    {selectedCountry ? selectedCountry.countryName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]" 
                align="start"
            >
                <div className="flex items-center border-b px-3 py-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        autoFocus
                        className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Rechercher un pays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div 
                    className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1 overscroll-contain"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {filteredCountries.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Aucun pays trouvé.
                        </div>
                    ) : (
                        filteredCountries.map((country, index) => (
                            <button
                                type="button"
                                key={`${country.countryShortCode}-${index}`}
                                className={cn(
                                    "relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    defaultValue === country.countryShortCode && "bg-accent/50 text-accent-foreground"
                                )}
                                onClick={() => {
                                    onChange(country.countryShortCode);
                                    setOpen(false);
                                    setSearchQuery("");
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        defaultValue === country.countryShortCode ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {country.countryName}
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

import React, { memo } from "react";
export default memo(CountrySelect);
