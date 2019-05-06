const protoCache = { cheques : {} };

// Is called by actions themselves!
export function fetchOrCreateLocalStorageCache( ethereumAddress ) {
    const cache = JSON.parse( localStorage.getItem( ethereumAddress ) );

    if ( !cache ) {
        localStorage.setItem( ethereumAddress, JSON.stringify( protoCache ) );

        return protoCache;
    }

    return cache;
}

export function updateLocalStorageCache( ethereumAddress, cache ) {
    localStorage.setItem( ethereumAddress, JSON.stringify( cache ) );
}
