import { Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Col, InputGroup, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertMessage from "../../components/AlertMessage";
import Page from "../../components/Page";
import ActionButtons from "../../components/ActionButtons";
import EthereumLoadingIndicator from "../../components/EthereumLoadingIndicator";

export default class FundChequeBook extends React.Component {
    static propTypes = {
        ethereumInterface : PropTypes.object.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired,
        contract : PropTypes.string.isRequired
    };

    initialState = {
        error : null,
        moneyHasBeenDeposited : false,
        amount : "",
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false
    };

    state = this.initialState;

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        window.addEventListener( "deposit.shouldApprove", e => {
            this.setState( {
                metaMaskPromptIsAvailable : true
            } );
        } );

        window.addEventListener( "deposit.hasApproved", e => {
            this.setState( {
                metaMaskPromptIsAvailable : false
            } );
        } );
    };

    makeDeposit = () => {
        const { getCurrentChequeBooks, ethereumInterface, contract } = this.props;
        const { amount } = this.state;
        const etherScanDelay = 5000; // @TODO: this is really stupid, but serves as a temporary quick hack to prevent an issue where there is a delay between transaction completion and when the result is available/queryable on Etherscan

        this.setState( {
            moneyHasBeenDeposited : false,
            isInteractionWithEthereum : true
        } );

        ethereumInterface
            .depositIntoChequeBook( contract, amount )
            .then( result => {
                setTimeout( () => {
                    getCurrentChequeBooks( () => {
                        this.setState( {
                            moneyHasBeenDeposited : true,
                            isInteractionWithEthereum : false
                        } );
                    } );
                }, etherScanDelay );
            } )
            .catch( error =>
                this.setState( {
                    isInteractionWithEthereum : false,
                    metaMaskPromptIsAvailable : false,
                    moneyHasBeenDeposited : false,
                    error : error.message
                } )
            );
    };

    getRequestApproval = () => {
        const { contract } = this.props;

        const { error, amount, isInteractionWithEthereum, metaMaskPromptIsAvailable } = this.state;
        const isLocked =
            error || isInteractionWithEthereum || metaMaskPromptIsAvailable || !contract || !amount;

        return !isLocked;
    };

    render() {
        const { contract } = this.props;

        const {
            error,
            amount,
            moneyHasBeenDeposited,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.state;
        const requestIsPrimed = true;

        return (
            <Fragment>
                {/*<h2 className="mt-2 mb-2">Fund cheque book</h2>*/}

                <h5 className="mt-2">Transaction details</h5>
                <hr className="mt-2 mb-2" />

                <Form className="w-100 m-0 mt-2">
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>Contract address</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon
                                            style={{ marginRight : "4px", marginLeft : "4px" }}
                                            icon="file-contract"
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    disabled={true}
                                    aria-label="Contract address"
                                    placeholder="Select a cheque book first"
                                    aria-describedby="basic-addon2"
                                    name="Contract Address"
                                    value={contract}
                                    onChange={() => {}}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="">
                        <Form.Group as={Col} md="12">
                            <Form.Label>Amount to deposit</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button variant="outline-secondary">
                                        <FontAwesomeIcon
                                            icon={[ "fab", "ethereum" ]}
                                            style={{
                                                marginLeft : "5px",
                                                marginRight : "5px"
                                            }}
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Amount of ETH to deposit"
                                    placeholder="Add the amount of ETH to deposit"
                                    aria-describedby="basic-addon2"
                                    name="Deposit amount"
                                    value={amount}
                                    onChange={e =>
                                        this.setState( {
                                            amount : e.target.value
                                        } )
                                    }
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </Form>

                {requestIsPrimed && (
                    <Row className="mt-4 ml-0 mr-0">
                        <ActionButtons
                            handleConfirmation={this.makeDeposit}
                            handleAbort={() => this.setState( this.initialState )}
                            variantConfirmation="primary"
                            variantAbort="danger"
                            confirmationLabel="Deposit funds"
                            abortLabel="Reset"
                            confirmationIcon={[ "fab", "ethereum" ]}
                            abortIcon="undo"
                            disabledAbort={false}
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
                            dismissible={true}
                        />
                    </div>
                )}

                {moneyHasBeenDeposited && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="All good!"
                            message="Your ETH has been deposited into the contract."
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
            </Fragment>
        );
    }
}
