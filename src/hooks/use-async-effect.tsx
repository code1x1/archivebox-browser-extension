import { useEffect } from 'preact/hooks'

export function useAsyncEffect(callback: () => Promise<void>) {
    useEffect(() => {
        ;(async () => {
            await callback()
        })()
    }, [callback])
}
