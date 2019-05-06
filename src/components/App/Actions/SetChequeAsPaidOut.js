/**
 * Remove known cheque
 */
import { fetchOrCreateLocalStorageCache, updateLocalStorageCache } from "../../../LocalStorage";

export const ACTION_APP_SET_CHEQUE_AS_PAID_OUT = "APP_SET_CHEQUE_AS_PAID_OUT";
export const ACTION_APP_SET_CHEQUE_AS_PAID_OUT_SUCCESS = "APP_SET_CHEQUE_AS_PAID_OUT_SUCCESS";
export const ACTION_APP_SET_CHEQUE_AS_PAID_OUT_ERROR = "APP_SET_CHEQUE_AS_PAID_OUT_ERROR";

function dispatchSetChequeAsPaidOutProgress() {
    return {
        type : ACTION_APP_SET_CHEQUE_AS_PAID_OUT
    };
}

function dispatchSetChequeAsPaidOutSuccess( cheques ) {
    return {
        type : ACTION_APP_SET_CHEQUE_AS_PAID_OUT_SUCCESS,
        cheques
    };
}

function dispatchSetChequeAsPaidOutError( e ) {
    return {
        type : ACTION_APP_SET_CHEQUE_AS_PAID_OUT_ERROR,
        errorMessage : e.message
    };
}

export function actionSetChequeAsPaidOut( dispatch ) {
    return ( activeEthereumAddress, cheque ) => {
        dispatch( dispatchSetChequeAsPaidOutProgress() );

        return setChequeAsPaidOut( activeEthereumAddress, cheque )
            .then( cheque => {
                return dispatch( dispatchSetChequeAsPaidOutSuccess( cheque ) );
            } )
            .catch( e => {
                return dispatch( dispatchSetChequeAsPaidOutError( e ) );
            } );
    };
}

function setChequeAsPaidOut( activeEthereumAddress, cheque ) {
    return new Promise( ( resolve, reject ) => {
        const { contract, beneficiary } = cheque;
        let cache = fetchOrCreateLocalStorageCache( activeEthereumAddress );

        cache.cheques[contract][beneficiary].hasBeenPaidOut = true;

        updateLocalStorageCache( activeEthereumAddress, cache );

        resolve( cache.cheques );
    } );
}
