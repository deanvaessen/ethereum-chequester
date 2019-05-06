/**
 * Fetch known beneficaries
 */
export const ACTION_APP_FETCH_BENEFICIARIES = "APP_FETCH_BENEFICIARIES";
export const ACTION_APP_FETCH_BENEFICIARIES_SUCCESS = "APP_FETCH_BENEFICIARIES_SUCCESS";
export const ACTION_APP_FETCH_BENEFICIARIES_ERROR = "APP_FETCH_BENEFICIARIES_ERROR";

function dispatchFetchBeneficiariesProgress() {
    return {
        type : ACTION_APP_FETCH_BENEFICIARIES
    };
}

function dispatchFetchBeneficiariesSuccess( beneficiaries ) {
    return {
        type : ACTION_APP_FETCH_BENEFICIARIES_SUCCESS,
        beneficiaries
    };
}

function dispatchFetchBeneficiariesError( e ) {
    return {
        type : ACTION_APP_FETCH_BENEFICIARIES_ERROR,
        errorMessage : e.message
    };
}

export function actionFetchBeneficiaries( dispatch ) {
    return ( ethereumAddress, chequeBook ) => {
        dispatch( dispatchFetchBeneficiariesProgress() );

        return getStoredBeneficiaries( ethereumAddress, chequeBook )
            .then( beneficiaries => {
                return dispatch( dispatchFetchBeneficiariesSuccess( beneficiaries ) );
            } )
            .catch( e => {
                return dispatch( dispatchFetchBeneficiariesError( e ) );
            } );
    };
}

function getStoredBeneficiaries( ethereumAddress, chequeBook ) {
    return new Promise( ( resolve, reject ) => {
        const cache = JSON.parse( localStorage.getItem( ethereumAddress ) )?.cheques || {};

        resolve( Object.keys( cache[chequeBook] || {} ) );
    } );
}
