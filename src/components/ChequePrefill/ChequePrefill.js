import PropTypes from "prop-types";
import { Fragment } from "react";
import { Row } from "react-bootstrap";
import FormSpacer from "../FormSpacer";
import ChequebookOverview from "../ChequebookOverview";
import ChequeUploader from "../ChequeUploader";
import RequestChequeBook from "../RequestChequeBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

export default class ChequePrefill extends React.PureComponent {
    static propTypes = {
        currentChequeBooks : PropTypes.array,
        activeChequeBook : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        files : PropTypes.array.isRequired,
        fileError : PropTypes.string,
        etherscanError : PropTypes.string,
        currentEthereumAddress : PropTypes.string,
        selectChequeBook : PropTypes.func.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired,
        onDropAttempt : PropTypes.func.isRequired,
        onDropSuccess : PropTypes.func.isRequired,
        onDropFailure : PropTypes.func.isRequired
    };

    render() {
        const {
            currentChequeBooks,
            ethereumInterface,
            files,
            getCurrentChequeBooks,
            fileError,
            selectChequeBook,
            activeChequeBook,
            onDropAttempt,
            currentEthereumAddress,
            onDropSuccess,
            etherscanError,
            onDropFailure
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

                <FormSpacer />

                <Accordion className="mt-4" style={{ width : "100%" }}>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h6 className="u-position-relative">
                                <FontAwesomeIcon icon="question-circle" className="mr-2" />
                                I want to pre-fill the cheque from a cheque I already made
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <h5>Add most recent cheque for this beneficiary</h5>
                            <hr className="mt-2 mb-4" />

                            <ChequeUploader
                                ethereumInterface={ethereumInterface}
                                onDropAttempt={onDropAttempt}
                                onDropSuccess={onDropSuccess}
                                onDropFailure={onDropFailure}
                                files={files}
                                fileError={fileError}
                                note={
                                    <small>
                                        <p className="mt-0">
                                            This will prefill the necessary information to write the
                                            new cheque.
                                            <br />
                                            Skip this step if you have no previous cheque or have
                                            already filled in the details above.
                                        </p>
                                    </small>
                                }
                            />
                        </AccordionItemBody>
                    </AccordionItem>
                </Accordion>
            </Fragment>
        );
    }
}
