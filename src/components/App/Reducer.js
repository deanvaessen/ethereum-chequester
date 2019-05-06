import {
    ACTION_APP_FETCH_CHEQUES,
    ACTION_APP_FETCH_CHEQUES_SUCCESS,
    ACTION_APP_FETCH_CHEQUES_ERROR,
    ACTION_APP_FETCH_BENEFICIARIES,
    ACTION_APP_FETCH_BENEFICIARIES_SUCCESS,
    ACTION_APP_FETCH_BENEFICIARIES_ERROR,
    ACTION_APP_FETCH_CHEQUE_BOOKS,
    ACTION_APP_FETCH_CHEQUE_BOOKS_SUCCESS,
    ACTION_APP_FETCH_CHEQUE_BOOKS_ERROR,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_SUCCESS,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_ERROR,
    ACTION_APP_REMOVE_CHEQUE_SUCCESS,
    ACTION_APP_ADD_BENEFICIARY,
    ACTION_APP_ADD_BENEFICIARY_SUCCESS,
    ACTION_APP_ADD_BENEFICIARY_ERROR,
    ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS,
    ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_SUCCESS,
    ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_ERROR,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_SUCCESS,
    ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_ERROR,
    ACTION_APP_SET_ACTIVE_BENEFICIARY,
    ACTION_APP_SET_ACTIVE_BENEFICIARY_SUCCESS,
    ACTION_APP_SET_ACTIVE_BENEFICIARY_ERROR,
    ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY,
    ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_SUCCESS,
    ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_ERROR,
    ACTION_APP_SET_CHEQUE_AS_PAID_OUT,
    ACTION_APP_SET_CHEQUE_AS_PAID_OUT_SUCCESS,
    ACTION_APP_SET_CHEQUE_AS_PAID_OUT_ERROR
} from "./Actions";

export function defaultAppState() {
    return {
        state : "INIT",

        isFetchingChequeBooks : false,
        isFetchingCheques : false,

        knownChequeBooks : [],
        knownBeneficiaries : [],

        activeEthereumAddress : null,
        activeChequeBook : "",
        activeChequeBookBalance : "0",
        activeBeneficiary : "",
        activeBeneficiaryBalance : "0",

        errorMessage : null,
        etherScanError : null,
        metaMaskError : null
    };
}

export function appReducer( state = defaultAppState(), action ) {
    switch ( action.type ) {
    case ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            activeEthereumAddress : action.address
        };
    case ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_ERROR:
        return {
            ...state,
            state : "ERROR",
            errorMessage : action.errorMessage
        };

    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            activeChequeBook : action.chequeBook,
            activeChequeBookBalance : action.balance
        };
    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_ERROR:
        return {
            ...state,
            state : "ERROR",
            errorMessage : action.errorMessage
        };

    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            activeChequeBookBalance : action.balance
        };
    case ACTION_APP_SET_ACTIVE_CHEQUE_BOOK_BALANCE_ERROR:
        return {
            ...state,
            state : "ERROR",
            errorMessage : action.errorMessage
        };

    case ACTION_APP_SET_ACTIVE_BENEFICIARY:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_SET_ACTIVE_BENEFICIARY_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            activeBeneficiary : action.beneficiary,
            activeBeneficiaryBalance : null
        };
    case ACTION_APP_SET_ACTIVE_BENEFICIARY_ERROR:
        return {
            ...state,
            state : "ERROR",
            errorMessage : action.errorMessage
        };

    case ACTION_APP_FETCH_BENEFICIARIES:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_ADD_BENEFICIARY_SUCCESS:
    case ACTION_APP_FETCH_BENEFICIARIES_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            knownBeneficiaries : action.beneficiaries
        };
    case ACTION_APP_FETCH_BENEFICIARIES_ERROR:
        return {
            ...state,
            state : "ERROR",
            errorMessage : action.errorMessage,
            etherScanError : action.errorMessage
        };

    case ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY:
        return {
            ...state,
            state : "LOADING"
        };
    case ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            activeBeneficiaryBalance : action.balance
        };
    case ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_ERROR:
        return {
            ...state,
            state : "ERROR",
            etherScanError : action.errorMessage,
            errorMessage : action.errorMessage
        };

    case ACTION_APP_FETCH_CHEQUE_BOOKS:
        return {
            ...state,
            isFetchingChequeBooks : true,
            etherScanError : null,
            state : "LOADING"
        };
    case ACTION_APP_FETCH_CHEQUE_BOOKS_SUCCESS:
        return {
            ...state,
            state : "LOADED",
            isFetchingChequeBooks : false,
            knownChequeBooks : action.chequeBooks
        };
    case ACTION_APP_FETCH_CHEQUE_BOOKS_ERROR:
        return {
            ...state,
            state : "ERROR",
            isFetchingChequeBooks : false,
            etherScanError : action.errorMessage,
            errorMessage : action.errorMessage
        };

    case ACTION_APP_SET_CHEQUE_AS_PAID_OUT_SUCCESS:
    case ACTION_APP_REMOVE_CHEQUE_SUCCESS:
        return {
            ...state,
            knownCheques : action.cheques
        };

    case ACTION_APP_FETCH_CHEQUES:
        return {
            ...state,
            isFetchingCheques : true,
            knownCheques : {},
            etherScanError : null,
            state : "LOADING"
        };
    case ACTION_APP_FETCH_CHEQUES_SUCCESS:
        return {
            ...state,
            isFetchingCheques : false,
            state : "LOADED",
            knownCheques : action.cheques
        };
    case ACTION_APP_FETCH_CHEQUES_ERROR:
        return {
            ...state,
            isFetchingCheques : false,
            state : "ERROR",
            errorMessage : action.errorMessage
        };
    default:
        return state;
    }
}
