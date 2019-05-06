import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ChequeOverview extends React.PureComponent {
    static propTypes = {
        contractAddress : PropTypes.string.isRequired,
        beneficiary : PropTypes.string.isRequired,
        chequeAmount : PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
        previousTotal : PropTypes.string.isRequired
    };

    // @TODO: Make CSS class for the cheque labels, instead of repeating myself here.
    render() {
        const { contractAddress, beneficiary, previousTotal, chequeAmount } = this.props;

        return (
            <Form className="w-100 m-0 mt-2" id="cheque-overview">
                <Form.Row className="m-0">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        {/*<Form.Label>Cheque amount</Form.Label>*/}
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    style={{
                                        borderBottomLeftRadius : 0
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{ marginRight : "4px", marginLeft : "4px" }}
                                        icon="file-contract"
                                    />
                                </Button>
                            </InputGroup.Prepend>
                            <div
                                style={{
                                    //background : "rgb(108, 117, 125)",
                                    display : "flex",
                                    alignItems : "center",
                                    justifyContent : "end",
                                    borderRight : "1px solid rgb(108, 117, 125)",
                                    borderTop : "1px solid rgb(108, 117, 125)",
                                    borderBottom : "1px solid rgb(108, 117, 125)",
                                    padding : "5px",
                                    paddingRight : "10px",
                                    minWidth : "140px"
                                }}
                            >
                                <p style={{ margin : 0 }}>Contract:</p>
                            </div>
                            <Form.Control
                                type="text"
                                //disabled
                                aria-label="Contract address"
                                aria-describedby="basic-addon2"
                                name="Contract address"
                                style={{
                                    borderBottomRightRadius : 0,
                                    borderBottom : 0
                                }}
                                value={contractAddress}
                                onChange={() => {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="m-0">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        {/*<Form.Label>Cheque amount</Form.Label>*/}
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    style={{
                                        borderTopLeftRadius : 0,
                                        borderBottomLeftRadius : 0,
                                        borderTop : 0,
                                        borderBottom : 0
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon="user"
                                        style={{
                                            marginLeft : "3px",
                                            marginRight : "3px"
                                        }}
                                    />
                                </Button>
                            </InputGroup.Prepend>
                            <div
                                style={{
                                    //background : "rgb(108, 117, 125)",
                                    display : "flex",
                                    alignItems : "center",
                                    justifyContent : "end",
                                    borderRight : "1px solid rgb(108, 117, 125)",
                                    //borderBottom : "1px solid rgb(108, 117, 125)",
                                    padding : "5px",
                                    paddingRight : "10px",
                                    minWidth : "140px"
                                }}
                            >
                                <p style={{ margin : 0 }}>Beneficiary:</p>
                            </div>
                            <Form.Control
                                type="text"
                                //disabled
                                style={{
                                    //borderTop : 0,
                                    //borderBottom : 0,
                                    borderTopRightRadius : 0,
                                    borderBottomRightRadius : 0
                                }}
                                aria-label="Beneficiary wallet address"
                                aria-describedby="basic-addon2"
                                name="Beneficiary wallet address"
                                value={beneficiary}
                                onChange={() => {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="m-0">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        {/*<Form.Label>Cheque amount</Form.Label>*/}
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    style={{
                                        borderTopLeftRadius : 0,
                                        borderBottomLeftRadius : 0,
                                        //borderTop : 0,
                                        borderBottom : 0
                                    }}
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
                            <div
                                style={{
                                    //background : "rgb(108, 117, 125)",
                                    display : "flex",
                                    alignItems : "center",
                                    justifyContent : "end",
                                    borderRight : "1px solid rgb(108, 117, 125)",
                                    borderTop : "1px solid rgb(108, 117, 125)",
                                    //borderBottom : "1px solid rgb(108, 117, 125)",
                                    padding : "5px",
                                    paddingRight : "10px",
                                    minWidth : "140px"
                                }}
                            >
                                <p style={{ margin : 0 }}>Cheque amount:</p>
                            </div>
                            <Form.Control
                                type="text"
                                //disabled
                                style={{
                                    borderTop : 0,
                                    borderBottom : 0,
                                    borderTopRightRadius : 0,
                                    borderBottomRightRadius : 0
                                }}
                                aria-label="Previous total amount"
                                aria-describedby="basic-addon2"
                                name="Previous total amount"
                                value={Number( chequeAmount ) - Number( previousTotal )}
                                onChange={() => {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="m-0">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        {/*<Form.Label>Cheque amount</Form.Label>*/}
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    style={{
                                        borderTopLeftRadius : 0,
                                        borderBottomLeftRadius : 0,
                                        //borderTop : 0,
                                        borderBottom : 0
                                    }}
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
                            <div
                                style={{
                                    //background : "rgb(108, 117, 125)",
                                    display : "flex",
                                    alignItems : "center",
                                    justifyContent : "end",
                                    borderRight : "1px solid rgb(108, 117, 125)",
                                    borderTop : "1px solid rgb(108, 117, 125)",
                                    //borderBottom : "1px solid rgb(108, 117, 125)",
                                    padding : "5px",
                                    paddingRight : "10px",
                                    minWidth : "140px"
                                }}
                            >
                                <p style={{ margin : 0 }}>New total:</p>
                            </div>
                            <Form.Control
                                type="text"
                                //disabled
                                style={{
                                    //borderTop : 0,
                                    borderBottom : 0,
                                    borderTopRightRadius : 0,
                                    borderBottomRightRadius : 0
                                }}
                                aria-label="Previous total amount"
                                aria-describedby="basic-addon2"
                                name="Previous total amount"
                                value={chequeAmount}
                                onChange={() => {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="m-0">
                    <Form.Group as={Col} md="12" className="m-0 p-0">
                        {/*<Form.Label>Cheque amount</Form.Label>*/}
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button
                                    variant="outline-secondary"
                                    style={{
                                        borderTopLeftRadius : 0
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon="exchange-alt"
                                        style={{ marginLeft : "2px", marginRight : "2px" }}
                                    />
                                </Button>
                            </InputGroup.Prepend>
                            <div
                                style={{
                                    //background : "rgb(108, 117, 125)",
                                    display : "flex",
                                    alignItems : "center",
                                    justifyContent : "end",
                                    borderRight : "1px solid rgb(108, 117, 125)",
                                    borderTop : "1px solid rgb(108, 117, 125)",
                                    borderBottom : "1px solid rgb(108, 117, 125)",
                                    padding : "5px",
                                    paddingRight : "10px",
                                    minWidth : "140px"
                                }}
                            >
                                <p style={{ margin : 0 }}>Previous total:</p>
                            </div>
                            <Form.Control
                                type="text"
                                //disabled
                                style={{
                                    borderTopRightRadius : 0
                                }}
                                aria-label="ETH previous total amount"
                                aria-describedby="basic-addon2"
                                name="ETH previous total amount"
                                value={previousTotal}
                                onChange={() => {}}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
            </Form>
        );
    }
}
