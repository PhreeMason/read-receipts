import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function throttle<T>(callback: () => T, delay: number): () => T {
    let lastCall = 0;
    let lastResult: T;

    return function () {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            lastResult = callback();
        }
        return lastResult;
    };
}