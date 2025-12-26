"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  onSearch,
  placeholder = "Search...",
  className = "",
}: Props) {
  const [input, setInput] = useState("");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-full max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-8 pr-3 py-1.5
            border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      <button
        type="button"
        onClick={() => onSearch(input)}
        className="
          px-3 py-1.5 rounded-lg
          bg-blue-600 text-white text-sm
          hover:bg-blue-700 transition
          whitespace-nowrap
        "
      >
        Search
      </button>
    </div>
  );
}