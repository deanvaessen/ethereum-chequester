export const ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS = "APP_SET_ACTIVE_ETHEREUM_ADDRESS";
export const ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_SUCCESS =
    "APP_SET_ACTIVE_ETHEREUM_ADDRESS_SUCCESS";
export const ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_ERROR = "APP_SET_ACTIVE_ETHEREUM_ADDRESS_ERROR";

function dispatchSetActiveEthereumAddressProgress() {
    return {
        type : ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS
    };
}

function dispatchSetActiveEthereumAddressSuccess( address ) {
    return {
        type : ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_SUCCESS,
        address
    };
}

function dispatchSetActiveEthereumAddressError( e ) {
    return {
        type : ACTION_APP_SET_ACTIVE_ETHEREUM_ADDRESS_ERROR,
        errorMessage : e.message
    };
}

export function actionSetActiveEthereumAddress( dispatch ) {
    return address => {
        dispatch( dispatchSetActiveEthereumAddressProgress() );

        return dispatch( dispatchSetActiveEthereumAddressSuccess( address ) );
    };
}
