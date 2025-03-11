import React, { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { Command, CommandList, CommandItem } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
}

interface SearchComboboxProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchCombobox({
  onSearch,
  onSelect,
  placeholder = "Search songs...",
  className,
}: SearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [onSearch]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      setLoading(true);
      debouncedSearch(searchQuery);
    },
    [debouncedSearch]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {value || placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <input
              data-testid="search-combobox-input"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
            />
          </div>
          {loading && (
            <div
              data-testid="search-loading"
              className="py-6 text-center text-sm"
            >
              Loading...
            </div>
          )}
          {!loading && results.length === 0 && query && (
            <div className="py-6 text-center text-sm">No results found.</div>
          )}
          {!loading && results.length > 0 && (
            <CommandList>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    setValue(result.title);
                    setOpen(false);
                    onSelect(result);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5"
                >
                  <img
                    src={result.albumArt}
                    alt={`${result.title} album art`}
                    className="h-8 w-8 rounded-sm object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{result.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {result.artist}
                    </span>
                  </div>
                  <Check className="ml-auto h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
                </CommandItem>
              ))}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
