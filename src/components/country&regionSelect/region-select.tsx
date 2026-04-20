import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { filterRegions, Region } from "./helpers";
//@ts-ignore
import { allCountries as countryRegionData } from "country-region-data";
import { useEffect, useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionSelectProps {
    countryCode: string;
    priorityOptions?: string[];
    whitelist?: string[];
    blacklist?: string[];
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: string;
}

function RegionSelect({
    countryCode,
    priorityOptions = [],
    whitelist = [],
    blacklist = [],
    onChange = () => { },
    className,
    placeholder = "Région",
    disabled = false,
    defaultValue = "",
}: RegionSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [regions, setRegions] = useState<Region[]>([]);

    useEffect(() => {
        if (!countryCode) {
            setRegions([]);
            return;
        }

        const country = (countryRegionData as any[]).find(
            (c: any) => c[1] === countryCode
        );

        if (country) {
            const transformedRegions: Region[] = country[2].map((r: any) => ({
                name: r[0],
                shortCode: r[1],
            }));

            setRegions(
                filterRegions(transformedRegions, priorityOptions, whitelist, blacklist),
            );
        } else {
            setRegions([]);
        }
        setSearchQuery("");
    }, [countryCode]);

    const filteredRegions = useMemo(() => {
        if (!searchQuery) return regions;
        const lowerQuery = searchQuery.toLowerCase();
        return regions.filter((r) =>
            r.name.toLowerCase().includes(lowerQuery) ||
            r.shortCode.toLowerCase().includes(lowerQuery)
        );
    }, [regions, searchQuery]);

    const selectedRegion = useMemo(() => {
        return regions.find((r) => r.shortCode === defaultValue);
    }, [regions, defaultValue]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between bg-background/50 border-border/50 font-normal", className)}
                >
                    {selectedRegion ? selectedRegion.name : placeholder}
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
                        placeholder="Rechercher une région..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div 
                    className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1 overscroll-contain"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {!countryCode ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Veuillez d'abord choisir un pays.
                        </div>
                    ) : regions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Aucune région trouvée pour ce pays.
                        </div>
                    ) : (
                        filteredRegions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Aucun résultat pour cette recherche.
                            </div>
                        ) : (
                            filteredRegions.map((region, index) => (
                                <button
                                    type="button"
                                    key={`${region.shortCode}-${index}`}
                                    className={cn(
                                        "relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        defaultValue === region.shortCode && "bg-accent/50 text-accent-foreground"
                                    )}
                                    onClick={() => {
                                        onChange(region.shortCode);
                                        setOpen(false);
                                        setSearchQuery("");
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            defaultValue === region.shortCode ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {region.name}
                                </button>
                            ))
                        )
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

import React, { memo } from "react";
export default memo(RegionSelect);
