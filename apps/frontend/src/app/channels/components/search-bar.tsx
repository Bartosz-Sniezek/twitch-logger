"use client";

import { Input } from "@/components/ui/input";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="w-full max-w-sm">
      <Input
        type="text"
        placeholder={placeholder || "Search... (min 3 characters)"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
