import { Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Col, InputGroup, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertMessage from "../../AlertMessage";
import Page from "../../Page";
import ActionButtons from "../../ActionButtons";
import EthereumLoadingIndicator from "../../EthereumLoadingIndicator";

export default class TransactionForm extends React.Component {
    static propTypes = {
        makeDeposit : PropTypes.func.isRequired,
        receiverAddress : PropTypes.string,
        receiverType : PropTypes.string,
        icon : PropTypes.string.isRequired,
        transactionDescription : PropTypes.string,
        amountDescription : PropTypes.string.isRequired,
        successText : PropTypes.string.isRequired,
        actionButtonText : PropTypes.string.isRequired,
        error : PropTypes.string,
        moneyHasBeenDeposited : PropTypes.bool.isRequired,
        isInteractionWithEthereum : PropTypes.bool.isRequired,
        metaMaskPromptIsAvailable : PropTypes.bool.isRequired
    };

    initialState = {
        amount : ""
    };

    state = this.initialState;

    getRequestApproval = () => {
        const { receiverAddress } = this.props;

        const { error, amount, isInteractionWithEthereum, metaMaskPromptIsAvailable } = this.state;
        const isLocked =
            error ||
            isInteractionWithEthereum ||
            metaMaskPromptIsAvailable ||
            !receiverAddress ||
            !amount;

        return !isLocked;
    };

    render() {
        const { amount } = this.state;

        const {
            error,
            receiverAddress,
            makeDeposit,
            receiverType,
            icon,
            amountDescription,
            transactionDescription,
            successText,
            actionButtonText,
            moneyHasBeenDeposited,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.props;

        const capitalisedReceiver = receiverType.charAt( 0 ).toUpperCase() + receiverType.slice( 1 );
        const requestIsPrimed = true;

        return (
            <Fragment>
                <h5 className="mt-2">Transaction details</h5>
                <hr className="mt-2 mb-2" />

                {transactionDescription && <p className="mb-4">{transactionDescription}</p>}

                <Form className="w-100 m-0 mt-2">
                    <Form.Row className="mt-2">
                        <Form.Group as={Col} md="12">
                            <Form.Label>{`${capitalisedReceiver} address`}</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon
                                            style={{ marginRight : "4px", marginLeft : "4px" }}
                                            icon={icon}
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    disabled={true}
                                    aria-label={`${capitalisedReceiver} address`}
                                    placeholder={`Select a ${receiverType} first`}
                                    aria-describedby="basic-addon2"
                                    name={`${capitalisedReceiver} address`}
                                    value={receiverAddress}
                                    onChange={() => {}}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="">
                        <Form.Group as={Col} md="12">
                            <Form.Label>{amountDescription}</Form.Label>
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
                                    aria-label="Amount of ETH for the transaction"
                                    placeholder="Add the amount of ETH for the transaction"
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
                            handleConfirmation={() => makeDeposit( amount )}
                            handleAbort={() => this.setState( this.initialState )}
                            variantConfirmation="primary"
                            variantAbort="danger"
                            confirmationLabel={actionButtonText}
                            abortLabel="Reset"
                            confirmationIcon={[ "fab", "ethereum" ]}
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
                            messageIsBold={true}
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
                            message={successText}
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
                            messageIsBold={true}
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
