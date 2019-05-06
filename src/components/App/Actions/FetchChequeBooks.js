/**
 * Fetch known cheque books
 */
export const ACTION_APP_FETCH_CHEQUE_BOOKS = "APP_FETCH_CHEQUE_BOOKS";
export const ACTION_APP_FETCH_CHEQUE_BOOKS_SUCCESS = "APP_FETCH_CHEQUE_BOOKS_SUCCESS";
export const ACTION_APP_FETCH_CHEQUE_BOOKS_ERROR = "APP_FETCH_CHEQUE_BOOKS_ERROR";

function dispatchFetchChequeBooksProgress() {
    return {
        type : ACTION_APP_FETCH_CHEQUE_BOOKS
    };
}

function dispatchFetchChequeBooksSuccess( chequeBooks ) {
    return {
        type : ACTION_APP_FETCH_CHEQUE_BOOKS_SUCCESS,
        chequeBooks
    };
}

function dispatchFetchChequeBooksError( e ) {
    return {
        type : ACTION_APP_FETCH_CHEQUE_BOOKS_ERROR,
        errorMessage : e.message
    };
}

export function actionFetchChequeBooks( dispatch, ethereumInterface ) {
    return activeEthereumAddress => {
        dispatch( dispatchFetchChequeBooksProgress() );

        return fetchChequeBooksFromEthereum( ethereumInterface, activeEthereumAddress )
            .then( results => dispatch( dispatchFetchChequeBooksSuccess( results ) ) )
            .catch( e => dispatch( dispatchFetchChequeBooksError( e ) ) );

        /*
        return Promise.all( [ getStoredChequeBooks, fetchChequeBooksFromEthereum ] )
            .then( results => {
                const storedChequeBooks = results[0];
                const fetchedChequeBooks = results[1];

                // @TODO: Merge with unicity in-tact
                return dispatch( dispatchFetchChequeBooksSuccess( chequeBooks ) );
            } )
            .catch( e => {
                return dispatch( dispatchFetchChequeBooksError( e ) );
            } );
        */
    };
}

// I do not store cheque books themselves, only their address and their beneficiaries
/*
function getStoredChequeBooks( ethereumAddress ) {
    return new Promise( ( resolve, reject ) => {
        const cache = JSON.parse( localStorage.getItem( ethereumAddress ) );

        resolve( cache?.chequeBooks || [] );
    } );
}
*/

const fetchChequeBooksFromEthereum = ( ethereumInterface, activeEthereumAddress ) => {
    return ethereumInterface.getUserChequeBooks( activeEthereumAddress ).then( results =>
        results.map( contract => ( {
            balance : contract.balance,
            alias : contract.alias,
            address : contract.contractAddress.toLowerCase() // EtherScan and web3 sometimes give different cases
        } ) )
    );
};
