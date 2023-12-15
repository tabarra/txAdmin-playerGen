import { atom, useAtomValue } from "jotai";


export const txAdminUrlAtom = atom('http://localhost:40120/');

export const useApi = () => {
    const txAdminUrl = useAtomValue(txAdminUrlAtom);

    const normalizedTxAdminUrl = txAdminUrl.endsWith('/') ? txAdminUrl : `${txAdminUrl}/`;

    return async (action: string, data: any) => {
        const fetchResult = await fetch(
            `${normalizedTxAdminUrl}dev/${action}`,
            {
                method: "POST", // "GET/POST"
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        return await fetchResult.json();
    }
}
