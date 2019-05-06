import React, { Fragment } from "react";
import ReactDropzone from "react-dropzone";
import {
    FormControl,
    Alert,
    Badge,
    Button,
    Row,
    Col,
    InputGroup,
    Form,
    Nav,
    Tabs,
    Tab
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import AlertMessage from "../AlertMessage";
import FormSpacer from "../FormSpacer";
import ActionButtons from "../ActionButtons";
import Page from "../Page";
import SharingOptions from "../SharingOptions";
import EthereumLoadingIndicator from "../EthereumLoadingIndicator";

import { actionFetchChequeBooks, actionSetActiveChequeBook } from "../../Actions";

import SubscribeToEventMetaMaskSign from "../Events/SignMetaMask";

export default class RequestChequeBook extends React.Component {
    static propTypes = {
        ethereumInterface : PropTypes.object.isRequired,
        activeEthereumAddress : PropTypes.string,
        knownChequeBooks : PropTypes.array.isRequired
    };

    initialState = {
        address : null,
        alias : "",
        error : null,
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false
    };

    state = this.initialState;

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        window.addEventListener( "contract.shouldApprove", e => {
            this.setState( {
                metaMaskPromptIsAvailable : true
            } );
        } );

        window.addEventListener( "contract.hasApproved", e => {
            this.setState( {
                metaMaskPromptIsAvailable : false
            } );
        } );

        SubscribeToEventMetaMaskSign.call( this );
    };

    getRequestApproval = () => {
        const {
            address,
            alias,
            error,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.state;
        const isLocked =
            address || error || isInteractionWithEthereum || metaMaskPromptIsAvailable || !alias;

        return !isLocked;
    };

    requestChequeBook = () => {
        const { alias } = this.state;
        const { ethereumInterface, activeEthereumAddress, knownChequeBooks, dispatch } = this.props;
        const etherScanDelay = 15000; // @TODO: this is really stupid, but serves as a temporary quick hack to prevent an issue where there is a delay between transaction completion and when the result is available/queryable on EtherScan

        this.setState( {
            isInteractionWithEthereum : true
        } );

        ethereumInterface
            .requestChequeBook( alias )
            .then( deployedContract => {
                const { _address } = deployedContract;

                setTimeout( () => {
                    actionFetchChequeBooks( dispatch, ethereumInterface )( activeEthereumAddress ).then(
                        () => {
                            this.setState( {
                                error : null,
                                address : _address,
                                metaMaskPromptIsAvailable : false,
                                isInteractionWithEthereum : false
                            } );

                            actionSetActiveChequeBook( dispatch )( _address, knownChequeBooks );
                        }
                    );
                }, etherScanDelay );
            } )
            .catch( err =>
                this.setState( {
                    error : err.message,
                    metaMaskPromptIsAvailable : false,
                    isInteractionWithEthereum : false
                } )
            );
    };

    copyTextToClipBoard = id => {
        const element = document.getElementById( id );
        element.select();

        document.execCommand( "copy" );
    };

    sharer = () => {
        const { address } = this.state;

        return (
            <Fragment>
                <h5 className="mt-5">Share the cheque book</h5>
                <hr className="mt-2 mb-2" />

                <Row className="ml-0 mr-0">
                    <SharingOptions
                        subject="New cheque book created"
                        append={`Cheque book address: ${address}`}
                        shouldIncludeOwner={true}
                        shouldIncludeRecipient={true}
                        shouldIncludeSelf={false}
                        shouldIncludeDownload={false}
                        json={{
                            address : address,
                            timestamp : new Date( Date.now() ).toISOString()
                        }}
                        filename="cheque_book"
                    />
                </Row>
            </Fragment>
        );
    };

    resultAnnouncer = () => {
        const { address } = this.state;

        return (
            <Row className="mt-4 ml-0 mr-0">
                <Alert
                    variant="success"
                    className="mt-4 alert"
                    onClick={() => this.copyTextToClipBoard( "address_result" )}
                    style={{ cursor : "pointer", width : "100%" }}
                >
                    <p className="mb-1">
                        <i className="mr-2">🎉</i>Your cheque book has been deployed to this
                        address:
                    </p>

                    <FormControl
                        className="mb-3 mr-sm-2"
                        id="address_result"
                        type="text"
                        /*disabled*/
                        value={address}
                        onChange={() => {}}
                    />

                    <p className="m-0">
                        <small>Click me if you want to copy it to the clipboard</small>
                    </p>
                </Alert>
            </Row>
        );
    };

    render() {
        const {
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable,
            address,
            alias,
            error
        } = this.state;

        return (
            <Fragment>
                <h5 className="mt-2">Cheque book details</h5>
                <hr className="mt-2 mb-2" />

                <Form className="w-100 m-0 mt-2">
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>Cheque book alias</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon
                                            style={{ marginRight : "0px", marginLeft : "3px" }}
                                            icon="file-signature"
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Cheque book alias"
                                    placeholder="Add an alias for this cheque book"
                                    aria-describedby="basic-addon2"
                                    name="Cheque book alias"
                                    value={alias}
                                    onChange={e => this.setState( { alias : e.target.value } )}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </Form>
                <Row className="mt-4 ml-0 mr-0">
                    <ActionButtons
                        handleConfirmation={this.requestChequeBook}
                        handleAbort={() => this.setState( this.initialState )}
                        variantConfirmation="primary"
                        variantAbort="danger"
                        confirmationLabel="New cheque book"
                        abortLabel="Reset"
                        confirmationIcon="plus-circle"
                        abortIcon="undo"
                        disabled={!this.getRequestApproval()}
                        abortIsDisabled={!address && !error}
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
                            messageIsBold={true}
                            icon="key"
                            delay="delay-1s"
                            variant="info"
                            dismissible={true}
                        />
                    </div>
                )}

                {address && this.resultAnnouncer()}

                {error && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="Oh no!"
                            message={error}
                            messageIsBold={true}
                            delay="delay-1s"
                            icon="bug"
                            variant="danger"
                            dismissible={true}
                            instruction="Please try again."
                        />
                    </div>
                )}

                {address && this.sharer()}
            </Fragment>
        );
    }
}
