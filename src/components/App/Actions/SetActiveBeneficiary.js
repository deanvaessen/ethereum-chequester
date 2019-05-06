export const ACTION_APP_SET_ACTIVE_BENEFICIARY = "APP_SET_ACTIVE_BENEFICIARY";
export const ACTION_APP_SET_ACTIVE_BENEFICIARY_SUCCESS = "APP_SET_ACTIVE_BENEFICIARY_SUCCESS";
export const ACTION_APP_SET_ACTIVE_BENEFICIARY_ERROR = "APP_SET_ACTIVE_BENEFICIARY_ERROR";

function dispatchSetActiveBeneficiaryProgress() {
    return {
        type : ACTION_APP_SET_ACTIVE_BENEFICIARY
    };
}

function dispatchSetActiveBeneficiarySuccess( beneficiary ) {
    return {
        type : ACTION_APP_SET_ACTIVE_BENEFICIARY_SUCCESS,
        beneficiary
    };
}

function dispatchSetActiveBeneficiaryError( e ) {
    return {
        type : ACTION_APP_SET_ACTIVE_BENEFICIARY_ERROR,
        errorMessage : e.message
    };
}

export function actionSetActiveBeneficiary( dispatch ) {
    return beneficiary => {
        dispatch( dispatchSetActiveBeneficiaryProgress() );

        return selectBeneficiary( beneficiary )
            .then( beneficiary => {
                return dispatch( dispatchSetActiveBeneficiarySuccess( beneficiary ) );
            } )
            .catch( e => {
                return dispatch( dispatchSetActiveBeneficiaryError( e ) );
            } );
    };
}

function selectBeneficiary( beneficiary ) {
    return new Promise( ( resolve, reject ) => {
        resolve( beneficiary || "" );
    } );
}
