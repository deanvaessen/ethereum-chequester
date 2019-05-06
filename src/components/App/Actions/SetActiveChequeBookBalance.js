export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE = "APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE";
export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_SUCCESS =
    "APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_SUCCESS";
export const ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_ERROR =
    "APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_ERROR";

function dispatchSetActiveChequeBookBalanceProgress() {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE
    };
}

function dispatchSetActiveChequeBookBalanceSuccess( balance ) {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_SUCCESS,
        balance
    };
}

function dispatchSetActiveChequeBookBalanceError( e ) {
    return {
        type : ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_ERROR,
        errorMessage : e.message
    };
}

export function actionSetActiveChequeBookBalance( dispatch ) {
    return balance => {
        dispatch( dispatchSetActiveChequeBookBalanceProgress() );

        return dispatch( dispatchSetActiveChequeBookBalanceSuccess( balance ) );
    };
}
