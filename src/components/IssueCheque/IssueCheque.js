import { Fragment } from "react";
import {
    ListGroup,
    Alert,
    Badge,
    Button,
    Row,
    Col,
    InputGroup,
    Form,
    Nav,
    Card,
    Tabs,
    Tab
} from "react-bootstrap";
import PropTypes from "prop-types";
import FormSpacer from "../FormSpacer";
import AlertMessage from "../AlertMessage";
import SharingOptions from "../SharingOptions";
//import RequestChequeBook from "../RequestChequeBook";
import ChequeOverview from "../ChequeOverview";
import ActionButtons from "../ActionButtons";
import Page from "../Page";
import ChequeForm from "../ChequeForm";
import ChequeUploader from "../ChequeUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EthereumLoadingIndicator from "../EthereumLoadingIndicator";

import {
    actionAddBeneficiary,
    actionSetActiveBeneficiary,
    actionSetActiveChequeBook,
    actionPersistCheque,
    actionFetchCheques,
    actionFetchBalanceForActiveBeneficiary
} from "../../Actions";

import SubscribeToEventMetaMaskSign from "../Events/SignMetaMask";

export default class IssueCheque extends React.Component {
    static propTypes = {
        activeChequeBook : PropTypes.string,
        activeChequeBookBalance : PropTypes.string,
        activeBeneficiaryBalance : PropTypes.string,
        activeBeneficiary : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        etherScanError : PropTypes.string,
        knownChequeBooks : PropTypes.array,
        preFilledBeneficiary : PropTypes.string,
        entranceAnimation : PropTypes.string
    };

    initialState = {
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false,
        ethereumError : null,
        fileError : null,
        files : [],
        amount : "",
        signedCheque : null,
        previousTotal : "0"
    };

    state = this.initialState;

    componentDidMount() {
        const { preFilledBeneficiary } = this.props;

        // Available during development
        if ( preFilledBeneficiary ) {
            this.setState( {
                beneficiary : preFilledBeneficiary
            } );
        }

        SubscribeToEventMetaMaskSign.call( this );
    }

    componentDidUpdate() {}

    onDropAttempt = callback => {
        this.setState(
            {
                fileError : null
            },
            callback
        );
    };

    onDropSuccess = ( acceptedFiles, cheque ) => {
        const { knownChequeBooks, knownBeneficiaries, dispatch, ethereumInterface } = this.props;
        const { contract, beneficiary, amount } = cheque;
        const knownChequeBook = knownChequeBooks.find( chequeBook => chequeBook.address == contract );

        if ( !knownChequeBook ) {
            this.onDropFailure(
                "The cheque book for this cheque does not seem to belong to your account."
            );
            return;
        }

        actionSetActiveChequeBook( dispatch, ethereumInterface )( contract, knownChequeBooks )
            .then( () => actionAddBeneficiary( dispatch )( beneficiary, knownBeneficiaries ) )
            .then( () => actionSetActiveBeneficiary( dispatch )( beneficiary ) )
            .then( () =>
                actionFetchBalanceForActiveBeneficiary( dispatch, ethereumInterface )( beneficiary )
            )
            .then( () =>
                this.setState( {
                    previousTotal : amount,
                    fileError : null,
                    files : acceptedFiles
                } )
            );
    };

    onDropFailure = error => {
        this.setState( {
            fileError : error,
            files : []
        } );
    };

    issueCheque = () => {
        const {
            activeChequeBook,
            activeBeneficiary,
            activeEthereumAddress,
            ethereumInterface,
            dispatch
        } = this.props;
        const { amount, previousTotal } = this.state;

        this.setState( {
            isInteractionWithEthereum : true
        } );

        // MetaMask is acting bit loopy during signing when user rejects.
        const maxErrorLength = 1000; //@TODO: Try to see if a different signing menthod fixes it

        Promise.resolve( previousTotal )
            .then( previousTotal => {
                if ( ![ "", null ].includes( previousTotal ) ) return previousTotal;

                return ethereumInterface.getPreviousTotal(
                    activeChequeBook,
                    activeBeneficiary,
                    null,
                    previousTotal
                );
            } )
            .then( previousTotal => {
                return ethereumInterface.issueCheque(
                    activeChequeBook,
                    activeBeneficiary,
                    Number( previousTotal ) + Number( amount ),
                    previousTotal
                );
            } )
            .then( cheque => {
                const timestamp = new Date( Date.now() ).toISOString();

                this.setState( {
                    signedCheque : {
                        ...cheque,
                        timestamp
                    },
                    isInteractionWithEthereum : false
                } );

                actionPersistCheque( dispatch )( activeEthereumAddress, { ...cheque, timestamp } ).then(
                    () => actionFetchCheques( dispatch )( activeEthereumAddress )
                );
            } )
            .catch( error => {
                this.setState( {
                    ethereumError :
                        error.message
                            .split( "" )
                            .splice( 0, maxErrorLength )
                            .join( "" ) + "...",
                    isInteractionWithEthereum : false,
                    metaMaskPromptIsAvailable : false
                } );
            } );
    };

    getRequestApproval = () => {
        const { activeBeneficiary, activeChequeBook, activeChequeBookBalance } = this.props;
        const { signedCheque, amount, previousTotal } = this.state;
        const formIsFilled =
            activeBeneficiary &&
            activeChequeBook &&
            amount &&
            previousTotal &&
            activeChequeBookBalance &&
            Number( activeChequeBookBalance ) >= Number( amount );
        const isLocked = signedCheque || !formIsFilled;

        return !isLocked;
    };

    handleAmountChange = value => this.setState( { amount : value } );

    sharer = () => {
        const { activeChequeBook } = this.props;
        const { signedCheque, previousTotal } = this.state;

        return (
            <Fragment>
                <h5 className="mt-5">Share the cheque</h5>
                <hr className="mt-2 mb-2" />

                <Row className="ml-0 mr-0">
                    <SharingOptions
                        shouldIncludeOwner={true}
                        shouldIncludeRecipient={true}
                        shouldIncludeSelf={false}
                        subject="New cheque issued"
                        shouldIncludeDownload={true}
                        append={`Contract address: ${activeChequeBook}`}
                        json={{
                            ...signedCheque,
                            previousTotal : previousTotal
                        }}
                        filename="cheque"
                    />
                </Row>
            </Fragment>
        );
    };

    render() {
        const {
            entranceAnimation,
            ethereumInterface,
            etherScanError,
            activeChequeBook,
            activeBeneficiary,
            dispatch
        } = this.props;

        const {
            signedCheque,
            ethereumError,
            fileError,
            files,
            previousTotal,
            amount,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.state;

        const hasIssuedChequeBefore = files.length > 0;

        //@TODO: Move these validations to the ethereumInterface's chequeIsValid
        //const addressIsValid = ethereumInterface.addressIsValid( activeChequeBook );
        //const walletIsValid = ethereumInterface.addressIsValid( activeBeneficiary );
        //const hasAddedAmount = Number( amount ) && amount > 0;
        //const chequeCompletedWithPrefill = hasIssuedChequeBefore && hasAddedAmount;
        //const chequeCompletedAsVirgin = hasAddedAmount && addressIsValid && walletIsValid;

        return (
            <Page
                entranceAnimation={entranceAnimation}
                pageHeader="Issue cheque"
                columns="col-12 col-s-10 col-md-8 col-lg-6"
                pageIcon="money-check"
            >
                <Row className="">
                    <Col
                        style={
                            {
                                //borderLeft : "1px solid rgba(0,0,0,.1)"
                            }
                        }
                    >
                        <h2 className="mt-2">Issue cheque</h2>
                        <hr className="mt-2 mb-4" />

                        {!signedCheque && !isInteractionWithEthereum && (
                            <Fragment>
                                <ChequeForm
                                    contract={activeChequeBook}
                                    beneficiary={activeBeneficiary}
                                    ethereumInterface={ethereumInterface}
                                    amount={amount}
                                    hasIssuedChequeBefore={hasIssuedChequeBefore}
                                    previousTotal={previousTotal}
                                    handleAmountChange={this.handleAmountChange}
                                    handleBeneficiaryChange={beneficiary =>
                                        //prettier-ignore
                                        actionSetActiveBeneficiary( dispatch )( beneficiary )
                                            .then( () =>
                                                actionFetchBalanceForActiveBeneficiary(
                                                    dispatch,
                                                    ethereumInterface
                                                )( beneficiary )
                                            )
                                    }
                                    ChequeUploader={() => (
                                        <ChequeUploader
                                            ethereumInterface={ethereumInterface}
                                            onDropAttempt={this.onDropAttempt}
                                            onDropSuccess={this.onDropSuccess}
                                            onDropFailure={this.onDropFailure}
                                            files={files}
                                            fileError={fileError}
                                            note={
                                                <small>
                                                    <p className="mt-0">
                                                        In case of previous cheques, this is a{" "}
                                                        <strong>mandatory</strong> step that will
                                                        prefill the necessary information to write
                                                        the new cheque.
                                                        <br />
                                                        Skip this step if you have no previous
                                                        cheque.
                                                    </p>
                                                </small>
                                            }
                                        />
                                    )}
                                />
                            </Fragment>
                        )}

                        {signedCheque && (
                            <Fragment>
                                <ChequeOverview
                                    previousTotal={previousTotal}
                                    contractAddress={activeChequeBook}
                                    beneficiary={activeBeneficiary}
                                    chequeAmount={amount}
                                />
                            </Fragment>
                        )}

                        <Row className="mt-5 ml-0 mr-0">
                            <ActionButtons
                                handleConfirmation={this.issueCheque}
                                handleAbort={() => {
                                    this.setState( this.initialState );
                                    actionSetActiveBeneficiary( dispatch )( null );
                                    actionSetActiveChequeBook( dispatch )( null );
                                }}
                                variantConfirmation="primary"
                                variantAbort="danger"
                                confirmationLabel="Issue cheque"
                                abortLabel="Reset"
                                confirmationIcon="check"
                                abortIcon="undo"
                                disabled={!this.getRequestApproval()}
                                abortIsDisabled={false}
                                delay={null}
                            />
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
                                    messageIsBold={true}
                                    dismissible={true}
                                />
                            </div>
                        )}

                        {ethereumError && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="Oh no!"
                                    message={ethereumError}
                                    icon="bug"
                                    variant="danger"
                                    dismissible={true}
                                    messageIsBold={true}
                                    instruction="Please try again."
                                />
                            </div>
                        )}

                        {etherScanError && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="Oh no!"
                                    message={etherScanError}
                                    icon="bug"
                                    variant="danger"
                                    dismissible={true}
                                    messageIsBold={true}
                                    instruction="Please try again."
                                />
                            </div>
                        )}

                        {signedCheque && this.sharer()}
                    </Col>
                </Row>
            </Page>
        );
    }
}
