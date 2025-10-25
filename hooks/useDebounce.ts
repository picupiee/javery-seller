import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value
 * The returned value will only update after the specified delay has passed
 * since the last change to the input value.
 * * @param value The value to debounce (e.g., pingMessage text).
 * @param delay Delay in milliseconds (e.g., 500ms)
 * @return The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay])
    return debouncedValue;
}

export default useDebounce