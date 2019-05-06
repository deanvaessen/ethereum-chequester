import { default as Component } from "./Transaction";

import { connect } from "react-redux";
import {
    getActiveEthereumAddress,
    getKnownChequeBooks,
    getActiveChequeBook
} from "../../Selectors";

const mapStateToProps = ( state, props ) => {
    return {
        activeEthereumAddress : getActiveEthereumAddress( state ),
        knownChequeBooks : getKnownChequeBooks( state ),
        activeChequeBook : getActiveChequeBook( state )
    };
};

const connectedComponent = connect( mapStateToProps )( Component );
export default connectedComponent;
