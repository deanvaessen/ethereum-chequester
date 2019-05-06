import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import ChequeDownloader from "../ChequeDownloader";
import PropTypes from "prop-types";
require( "./ChequeLabel.scss" );

export default class ChequeLabel extends React.PureComponent {
    static propTypes = {
        payOutCheque : PropTypes.func.isRequired,
        removeCheque : PropTypes.func.isRequired,
        cheque : PropTypes.object.isRequired,
        beneficiary : PropTypes.string.isRequired,
        timestamp : PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
        hasBeenPaidOut : PropTypes.bool,
        isBeingPaidOut : PropTypes.bool.isRequired,
        chequeAmount : PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired
    };

    renderDate = timestamp => {
        const dateObj = new Date( timestamp );
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();

        return day + "/" + month + "/" + year;
    };

    render() {
        const {
            cheque,
            payOutCheque,
            removeCheque,
            beneficiary,
            chequeAmount,
            hasBeenPaidOut,
            isBeingPaidOut,
            timestamp
        } = this.props;

        return (
            <div className="chequeLabel p-2">
                <Form.Row className="m-0 mb-1">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        <small>{this.renderDate( timestamp )}</small>
                    </Form.Group>
                </Form.Row>
                <div
                    style={{
                        boxShadow :
                            "rgba(0, 0, 0, 0.12) 0px 0px 4px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px",
                        borderRadius : "4px"
                    }}
                >
                    <Form.Row className="m-0">
                        <Form.Group as={Col} md="12" className="m-0 p-0">
                            <InputGroup>
                                <InputGroup.Prepend style={{ borderTopLeftRadius : "4px" }}>
                                    <Button
                                        variant="outline-secondary"
                                        style={{
                                            borderBottomLeftRadius : 0,
                                            borderBottom : 0,
                                            minWidth : "80px",
                                            boxShadow : "none"
                                            //borderRight : 0
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            style={{ marginRight : "4px", marginLeft : "4px" }}
                                            icon={[ "fab", "ethereum" ]}
                                        />
                                        {chequeAmount}
                                    </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                    <Button
                                        variant="outline-secondary"
                                        style={{
                                            borderRight : "1px solid lightgray",
                                            borderLeft : 0,
                                            borderBottom : 0,
                                            boxShadow : "none"
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            style={{
                                                marginRight : "4px",
                                                marginLeft : "4px"
                                            }}
                                            icon="user"
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Beneficiary address"
                                    aria-describedby="basic-addon2"
                                    name="Beneficiary address"
                                    style={{
                                        borderLeft : 0,
                                        borderBottom : 0
                                    }}
                                    value={beneficiary}
                                    onChange={() => {}}
                                />
                                <InputGroup.Append style={{ borderTopRightRadius : "4px" }}>
                                    <Button
                                        variant="outline-danger"
                                        onClick={removeCheque}
                                        style={{
                                            borderBottom : 0,
                                            borderBottomLeftRadius : 0,
                                            borderBottomRightRadius : 0,
                                            boxShadow : "none"
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            style={{ marginRight : "4px", marginLeft : "4px" }}
                                            icon="times-circle"
                                        />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="m-0">
                        <Form.Group as={Col} md="12" className="m-0 p-0">
                            <InputGroup>
                                <InputGroup.Prepend
                                    style={{
                                        borderBottomLeftRadius : "4px"
                                    }}
                                >
                                    <ChequeDownloader cheque={cheque} filename="cheque">
                                        <Button
                                            variant="outline-primary"
                                            style={{
                                                borderTopLeftRadius : 0,
                                                borderTopRightRadius : 0,
                                                borderBottomRightRadius : 0,
                                                minWidth : "80px",
                                                boxShadow : "none"
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                style={{
                                                    marginRight : "5.5px",
                                                    marginLeft : "5.5px"
                                                }}
                                                icon="download"
                                            />
                                        </Button>
                                    </ChequeDownloader>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend
                                    style={{
                                        flexGrow : 1,
                                        borderBottomRightRadius : "4px"
                                    }}
                                >
                                    <Button
                                        variant={
                                            hasBeenPaidOut ? "outline-secondary" : "outline-primary"
                                        }
                                        disabled={hasBeenPaidOut}
                                        onClick={payOutCheque}
                                        style={{
                                            borderBottomRightRadius : "4px",
                                            marginRight : "1px",
                                            borderLeft : 0,
                                            width : "100%",
                                            boxShadow : "none"
                                        }}
                                    >
                                        {do {
                                            if ( hasBeenPaidOut ) {
                                                <>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            marginRight : "4px",
                                                            marginLeft : "4px"
                                                        }}
                                                        icon="check"
                                                    />
                                                    Paid!
                                                </>;
                                            } else if ( isBeingPaidOut ) {
                                                <>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            marginRight : "4px",
                                                            marginLeft : "4px"
                                                        }}
                                                        icon="coins"
                                                    />
                                                    Paying out...
                                                </>;
                                            } else {
                                                <>
                                                    <FontAwesomeIcon
                                                        style={{
                                                            marginRight : "4px",
                                                            marginLeft : "4px"
                                                        }}
                                                        icon="coins"
                                                    />
                                                    Pay out
                                                </>;
                                            }
                                        }}
                                    </Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </div>
            </div>
        );
    }
}
