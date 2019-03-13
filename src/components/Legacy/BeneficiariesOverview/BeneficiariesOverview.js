import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";
import AlertMessage from "../AlertMessage";
import LoadingIndicator from "../LoadingIndicator";
import FormSpacer from "../FormSpacer";

export default class BeneficiariesOverview extends React.PureComponent {
    static propTypes = {
        beneficiaries : PropTypes.array,
        etherscanError : PropTypes.string,
        activeBeneficiary : PropTypes.string,
        shouldRenderCompact : PropTypes.bool.isRequired,
        currentEthereumAddress : PropTypes.string,
        handleSelect : PropTypes.func.isRequired,
        getCurrentBeneficiaries : PropTypes.func.isRequired
    };

    getBeneficiariesRequestIcon = ( isLoading, etherscanError ) => {
        if ( etherscanError ) return "undo";
        else return "clock";
    };
    getBeneficiariesRequestText = ( isLoading, etherscanError ) => {
        if ( isLoading ) return "Requesting...";
        else if ( etherscanError ) return "Retry";
        else return "Get my cheque books";
    };

    // @TODO: Make CSS class for the cheque labels, instead of repeating myself here.
    render() {
        const {
            handleSelect,
            etherscanError,
            shouldRenderCompact,
            getCurrentBeneficiaries,
            currentEthereumAddress,
            activeBeneficiary
        } = this.props;
        const beneficiaries = this.props.beneficiaries?.slice( 0, 3 ); //@TODO: Hardcapped, add button to show more/all
        const isLoading = !beneficiaries && !etherscanError && currentEthereumAddress;

        return (
            <Form className="w-100 m-0 mt-2">
                {beneficiaries &&
                    beneficiaries.map( ( beneficiary, index ) => {
                        const { address, chequesTotal } = beneficiary;
                        const isActive = activeBeneficiary == address;
                        const isLastElement = index == beneficiaries.length - 1;

                        return (
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
                                                                marginRight : "3px",
                                                                marginLeft : "3px"
                                                            }}
                                                            icon="user"
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
                                                    Cheques total
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
                                                    value={chequesTotal}
                                                    onChange={() => {}}
                                                />
                                            </InputGroup>
                                            <Button
                                                disabled={isActive}
                                                className="mt-2"
                                                size="sm"
                                                variant={isActive ? "primary" : "outline-primary"}
                                                onClick={() => handleSelect( address )}
                                            >
                                                {isActive ? "Selected" : "Select"}
                                            </Button>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>

                                {!isLastElement && !shouldRenderCompact && <FormSpacer />}
                            </Fragment>
                        );
                    } )}

                {!beneficiaries && (
                    <Button
                        className="mr-2"
                        variant="primary"
                        onClick={getCurrentBeneficiaries}
                        disabled={isLoading || !currentEthereumAddress}
                    >
                        <FontAwesomeIcon
                            icon={this.getBeneficiariesRequestIcon( isLoading, etherscanError )}
                            className="mr-2"
                        />
                        {this.getBeneficiariesRequestText( isLoading, etherscanError )}
                    </Button>
                )}

                {isLoading && <LoadingIndicator />}

                {!currentEthereumAddress && (
                    <div className="alert-spacer">
                        <AlertMessage
                            style={{ width : "100%" }}
                            intro="MetaMask is not available."
                            message="Please log in with MetaMask."
                            icon="sign-in-alt"
                            variant="danger"
                            dismissible={true}
                            //instruction="Please try again later."
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
                            instruction="Please try again later."
                        />
                    </div>
                )}
            </Form>
        );
    }
}
