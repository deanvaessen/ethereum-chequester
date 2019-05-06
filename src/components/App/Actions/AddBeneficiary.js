import { actionSetBeneficiaries } from "./";
export const ACTION_APP_ADD_BENEFICIARY = "APP_ADD_BENEFICIARY";
export const ACTION_APP_ADD_BENEFICIARY_SUCCESS = "APP_ADD_BENEFICIARY_SUCCESS";
export const ACTION_APP_ADD_BENEFICIARY_ERROR = "APP_ADD_BENEFICIARY_ERROR";

function dispatchAddBeneficiaryProgress() {
    return {
        type : ACTION_APP_ADD_BENEFICIARY
    };
}

function dispatchAddBeneficiarySuccess( beneficiaries ) {
    return {
        type : ACTION_APP_ADD_BENEFICIARY_SUCCESS,
        beneficiaries
    };
}

function dispatchAddBeneficiaryError( e ) {
    return {
        type : ACTION_APP_ADD_BENEFICIARY_ERROR,
        errorMessage : e.message
    };
}

export function actionAddBeneficiary( dispatch ) {
    return ( beneficiary, beneficiaries ) => {
        dispatch( dispatchAddBeneficiaryProgress() );

        // Make unique list
        const updatedBeneficiaries = [ { address : beneficiary } ].concat(
            beneficiaries.filter( beneficiary => beneficiary.address !== beneficiary )
        );

        return dispatch( dispatchAddBeneficiarySuccess( updatedBeneficiaries ) );
    };
}
