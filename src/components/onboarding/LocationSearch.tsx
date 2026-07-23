import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (val: string, lat: string, lon: string) => void;
}

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationSearch({ value, onChange, onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const token = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;
          if (!token) {
            console.warn("LocationIQ token missing. Falling back to simple text input.");
            setLoading(false);
            return;
          }
          const res = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${token}&q=${query}&limit=5`);
          if (!res.ok) throw new Error("API Limit or Error");
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.warn("LocationIQ autocomplete failed (fallback active):", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, value]);

  const handleSelect = (item: LocationResult) => {
    setQuery(item.display_name);
    setShowDropdown(false);
    onChange(item.display_name);
    if (onSelect) onSelect(item.display_name, item.lat, item.lon);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange(e.target.value); // Fallback to raw text update immediately
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder="e.g. Tokyo, Japan"
          className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel border border-slate-700/50 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        {loading && <Search className="absolute right-3 top-3.5 w-5 h-5 text-slate-500 animate-pulse" />}
      </div>
      
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-[100] w-full mt-2 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={`${item.place_id}-${index}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-slate-800/50 cursor-pointer text-sm text-slate-200 border-b border-slate-700/50 last:border-0 transition-colors"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
