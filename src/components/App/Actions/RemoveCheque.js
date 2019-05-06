/**
 * Remove known cheque
 */
import { fetchOrCreateLocalStorageCache, updateLocalStorageCache } from "../../../LocalStorage";

export const ACTION_APP_REMOVE_CHEQUE = "APP_REMOVE_CHEQUE";
export const ACTION_APP_REMOVE_CHEQUE_SUCCESS = "APP_REMOVE_CHEQUE_SUCCESS";
export const ACTION_APP_REMOVE_CHEQUE_ERROR = "APP_REMOVE_CHEQUE_ERROR";

function dispatchRemoveChequeProgress() {
    return {
        type : ACTION_APP_REMOVE_CHEQUE
    };
}

function dispatchRemoveChequeSuccess( cheques ) {
    return {
        type : ACTION_APP_REMOVE_CHEQUE_SUCCESS,
        cheques
    };
}

function dispatchRemoveChequeError( e ) {
    return {
        type : ACTION_APP_REMOVE_CHEQUE_ERROR,
        errorMessage : e.message
    };
}

export function actionRemoveCheque( dispatch ) {
    return ( activeEthereumAddress, cheque ) => {
        dispatch( dispatchRemoveChequeProgress() );

        return removeCheque( activeEthereumAddress, cheque )
            .then( cheque => {
                return dispatch( dispatchRemoveChequeSuccess( cheque ) );
            } )
            .catch( e => {
                return dispatch( dispatchRemoveChequeError( e ) );
            } );
    };
}

function removeCheque( activeEthereumAddress, cheque ) {
    return new Promise( ( resolve, reject ) => {
        const { contract, beneficiary } = cheque;
        let cache = fetchOrCreateLocalStorageCache( activeEthereumAddress );

        delete cache.cheques[contract][beneficiary];

        updateLocalStorageCache( activeEthereumAddress, cache );

        resolve( cache.cheques );
    } );
}
