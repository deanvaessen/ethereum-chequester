export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK = "APP_SET_ACTIVE_CHEQUE_BOOK";
export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_SUCCESS = "APP_SET_ACTIVE_CHEQUE_BOOK_SUCCESS";
export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_ERROR = "APP_SET_ACTIVE_CHEQUE_BOOK_ERROR";

import { getBalanceOfChequeBook } from "./helpers/ChequeBook";

function dispatchSetActiveChequeBookProgress() {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK
    };
}

function dispatchSetActiveChequeBookSuccess( chequeBook, balance ) {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_SUCCESS,
        chequeBook,
        balance
    };
}

function dispatchSetActiveChequeBookError( e ) {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_ERROR,
        errorMessage : e.message
    };
}

export function actionSetActiveChequeBook( dispatch ) {
    return ( chequeBook, knownChequeBooks ) => {
        dispatch( dispatchSetActiveChequeBookProgress() );

        return selectChequeBook( chequeBook, knownChequeBooks )
            .then( result => {
                const { chequeBook, balance } = result;

                return dispatch( dispatchSetActiveChequeBookSuccess( chequeBook, balance ) );
            } )
            .catch( e => {
                return dispatch( dispatchSetActiveChequeBookError( e ) );
            } );
    };
}

function selectChequeBook( address, knownChequeBooks ) {
    return new Promise( ( resolve, reject ) => {
        if ( !address ) {
            resolve( {
                chequeBook : "",
                balance : null
            } );
        }

        const balance = getBalanceOfChequeBook( address, knownChequeBooks );

        resolve( {
            chequeBook : address,
            balance : balance || "N/A"
        } );
    } );
}
