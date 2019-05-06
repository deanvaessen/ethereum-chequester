import { Fragment } from "react";
import PropTypes from "prop-types";
import ChequeUploader from "../ChequeUploader";
import SharingOptions from "../SharingOptions";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AlertMessage from "../AlertMessage";
import ChequeOverview from "../ChequeOverview";
import ActionButtons from "../ActionButtons";
import EthereumLoadingIndicator from "../EthereumLoadingIndicator";
import SubscribeToEventMetaMaskSign from "../Events/SignMetaMask";

export default class CashCheque extends React.Component {
    static propTypes = {
        ethereumInterface : PropTypes.object.isRequired
    };

    initialState = {
        contract : null,
        files : [],
        beneficiary : "",
        amount : 0,
        fileError : null,
        previousTotal : 0,
        signature : null,
        hasCashedCheque : false,
        error : null,
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false
    };

    state = this.initialState;

    requestCash() {
        const { ethereumInterface } = this.props;
        const { contract, beneficiary, amount, previousTotal, signature } = this.state;

        this.setState( {
            isInteractionWithEthereum : true
        } );

        return ethereumInterface
            .cashCheque( contract, beneficiary, amount, previousTotal, signature )
            .then( result => {
                this.setState( {
                    hasCashedCheque : true,
                    isInteractionWithEthereum : false
                } );
            } )
            .catch( error => {
                this.setState( {
                    isInteractionWithEthereum : false,
                    metaMaskPromptIsAvailable : false,
                    hasCashedCheque : false,
                    error : error.message
                } );
            } );
    }

    componentDidMount = () => {
        SubscribeToEventMetaMaskSign.call( this );
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
        const { contract, beneficiary, amount, previousTotal, signature } = cheque;

        this.setState( {
            contract,
            beneficiary,
            signature,
            previousTotal,
            amount,
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

    getRequestApproval = () => {
        const {
            hasCashedCheque,
            error,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.state;
        const isLocked =
            hasCashedCheque || error || isInteractionWithEthereum || metaMaskPromptIsAvailable;

        return !isLocked;
    };

    sharer = () => {
        const { contract } = this.state;

        return (
            <Fragment>
                <h5 className="mt-5">Notify the owner, cc a copy to yourself</h5>
                <hr className="mt-2 mb-2" />

                <Row className="ml-0 mr-0">
                    <SharingOptions
                        shouldIncludeDownload={false}
                        shouldIncludeOwner={true}
                        shouldIncludeRecipient={true}
                        shouldIncludeSelf={true}
                        subject="New cheque issued"
                        append={`Contract address: ${contract}`}
                    />
                </Row>
            </Fragment>
        );
    };

    clearFiles = () => this.setState( { files : [], fileError : null } );

    render() {
        const {
            files,
            fileError,
            hasCashedCheque,
            error,
            contract,
            beneficiary,
            previousTotal,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable,
            amount
        } = this.state;
        const { entranceAnimation, ethereumInterface } = this.props;
        const hasUploadedCheque = files.length > 0;
        const requestIsPrimed = hasUploadedCheque;

        return (
            <Fragment>
                <h2 className="mt-2">I want to cash a cheque</h2>
                <hr className="mt-2 mb-4" />

                {!isInteractionWithEthereum && (
                    <Fragment>
                        <ChequeUploader
                            ethereumInterface={ethereumInterface}
                            onDropAttempt={this.onDropAttempt}
                            onDropSuccess={this.onDropSuccess}
                            onDropFailure={this.onDropFailure}
                            files={files}
                            fileError={fileError}
                            note={
                                <small>
                                    <p className="mt-0">Upload the cheque you received</p>
                                </small>
                            }
                        />
                    </Fragment>
                )}

                {files.length > 0 && (
                    <Fragment>
                        <h5 className="mt-5">Issued cheque</h5>
                        <hr className="mt-2 mb-4" />

                        <ChequeOverview
                            previousTotal={previousTotal}
                            contractAddress={contract}
                            beneficiary={beneficiary}
                            chequeAmount={amount}
                        />
                    </Fragment>
                )}

                {requestIsPrimed && (
                    <Row className="mt-5 ml-0 mr-0">
                        <ActionButtons
                            handleConfirmation={this.requestCash}
                            handleAbort={() => this.setState( this.initialState )}
                            variantConfirmation="primary"
                            variantAbort="danger"
                            confirmationLabel="Cash cheque"
                            abortLabel="Reset"
                            confirmationIcon="check"
                            abortIcon="undo"
                            abortIsDisabled={false}
                            disabled={!this.getRequestApproval()}
                            delay={null}
                        />
                    </Row>
                )}

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

                {error && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="Oh no!"
                            message={error}
                            icon="bug"
                            variant="danger"
                            dismissible={true}
                            messageIsBold={true}
                            instruction="Please try again."
                        />
                    </div>
                )}

                {hasCashedCheque && (
                    <>
                        {this.sharer()}

                        <div className="alert-spacer">
                            <AlertMessage
                                style={{ width : "100%" }}
                                intro="All done!"
                                message="Cheque has been cashed!"
                                icon="check-circle"
                                variant="success"
                                messageIsBold={true}
                                dismissible={true}
                            />
                        </div>
                    </>
                )}
            </Fragment>
        );
    }
}
