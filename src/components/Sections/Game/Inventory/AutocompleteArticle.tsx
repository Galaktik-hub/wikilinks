// AutocompleteSuggestions.tsx
"use client";
import React, {useEffect, useState, useRef} from "react";

interface Props {
    query: string;
    onSelect: (value: string) => void;
}

export const AutocompleteArticle: React.FC<Props> = ({query, onSelect}) => {
    const [list, setList] = useState<string[]>([]);
    const timer = useRef<number>();

    useEffect(() => {
        if (timer.current) window.clearTimeout(timer.current);
        if (!query) {
            setList([]);
            return;
        }
        timer.current = window.setTimeout(async () => {
            try {
                const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${encodeURIComponent(query)}`);
                const data = await res.json();
                setList(data[1] || []);
            } catch {
                setList([]);
            }
        }, 300);
        return () => {
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, [query]);

    if (!list.length) return null;
    return (
        <ul className="absolute z-50 w-full bg-darkBg border border-gray-700 rounded-b-lg max-h-60 overflow-auto">
            {list.map(item => (
                <li key={item} onClick={() => onSelect(item)} className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">
                    {item}
                </li>
            ))}
        </ul>
    );
};
