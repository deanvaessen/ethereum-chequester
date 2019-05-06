import { Fragment } from "react";
import PropTypes from "prop-types";
import ChequeLabel from "../ChequeLabel";
import AlertMessage from "../AlertMessage";
import ActionButtons from "../ActionButtons";
import ChequeUploader from "../ChequeUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EthereumLoadingIndicator from "../EthereumLoadingIndicator";
import { Row, Col, Container, Modal, Button } from "react-bootstrap";
import SubscribeToEventMetaMaskSign from "../Events/SignMetaMask";
import {
    actionRemoveCheque,
    actionAddBeneficiary,
    actionFetchBalanceForActiveBeneficiary,
    actionFetchCheques,
    actionPersistCheque,
    actionFetchChequeBooks,
    actionSetChequeAsPaidOut
} from "../../Actions";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

export default class FlushCheques extends React.Component {
    static propTypes = {
        activeEthereumAddress : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        knownBeneficiaries : PropTypes.array,
        knownChequeBooks : PropTypes.array,
        knownCheques : PropTypes.object,
        etherScanError : PropTypes.string
    };

    initialState = {
        isFlushing : false,
        shouldDisplayHelp : false,
        modalIsOpen : false,
        fileError : null,
        files : [],
        flushWasSuccessful : null,
        flushTargetAddress : null,
        error : null,
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false
    };

    state = this.initialState;

    componentDidMount() {
        SubscribeToEventMetaMaskSign.call( this );
    }

    //@TODO: Move somewhere more sensible
    knownChequesToArray = knownCheques => {
        let cheques = [];

        for ( const contract of Object.keys( knownCheques ) ) {
            const beneficiaries = Object.keys( knownCheques[contract] || [] );

            cheques = cheques.concat(
                beneficiaries.map( beneficiary => knownCheques[contract][beneficiary] )
            );
        }

        return cheques;
    };

    onDropAttempt = callback => {
        this.setState(
            {
                fileError : null
            },
            callback
        );
    };

    onDropSuccess = ( acceptedFiles, cheque ) => {
        const {
            knownChequeBooks,
            knownBeneficiaries,
            dispatch,
            ethereumInterface,
            activeEthereumAddress
        } = this.props;
        const { contract, beneficiary } = cheque;
        const knownChequeBook = knownChequeBooks.find( chequeBook => chequeBook.address == contract );

        if ( !knownChequeBook ) {
            this.onDropFailure(
                "The cheque book for this cheque does not seem to belong to your account."
            );
            return;
        }

        actionPersistCheque( dispatch )( activeEthereumAddress, cheque )
            .then( () => actionAddBeneficiary( dispatch )( beneficiary, knownBeneficiaries ) )
            .then( () =>
                actionFetchBalanceForActiveBeneficiary( dispatch, ethereumInterface )( beneficiary )
            )
            .then( () => actionFetchCheques( dispatch )( activeEthereumAddress ) )
            .then( () =>
                this.setState( {
                    fileError : null,
                    files : acceptedFiles
                } )
            );
    };

    clearFiles = () => this.setState( { files : [], fileError : null } );

    flush = cheque => {
        const { activeEthereumAddress, ethereumInterface, dispatch } = this.props;
        const { contract, beneficiary, amount, previousTotal, signature } = cheque;
        const etherScanDelay = 5000; // @TODO: this is really stupid, but serves as a temporary quick hack to prevent an issue where there is a delay between transaction completion and when the result is available/queryable on EtherScan

        this.setState( {
            isInteractionWithEthereum : true,
            isFlushing : true,
            flushWasSuccessful : false,
            flushTargetAddress : beneficiary,
            error : null
        } );

        return ethereumInterface
            .cashCheque( contract, beneficiary, amount, previousTotal, signature )
            .then( () => {
                this.setState( {
                    isInteractionWithEthereum : false,
                    metaMaskPromptIsAvailable : false,
                    flushTargetAddress : null,
                    flushWasSuccessful : true,
                    isFlushing : false,
                    error : null
                } );
            } )
            .then( () => actionSetChequeAsPaidOut( dispatch )( activeEthereumAddress, cheque ) )
            .then( () => {
                setTimeout( () => {
                    actionFetchChequeBooks( dispatch, ethereumInterface )( activeEthereumAddress );
                }, etherScanDelay );
            } )
            .catch( error => {
                this.setState( {
                    isInteractionWithEthereum : false,
                    metaMaskPromptIsAvailable : false,
                    flushTargetAddress : null,
                    flushWasSuccessful : false,
                    isFlushing : false,
                    error : error.message
                } );
            } );
    };

    onDropFailure = error => {
        this.setState( {
            fileError : error,
            files : []
        } );
    };

    reset = () => {
        this.setState( this.initialState );
    };

    closeModal = () => {
        this.setState( { modalIsOpen : false } );
    };

    openModal = () => {
        this.setState( { modalIsOpen : true } );
    };

    renderKnownCheques = () => {
        const { flushTargetAddress } = this.state;
        const { knownChequeBooks, activeEthereumAddress, dispatch, knownCheques } = this.props;

        // We merge old cheques in as well because we want to retain them to show as flushed
        if ( !knownCheques ) {
            return (
                <AlertMessage
                    style={{ width : "100%" }}
                    intro="No known cheques for this account"
                    message="If you have a cheque saved to the disk, you can also upload it in
                                the previous screen at 'I want to cash a cheque' to cash it out
                                to the beneficiary."
                    instruction="As this feature relies on the browser cache, it may simply mean that you either did
                                not issue any cheques on this browser, or cleared your cache."
                    icon="exclamation-triangle"
                    introDirection="fadeInDown"
                    variant="warning"
                    dismissible={true}
                />
            );
        }

        return Object.keys( knownCheques ).map( contract => {
            const beneficiaries = Object.keys( knownCheques[contract] );
            const alias =
                knownChequeBooks.find( c => c.address.toLowerCase() == contract.toLowerCase() )
                    ?.alias || "UNKNOWN CHEQUE BOOK";

            return (
                <Accordion
                    className="mt-5 mb-4"
                    style={{ width : "100%" }}
                    key={`contract_${contract}`}
                >
                    <AccordionItem expanded={true}>
                        <AccordionItemTitle>
                            <h6 className="u-position-relative">
                                <FontAwesomeIcon
                                    icon="file-contract"
                                    style={{
                                        marginRight : "5px"
                                    }}
                                    className="mr-2"
                                />
                                {alias} - {contract}
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody style={{ width : "100%" }}>
                            {beneficiaries.length == 0 && (
                                <div>
                                    <AlertMessage
                                        style={{ width : "100%" }}
                                        intro="No known cheques for this cheque book"
                                        message="If you have a cheque saved to the disk, you can also upload it in
                                            the previous screen at 'I want to cash a cheque' to cash it out
                                            to the beneficiary."
                                        instruction="As this feature relies on the browser cache, it may simply mean that you either did
                                            not issue any cheques on this browser, or cleared your cache."
                                        icon="exclamation-triangle"
                                        introDirection="fadeInUp"
                                        variant="warning"
                                        dismissible={true}
                                    />
                                </div>
                            )}

                            {beneficiaries.map( beneficiary => {
                                const cheque = knownCheques[contract][beneficiary];
                                const { amount, timestamp, hasBeenPaidOut } = cheque;
                                const isBeingPaidOut = flushTargetAddress == beneficiary;

                                return (
                                    <div
                                        className="mt-3"
                                        key={`contract_${contract}_beneficiary_${beneficiary}`}
                                    >
                                        <ChequeLabel
                                            payOutCheque={() => this.flush( cheque )}
                                            removeCheque={() => {
                                                actionRemoveCheque( dispatch )(
                                                    activeEthereumAddress,
                                                    cheque
                                                );
                                            }}
                                            cheque={cheque}
                                            beneficiary={beneficiary}
                                            isBeingPaidOut={isBeingPaidOut}
                                            hasBeenPaidOut={hasBeenPaidOut}
                                            chequeAmount={amount}
                                            timestamp={timestamp}
                                        />
                                    </div>
                                );
                            } )}
                        </AccordionItemBody>
                    </AccordionItem>
                </Accordion>
            );
        } );
    };

    renderModal = () => {
        const {
            modalIsOpen,
            flushWasSuccessful,
            isInteractionWithEthereum,
            shouldDisplayHelp,
            error,
            metaMaskPromptIsAvailable,
            files,
            fileError
        } = this.state;

        const { ethereumInterface } = this.props;

        return (
            <Modal size="lg" show={modalIsOpen} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>My cheques</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                {shouldDisplayHelp && (
                                    <div className="alert-spacer mb-3">
                                        <AlertMessage
                                            onClose={() =>
                                                this.setState( { shouldDisplayHelp : false } )
                                            }
                                            style={{ width : "100%" }}
                                            intro="How does this work?"
                                            introIsBold={true}
                                            message="Cheques that you have previously written are shown here per cheque book.
                                                You may flush these to force them to be paid out to the beneficiary."
                                            instruction="This feature relies on the browser's local storage. When you issue a cheque, it will be stored locally.
                                                Any time you issue a cheque outside of this browser, or after clearing your cache, they will not be available in this panel.
                                                You may still upload and cash them out in the previous screen."
                                            icon="question"
                                            introDirection="fadeInDown"
                                            variant="info"
                                            dismissible={true}
                                        />
                                    </div>
                                )}

                                <ChequeUploader
                                    ethereumInterface={ethereumInterface}
                                    onDropAttempt={this.onDropAttempt}
                                    onDropSuccess={this.onDropSuccess}
                                    onDropFailure={this.onDropFailure}
                                    files={files}
                                    fileError={fileError}
                                    note={
                                        <Row>
                                            <Col>
                                                <small>
                                                    <p className="mt-0">
                                                        You may upload any cheques you would like to
                                                        manage.
                                                    </p>
                                                </small>
                                            </Col>
                                            {files.length > 0 && (
                                                <Col>
                                                    <Button
                                                        variant="outline-primary"
                                                        style={{ float : "right" }}
                                                        onClick={this.clearFiles}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon="undo"
                                                            className="mr-2"
                                                        />
                                                        Restart
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>{this.renderKnownCheques()}</Col>
                        </Row>
                        {isInteractionWithEthereum && (
                            <span className="mt-5">
                                <EthereumLoadingIndicator />
                            </span>
                        )}

                        {metaMaskPromptIsAvailable && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="Please handle the prompt."
                                    message="MetaMask input requested"
                                    icon="key"
                                    variant="info"
                                    dismissible={true}
                                />
                            </div>
                        )}

                        {flushWasSuccessful && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="All good!"
                                    message="Cheque has been paid out."
                                    messageIsBold={true}
                                    icon="check-circle"
                                    variant="success"
                                    dismissible={true}
                                />
                            </div>
                        )}
                        {error && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="Oh no!"
                                    message={error}
                                    icon="bug"
                                    variant="danger"
                                    dismissible={true}
                                    instruction="Please try again."
                                />
                            </div>
                        )}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <ActionButtons
                        handleConfirmation={this.closeModal}
                        //handleAbort={this.reset}
                        variantConfirmation="primary"
                        confirmationLabel="Done"
                        //abortLabel="Abort"
                        confirmationIcon="check"
                        //variantAbort="danger"
                        //abortIcon="times-circle"
                        //abortIsDisabled={!modalIsOpen}
                        abortShouldNotRender={true}
                        disabled={false}
                        delay={null}
                    />

                    <span style={{ width : "auto" }}>
                        <ActionButtons
                            handleConfirmation={() => this.setState( { shouldDisplayHelp : true } )}
                            variantConfirmation="outline-primary"
                            confirmationLabel="Help"
                            confirmationIcon="question-circle"
                            abortShouldNotRender={true}
                            disabled={false}
                            delay={null}
                        />
                    </span>
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
        return (
            <>
                <h2 className="mt-2">I gave out cheques</h2>

                <hr className="mt-2 mb-4" />

                {this.renderModal()}

                <ActionButtons
                    handleConfirmation={this.openModal}
                    variantConfirmation="primary"
                    confirmationLabel="Show my issued cheques"
                    confirmationIcon="clock"
                    disabled={false}
                    abortShouldNotRender={true}
                    delay={null}
                />
            </>
        );
    }
}
