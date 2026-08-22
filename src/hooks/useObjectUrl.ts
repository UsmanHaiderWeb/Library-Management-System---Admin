import { useEffect, useState } from 'react';

/**
 * Object URL for a File/Blob that is revoked when the value changes or the
 * component unmounts. Calling `URL.createObjectURL` inline in render leaks a
 * new URL on every render.
 */
export const useObjectUrl = (value: Blob | null | undefined): string | undefined => {
    const [url, setUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!value) {
            setUrl(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(value);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    return url;
};
