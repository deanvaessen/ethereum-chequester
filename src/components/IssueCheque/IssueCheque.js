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
import FormSpacer from "../../components/FormSpacer";
import AlertMessage from "../../components/AlertMessage";
import SharingOptions from "../SharingOptions";
//import RequestChequeBook from "../RequestChequeBook";
import ChequeOverview from "../../components/ChequeOverview";
import ActionButtons from "../../components/ActionButtons";
import Page from "../../components/Page";
import ChequeForm from "../../components/ChequeForm";
import ChequeUploader from "../../components/ChequeUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EthereumLoadingIndicator from "../../components/EthereumLoadingIndicator";
import ChequePrefill from "../../components/ChequePrefill";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";
//import MyBeneficiaries from "../../components/MyBeneficiaries";

export default class IssueCheque extends React.Component {
    static propTypes = {
        activeChequeBook : PropTypes.string.isRequired,
        activeBalance : PropTypes.string.isRequired,
        activeBeneficiary : PropTypes.string.isRequired,
        ethereumInterface : PropTypes.object.isRequired,
        etherscanError : PropTypes.string,
        currentEthereumAddress : PropTypes.string,
        currentChequeBooks : PropTypes.array,
        selectChequeBook : PropTypes.func.isRequired,
        //updateCurrentBalance : PropTypes.func.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired,
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

        this.addListeners();
    }

    addListeners = () => {
        window.addEventListener( "sign.shouldApprove", e => {
            this.setState( {
                metaMaskPromptIsAvailable : true
            } );
        } );

        window.addEventListener( "sign.hasApproved", e => {
            this.setState( {
                metaMaskPromptIsAvailable : false
            } );
        } );
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
        const { currentChequeBooks, selectChequeBook, selectBeneficiary } = this.props;
        const { contract, beneficiary, amount } = cheque;
        const chequeBookIsKnown = currentChequeBooks.find(
            chequeBook => chequeBook.address == contract
        );

        if ( !chequeBookIsKnown ) {
            this.onDropFailure(
                "The cheque book for this cheque does not seem to belong to your account."
            );
            return;
        }

        selectChequeBook( contract );
        selectBeneficiary( beneficiary );

        this.setState( {
            previousTotal : amount,
            fileError : null,
            files : acceptedFiles
        } );
    };

    onDropFailure = error => {
        this.setState( {
            fileError : error,
            files : []
        } );
    };

    issueCheque = () => {
        const { activeChequeBook, activeBeneficiary, ethereumInterface } = this.props;
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
                this.setState( {
                    signedCheque : cheque,
                    isInteractionWithEthereum : false
                } );
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
        const { activeBeneficiary, activeChequeBook, activeBalance } = this.props;
        const { signedCheque, amount, previousTotal } = this.state;
        const formIsFilled =
            activeBeneficiary &&
            activeChequeBook &&
            amount &&
            previousTotal &&
            activeBalance &&
            activeBalance >= Number( amount );
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
                            previousTotal : previousTotal,
                            timestamp : new Date( Date.now() ).toISOString()
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
            shouldPreFill,
            currentEthereumAddress,
            currentChequeBooks,
            getCurrentChequeBooks,
            etherscanError,
            selectChequeBook,
            activeChequeBook,
            //updateCurrentBalance,
            activeBalance,
            currentBeneficiaries,
            activeBeneficiary,
            selectBeneficiary,
            getCurrentBeneficiaries,
            TEST_BENEFICIARY
            //TEST_CONTRACT,
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

        //@TODO: Move these validations to the ethereumInterface's chequeIsValid
        const addressIsValid = ethereumInterface.addressIsValid( activeChequeBook );
        const walletIsValid = ethereumInterface.addressIsValid( activeBeneficiary );
        const hasIssuedChequeBefore = files.length > 0;
        const hasAddedAmount = Number( amount ) && amount > 0;
        const chequeCompletedWithPrefill = hasIssuedChequeBefore && hasAddedAmount;
        const chequeCompletedAsVirgin = hasAddedAmount && addressIsValid && walletIsValid;
        const requestIsPrimed = chequeCompletedWithPrefill || chequeCompletedAsVirgin;

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
                                    activeBalance={activeBalance}
                                    currentBeneficiaries={currentBeneficiaries}
                                    beneficiary={activeBeneficiary}
                                    currentChequeBooks={currentChequeBooks}
                                    ethereumInterface={ethereumInterface}
                                    selectChequeBook={selectChequeBook}
                                    amount={amount}
                                    //updateCurrentBalance={updateCurrentBalance}
                                    hasIssuedChequeBefore={hasIssuedChequeBefore}
                                    previousTotal={previousTotal}
                                    handleContractChange={selectChequeBook}
                                    getCurrentChequeBooks={getCurrentChequeBooks}
                                    handleAmountChange={this.handleAmountChange}
                                    handleBeneficiaryChange={selectBeneficiary}
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
                                    selectBeneficiary( null );
                                    selectChequeBook( null );
                                }}
                                variantConfirmation="primary"
                                variantAbort="danger"
                                confirmationLabel="Issue cheque"
                                abortLabel="Reset"
                                confirmationIcon="check"
                                abortIcon="undo"
                                disabled={!this.getRequestApproval()}
                                disabledAbort={false}
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
                                    instruction="Please try again."
                                />
                            </div>
                        )}

                        {etherscanError && (
                            <div className="alert-spacer">
                                <AlertMessage
                                    style={{ width : "100%" }}
                                    intro="Oh no!"
                                    message={etherscanError}
                                    icon="bug"
                                    variant="danger"
                                    dismissible={true}
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
