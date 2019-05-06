import { default as Component } from "./App";

import { connect } from "react-redux";
import {
    getActiveChequeBook,
    //getActiveChequeBookBalance,
    getKnownChequeBooks,
    getKnownBeneficiaries,
    getActiveBeneficiary,
    getActiveBeneficiaryBalance,
    getActiveEthereumAddress,
    getIsFetchingChequeBooks,
    getIsFetchingCheques,
    getMetaMaskError,
    getEtherScanError
} from "./Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        activeEthereumAddress : getActiveEthereumAddress( state ),
        activeChequeBook : getActiveChequeBook( state ),
        //activeChequeBookBalance : getActiveChequeBookBalance( state ),
        isFetchingChequeBooks : getIsFetchingChequeBooks( state ),
        isFetchingCheques : getIsFetchingCheques( state ),
        knownChequeBooks : getKnownChequeBooks( state ),
        metaMaskError : getMetaMaskError( state ),
        etherScanError : getEtherScanError( state ),
        knownBeneficiaries : getKnownBeneficiaries( state ),
        activeBeneficiary : getActiveBeneficiary( state ),
        activeBeneficiaryBalance : getActiveBeneficiaryBalance( state ),
        location : state.router.location
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
