import PropTypes from "prop-types";
import { Fragment } from "react";
import { Row } from "react-bootstrap";
import FormSpacer from "../FormSpacer";
import ChequebookOverview from "../ChequebookOverview";
import RequestChequeBook from "../../containers/RequestChequeBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

export default class MyChequeBooks extends React.PureComponent {
    static propTypes = {
        currentChequeBooks : PropTypes.array,
        activeChequeBook : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        etherscanError : PropTypes.string,
        currentEthereumAddress : PropTypes.string,
        selectChequeBook : PropTypes.func.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired
    };

    render() {
        const {
            currentChequeBooks,
            ethereumInterface,
            getCurrentChequeBooks,
            selectChequeBook,
            activeChequeBook,
            currentEthereumAddress,
            etherscanError
        } = this.props;

        return (
            <Fragment>
                <h5 className="mt-4">My cheque books</h5>
                <hr className="mt-2 mb-4" />

                <Row className="mb-4 ml-0 mr-0">
                    <RequestChequeBook ethereumInterface={ethereumInterface} />
                </Row>

                <ChequebookOverview
                    handleSelect={selectChequeBook}
                    chequebooks={currentChequeBooks}
                    activeChequeBook={activeChequeBook}
                    currentEthereumAddress={currentEthereumAddress}
                    getCurrentChequeBooks={getCurrentChequeBooks}
                    etherscanError={etherscanError}
                    shouldRenderCompact={true}
                />
            </Fragment>
        );
    }
}
