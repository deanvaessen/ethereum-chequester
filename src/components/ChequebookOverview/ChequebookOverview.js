import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Form, Button, InputGroup, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";
import AlertMessage from "../AlertMessage";
import LoadingIndicator from "../LoadingIndicator";
import FormSpacer from "../FormSpacer";

export default class ChequebookOverview extends React.PureComponent {
    static propTypes = {
        chequebooks : PropTypes.array,
        etherScanError : PropTypes.string,
        activeChequeBook : PropTypes.string,
        shouldRenderCompact : PropTypes.bool.isRequired,
        activeEthereumAddress : PropTypes.string,
        handleSelect : PropTypes.func.isRequired
    };

    getChequeBooksRequestIcon = ( isLoading, etherScanError ) => {
        if ( etherScanError ) return "undo";
        else return "clock";
    };

    getChequeBooksRequestText = ( isLoading, etherScanError ) => {
        if ( isLoading ) return "Requesting...";
        else if ( etherScanError ) return "Retry";
        else return "Get my cheque books";
    };

    isEvenNumber = x => x % 2 == 0;

    // @TODO: Make CSS class for the cheque labels, instead of repeating myself here.
    render() {
        const {
            handleSelect,
            etherScanError,
            shouldRenderCompact,
            activeEthereumAddress,
            activeChequeBook
        } = this.props;
        const chequebooks = this.props.chequebooks?.slice( 0 ); //@TODO: Hardcapped, add button to show more/all
        const isLoading = !chequebooks && !etherScanError && activeEthereumAddress;

        return (
            <Row className="w-100 m-0 ml-0 mr-0 mt-2">
                {chequebooks &&
                    chequebooks.map( ( chequeBook, index ) => {
                        const { address, balance } = chequeBook;
                        const isActive = activeChequeBook == address;
                        const isLastElement = index == chequebooks.length - 1;
                        const baseClass = "col-6";
                        const className = this.isEvenNumber
                            ? `${baseClass} ml-0 pl-0`
                            : `${baseClass} mr-0 pr-0`; //Ugly, it's to align the items on the page

                        return (
                            <div class={className}>
                                <Fragment>
                                    <Card key={address} className="mt-2">
                                        <Card.Body>
                                            <Form.Group as={Col} md="12" className="mb-0">
                                                {!shouldRenderCompact && (
                                                    <Form.Label>Contract address</Form.Label>
                                                )}
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <Button
                                                            id="targetHashInput__prepend"
                                                            variant="outline-secondary"
                                                            onClick={() => handleSelect( address )}
                                                        >
                                                            <FontAwesomeIcon
                                                                style={{
                                                                    marginRight : "4px",
                                                                    marginLeft : "4px"
                                                                }}
                                                                icon="file-contract"
                                                            />
                                                        </Button>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type="text"
                                                        aria-label="Contract address"
                                                        placeholder="Contract address"
                                                        aria-describedby="basic-addon2"
                                                        name="Contract Address"
                                                        value={address}
                                                        onChange={() => {}}
                                                    />
                                                </InputGroup>
                                                {!shouldRenderCompact && (
                                                    <Form.Label className="mt-2">
                                                        Balance
                                                    </Form.Label>
                                                )}
                                                <InputGroup className="mt-2">
                                                    <InputGroup.Prepend>
                                                        <Button
                                                            id="targetHashInput__prepend"
                                                            variant="outline-secondary"
                                                            onClick={() => handleSelect( address )}
                                                        >
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
                                                        aria-label="Contract address"
                                                        placeholder="Contract address"
                                                        aria-describedby="basic-addon2"
                                                        name="Contract Address"
                                                        value={balance}
                                                        onChange={() => {}}
                                                    />
                                                </InputGroup>
                                                <Button
                                                    disabled={isActive}
                                                    className="mt-2"
                                                    size="sm"
                                                    variant={
                                                        isActive ? "primary" : "outline-primary"
                                                    }
                                                    onClick={() => handleSelect( address )}
                                                >
                                                    {isActive ? "Selected" : "Select"}
                                                </Button>
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>

                                    {!isLastElement && !shouldRenderCompact && <FormSpacer />}
                                </Fragment>
                            </div>
                        );
                    } )}

                {!chequebooks && (
                    <Button
                        className="mr-2"
                        variant="primary"
                        onClick={getKnownChequeBooks}
                        disabled={isLoading || !activeEthereumAddress}
                    >
                        <FontAwesomeIcon
                            icon={this.getChequeBooksRequestIcon( isLoading, etherScanError )}
                            className="mr-2"
                        />
                        {this.getChequeBooksRequestText( isLoading, etherScanError )}
                    </Button>
                )}

                {isLoading && <LoadingIndicator />}

                {!activeEthereumAddress && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="MetaMask is not available."
                            message="Please log in with MetaMask."
                            icon="sign-in-alt"
                            messageIsBold={true}
                            variant="danger"
                            dismissible={true}
                            //instruction="Please try again later."
                        />
                    </div>
                )}

                {etherScanError && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="Oh no!"
                            message={etherScanError}
                            messageIsBold={true}
                            icon="bug"
                            variant="danger"
                            dismissible={true}
                            instruction="Please try again later."
                        />
                    </div>
                )}
            </Row>
        );
    }
}
