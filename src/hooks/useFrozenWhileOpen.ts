import { useRef } from 'react';

/**
 * Keeps a dialog's contents readable while it animates shut.
 *
 * Radix takes about 300ms to close, and the row the dialog describes is often
 * gone before that finishes — an optimistic update removes it, or a refetch
 * reshapes it. Read straight from the row and the body blanks out or throws
 * mid-animation, so the last thing the user sees is the dialog emptying
 * itself.
 *
 * While open, the latest value passes through. Once closing, the last value
 * seen is held, so the dialog fades out still saying what it said.
 *
 *   const request = useFrozenWhileOpen(open, row.original);
 */
export function useFrozenWhileOpen<T>(open: boolean, value: T): T {
    const held = useRef(value);
    if (open) held.current = value;
    return held.current;
}
