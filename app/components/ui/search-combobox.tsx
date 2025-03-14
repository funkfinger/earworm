import React, { useState, useCallback } from "react";
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
      setOpen(true);
      setLoading(true);
      debouncedSearch(searchQuery);
    },
    [debouncedSearch]
  );

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setQuery(result.title);
      setOpen(false);
      onSelect(result);
    },
    [onSelect]
  );

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "handdrawn-input handdrawn-border"
        )}
        onFocus={() => query && setOpen(true)}
      />
      {open && (
        <div className={cn("absolute left-0 top-full z-50 mt-2 w-full")}>
          <div
            className={cn(
              "rounded-lg border border-input bg-background shadow-lg",
              "handdrawn-card"
            )}
          >
            {loading && (
              <div
                data-testid="search-loading"
                className={cn("py-6 text-center text-sm", "handdrawn-text")}
              >
                Loading...
              </div>
            )}
            {!loading && results.length === 0 && query && (
              <div className={cn("py-6 text-center text-sm", "handdrawn-text")}>
                No results found.
              </div>
            )}
            {!loading && results.length > 0 && (
              <div className="max-h-[300px] overflow-auto">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 hover:bg-accent/10",
                      "handdrawn-button"
                    )}
                  >
                    <img
                      src={result.albumArt}
                      alt={`${result.title} album art`}
                      className="h-10 w-10 rounded-sm object-cover"
                    />
                    <div className="flex flex-col text-left">
                      <span
                        className={cn("text-sm font-medium", "handdrawn-text")}
                      >
                        {result.title}
                      </span>
                      <span
                        className={cn(
                          "text-xs text-muted-foreground",
                          "handdrawn-text"
                        )}
                      >
                        {result.artist}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
