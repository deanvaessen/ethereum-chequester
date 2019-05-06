import { default as Component } from "./IssueCheque";

import { connect } from "react-redux";
import {
    getActiveChequeBook,
    getActiveChequeBookBalance,
    getKnownChequeBooks,
    getKnownBeneficiaries,
    getActiveEthereumAddress,
    getActiveBeneficiary,
    getActiveBeneficiaryBalance,
    getEtherScanError
} from "../../Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        activeChequeBook : getActiveChequeBook( state ),
        activeChequeBookBalance : getActiveChequeBookBalance( state ),
        knownChequeBooks : getKnownChequeBooks( state ),
        etherScanError : getEtherScanError( state ),
        knownBeneficiaries : getKnownBeneficiaries( state ),
        activeBeneficiary : getActiveBeneficiary( state ),
        activeEthereumAddress : getActiveEthereumAddress( state ),
        activeBeneficiaryBalance : getActiveBeneficiaryBalance( state )
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
