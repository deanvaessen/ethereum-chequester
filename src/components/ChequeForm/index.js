import { default as Component } from "./ChequeForm";

import { connect } from "react-redux";
import {
    getActiveChequeBook,
    getActiveChequeBookBalance,
    getKnownChequeBooks,
    getKnownBeneficiaries,
    getActiveBeneficiary,
    getActiveEthereumAddress,
    getIsFetchingChequeBooks,
    getActiveBeneficiaryBalance
} from "../../Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        activeChequeBook : getActiveChequeBook( state ),
        activeChequeBookBalance : getActiveChequeBookBalance( state ),
        knownChequeBooks : getKnownChequeBooks( state ),
        knownBeneficiaries : getKnownBeneficiaries( state ),
        activeBeneficiary : getActiveBeneficiary( state ),
        isFetchingChequeBooks : getIsFetchingChequeBooks( state ),
        activeBeneficiaryBalance : getActiveBeneficiaryBalance( state ),
        activeEthereumAddress : getActiveEthereumAddress( state )
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
