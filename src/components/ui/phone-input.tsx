"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

const countries = [
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Côte d'Ivoire", code: "+225", flag: "🇨🇮" },
  { name: "Sénégal", code: "+221", flag: "🇸🇳" },
  { name: "Cameroun", code: "+237", flag: "🇨🇲" },
  { name: "Bénin", code: "+229", flag: "🇧🇯" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Congo (Brazzaville)", code: "+242", flag: "🇨🇬" },
  { name: "Congo (RDC)", code: "+243", flag: "🇨🇩" },
  { name: "Guinée", code: "+224", flag: "🇬🇳" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Tchad", code: "+235", flag: "🇹🇩" },
  { name: "Centrafrique", code: "+236", flag: "🇨🇫" },
  { name: "Maroc", code: "+212", flag: "🇲🇦" },
  { name: "Algérie", code: "+213", flag: "🇩🇿" },
  { name: "Tunisie", code: "+216", flag: "🇹🇳" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "États-Unis", code: "+1", flag: "🇺🇸" },
  { name: "Belgique", code: "+32", flag: "🇧🇪" },
  { name: "Suisse", code: "+41", flag: "🇨🇭" },
];

interface PhoneInputProps {
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  useEffect(() => {
    if (value && value.startsWith("+")) {
      const found = countries.find((c) => value.startsWith(c.code));
      if (found) setSelectedCountry(found);
    }
  }, [value]);

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setOpen(false);
    
    const phoneNumber = value?.replace(/^\+\d+\s*/, "") || "";
    onChange(`${country.code} ${phoneNumber}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    onChange(`${selectedCountry.code} ${rawValue}`);
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[80px] px-2 justify-between bg-background/50 border-border/50 h-10 rounded-xl hover:bg-background/80 transition-all font-sans shrink-0"
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-slate-900 border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="p-2 border-b border-white/5">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-500 outline-hidden"
                placeholder="Rechercher un pays..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
            {filteredCountries.length === 0 && (
              <div className="py-6 text-center text-sm text-slate-500 italic">
                Aucun pays trouvé.
              </div>
            )}
            {filteredCountries.map((country) => (
              <button
                key={`${country.name}-${country.code}`}
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 group",
                  selectedCountry.code === country.code && selectedCountry.name === country.name && "bg-primary/10 text-primary"
                )}
              >
                <span className="text-xl leading-none">{country.flag}</span>
                <span className="flex-1 text-left font-medium">{country.name}</span>
                <span className="text-slate-500 font-mono text-xs group-hover:text-slate-400">
                  {country.code}
                </span>
                {selectedCountry.code === country.code && selectedCountry.name === country.name && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        value={value?.replace(/^\+\d+\s*/, "") || ""}
        onChange={handlePhoneChange}
        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-sans flex-1"
        placeholder="00 00 00 00"
      />
    </div>
  );
}
