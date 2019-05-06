import { default as Component } from "./FlushCheques";

import { connect } from "react-redux";
import {
    getKnownCheques,
    getKnownBeneficiaries,
    getActiveEthereumAddress,
    getKnownChequeBooks
} from "../../Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        activeEthereumAddress : getActiveEthereumAddress( state ),
        knownCheques : getKnownCheques( state ),
        knownBeneficiaries : getKnownBeneficiaries( state ),
        knownChequeBooks : getKnownChequeBooks( state )
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
