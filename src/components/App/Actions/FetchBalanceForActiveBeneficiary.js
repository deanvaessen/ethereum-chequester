export const ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY =
    "APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY";
export const ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_SUCCESS =
    "APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_SUCCESS";
export const ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_ERROR =
    "APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_ERROR";

function dispatchBalanceForActiveBeneficiaryProgress() {
    return {
        type : ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY
    };
}

function dispatchBalanceForActiveBeneficiarySuccess( balance ) {
    return {
        type : ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_SUCCESS,
        balance
    };
}

function dispatchBalanceForActiveBeneficiaryError( e ) {
    return {
        type : ACTION_APP_FETCH_BALANCE_FOR_ACTIVE_BENEFICIARY_ERROR,
        errorMessage : e.message
    };
}

export function actionFetchBalanceForActiveBeneficiary( dispatch, ethereumInterface ) {
    return address => {
        dispatch( dispatchBalanceForActiveBeneficiaryProgress() );

        return balanceForActiveBeneficiaryFromEthereum( ethereumInterface, address )
            .then( results => dispatch( dispatchBalanceForActiveBeneficiarySuccess( results ) ) )
            .catch( e => dispatch( dispatchBalanceForActiveBeneficiaryError( e ) ) );
    };
}

const balanceForActiveBeneficiaryFromEthereum = ( ethereumInterface, beneficiary ) => {
    return ethereumInterface.getBalance( beneficiary ).then( balance => balance );
};
