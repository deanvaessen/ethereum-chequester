import { default as Component } from "./RequestChequeBook";

import { connect } from "react-redux";
import { getActiveEthereumAddress, getKnownChequeBooks } from "../../Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        knownChequeBooks : getKnownChequeBooks( state ),
        activeEthereumAddress : getActiveEthereumAddress( state )
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
