/**
 * Persist known cheque
 */
import { fetchOrCreateLocalStorageCache, updateLocalStorageCache } from "../../../LocalStorage";

export const ACTION_APP_PERSIST_CHEQUE = "APP_PERSIST_CHEQUE";
export const ACTION_APP_PERSIST_CHEQUE_SUCCESS = "APP_PERSIST_CHEQUE_SUCCESS";
export const ACTION_APP_PERSIST_CHEQUE_ERROR = "APP_PERSIST_CHEQUE_ERROR";

function dispatchPersistChequeProgress() {
    return {
        type : ACTION_APP_PERSIST_CHEQUE
    };
}

function dispatchPersistChequeSuccess( cheque ) {
    return {
        type : ACTION_APP_PERSIST_CHEQUE_SUCCESS,
        cheque
    };
}

function dispatchPersistChequeError( e ) {
    return {
        type : ACTION_APP_PERSIST_CHEQUE_ERROR,
        errorMessage : e.message
    };
}

export function actionPersistCheque( dispatch ) {
    return ( activeEthereumAddress, cheque ) => {
        dispatch( dispatchPersistChequeProgress() );

        return setPersistedCheque( activeEthereumAddress, cheque )
            .then( cheque => {
                return dispatch( dispatchPersistChequeSuccess( cheque ) );
            } )
            .catch( e => {
                return dispatch( dispatchPersistChequeError( e ) );
            } );
    };
}

function setPersistedCheque( activeEthereumAddress, cheque ) {
    return new Promise( ( resolve, reject ) => {
        const { contract, beneficiary } = cheque;
        const cache = fetchOrCreateLocalStorageCache( activeEthereumAddress );

        updateLocalStorageCache( activeEthereumAddress, {
            ...cache,
            cheques : {
                ...cache.cheques,
                [contract] : {
                    ...cache.cheques[contract],
                    [beneficiary] : cheque
                }
            }
        } );

        resolve( cheque );
    } );
}
