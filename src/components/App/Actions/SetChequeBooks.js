export const ACTION_APP_SET_CHEQUE_BOOKS = "APP_SET_CHEQUE_BOOKS";
export const ACTION_APP_SET_CHEQUE_BOOKS_SUCCESS = "APP_SET_CHEQUE_BOOKS_SUCCESS";
export const ACTION_APP_SET_CHEQUE_BOOKS_ERROR = "APP_SET_CHEQUE_BOOKS_ERROR";

function dispatchSetChequeBooksProgress() {
    return {
        type : ACTION_APP_SET_CHEQUE_BOOKS
    };
}

function dispatchSetChequeBooksSuccess( chequeBooks ) {
    return {
        type : ACTION_APP_SET_CHEQUE_BOOKS_SUCCESS,
        chequeBooks
    };
}

function dispatchSetChequeBooksError( e ) {
    return {
        type : ACTION_APP_SET_CHEQUE_BOOKS_ERROR,
        errorMessage : e.message
    };
}

export function actionSetChequeBooks( dispatch ) {
    return chequeBooks => {
        dispatch( dispatchSetChequeBooksProgress() );

        return dispatch( dispatchSetChequeBooksSuccess( chequeBooks ) );
    };
}
