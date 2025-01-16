'use client'

// #region NEXT DEPEDENCY
import { useParams } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

const getHash = () => typeof window !== 'undefined' ? window.location.hash : '';

/**
 * Hook custom untuk mendeteksi perubahan hash pada URL dengan `window.location.hash`. 
 * 
 * Perlu diingat hook hanya ditrigger saat navigasi dilakukan melalui client-side seperti menggunakan component `Link` 
 * atau hook `useRouter`, jika mengganti hash pada browser URL secara langsung hook ini tidak akan bekerja.
 * 
 * @returns {string} Location hash pada URL beserta tanda pagar `#`
 * @example
 * ```jsx
 * const MyComponent = () => {
 *      const locationHash = useLocationHash();
 *      
 *      // Scroll to hash when hash changes
 *      React.useEffect(() => { 
 *          const element = document.getElementById(locationHash.replace('#', ''));  
 *          if (element) { 
 *              element.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
 *          } 
 *          console.log(locationHash) // e.g.'#myelement'
 *      }, [locationHash]);
 *      ...
 * }
 * ```
 */
const useLocationHash = () => {
    const [isClient, setIsClient] = React.useState(false);
    const [hash, setHash] = React.useState(getHash());
    const params = useParams();

    React.useEffect(() => {
        setIsClient(true);
        setHash(getHash());
    }, [params]);

    return isClient ? hash : '';
}

export default useLocationHash;