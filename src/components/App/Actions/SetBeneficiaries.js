export const ACTION_APP_SET_BENEFICIARIES = "APP_SET_BENEFICIARIES";
export const ACTION_APP_SET_BENEFICIARIES_SUCCESS = "APP_SET_BENEFICIARIES_SUCCESS";
export const ACTION_APP_SET_BENEFICIARIES_ERROR = "APP_SET_BENEFICIARIES_ERROR";

function dispatchSetBeneficiariesProgress() {
    return {
        type : ACTION_APP_SET_BENEFICIARIES
    };
}

function dispatchSetBeneficiariesSuccess( beneficiaries ) {
    return {
        type : ACTION_APP_SET_BENEFICIARIES_SUCCESS,
        beneficiaries
    };
}

function dispatchSetBeneficiariesError( e ) {
    return {
        type : ACTION_APP_SET_BENEFICIARIES_ERROR,
        errorMessage : e.message
    };
}

export function actionSetBeneficiaries( beneficiaries ) {
    return dispatch => {
        dispatch( dispatchSetBeneficiariesProgress() );

        return dispatch( dispatchSetBeneficiariesSuccess( beneficiaries ) );
    };
}
