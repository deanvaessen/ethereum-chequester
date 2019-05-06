/**
 * Fetch known cheque books
 */
export const ACTION_APP_FETCH_CHEQUES = "APP_FETCH_CHEQUES";
export const ACTION_APP_FETCH_CHEQUES_SUCCESS = "APP_FETCH_CHEQUES_SUCCESS";
export const ACTION_APP_FETCH_CHEQUES_ERROR = "APP_FETCH_CHEQUES_ERROR";

import { fetchOrCreateLocalStorageCache } from "../../../LocalStorage";

function dispatchFetchChequesProgress() {
    return {
        type : ACTION_APP_FETCH_CHEQUES
    };
}

function dispatchFetchChequesSuccess( cheques ) {
    return {
        type : ACTION_APP_FETCH_CHEQUES_SUCCESS,
        cheques
    };
}

function dispatchFetchChequesError( e ) {
    return {
        type : ACTION_APP_FETCH_CHEQUES_ERROR,
        errorMessage : e.message
    };
}

export function actionFetchCheques( dispatch ) {
    return activeEthereumAddress => {
        dispatch( dispatchFetchChequesProgress() );

        return getStoredCheques( activeEthereumAddress )
            .then( results => dispatch( dispatchFetchChequesSuccess( results ) ) )
            .catch( e => dispatch( dispatchFetchChequesError( e ) ) );
    };
}

function getStoredCheques( ethereumAddress ) {
    return new Promise( ( resolve, reject ) => {
        const cache = fetchOrCreateLocalStorageCache( ethereumAddress );

        resolve( cache.cheques );
    } );
}
