import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Card, Col, Form, InputGroup, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import Async from "react-select/lib/Async";
import Select from "react-select";
import { Fragment } from "react";
import Creatable from "react-select/lib/Creatable";
import FundChequeBook from "../../containers/FundChequeBook";
import AlertMessage from "../AlertMessage";
import RequestChequeBook from "../../containers/RequestChequeBook";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

export default class ChequeForm extends React.Component {
    static propTypes = {
        contract : PropTypes.string.isRequired,
        activeBalance : PropTypes.string.isRequired,
        currentBeneficiaries : PropTypes.array,
        beneficiary : PropTypes.string.isRequired,
        amount : PropTypes.string.isRequired,
        currentChequeBooks : PropTypes.array,
        selectChequeBook : PropTypes.func.isRequired,
        //updateCurrentBalance : PropTypes.func.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired,
        hasIssuedChequeBefore : PropTypes.bool.isRequired,
        previousTotal : PropTypes.number,
        handleContractChange : PropTypes.func.isRequired,
        handleAmountChange : PropTypes.func.isRequired,
        ChequeUploader : PropTypes.func.isRequired,
        handleBeneficiaryChange : PropTypes.func.isRequired
    };

    initialState = {
        invalidAddressWarning : null,
        fundingAccordionIsOpen : false
    };

    state = this.initialState;

    getSelectStyles = () => {
        return {
            menu : ( provided, state ) => ( {
                ...provided,
                zIndex : 50
            } )
        };
    };

    getChequeBookOptions = () => {
        const { currentChequeBooks } = this.props;
        const chequeBookOptions = currentChequeBooks
            ? currentChequeBooks.map( chequeBook => {
                const { alias, address, balance } = chequeBook;

                return {
                    value : address,
                    label : `${alias} - ${balance} ETH - ${address}`
                };
            } )
            : [];

        return chequeBookOptions;
    };

    getBeneficiariesOptions = () => {
        const { currentBeneficiaries } = this.props;
        const chequeBookOptions = currentBeneficiaries
            ? currentBeneficiaries.map( chequeBook => {
                const { address } = chequeBook;

                return {
                    value : address,
                    label : `${address}`
                };
            } )
            : [];

        return chequeBookOptions;
    };

    handleBeneficiaryCreation = option => {
        const { ethereumInterface } = this.props;

        if ( ethereumInterface.addressIsValid( option ) ) {
            this.handleBeneficiarySelect( option );
        } else {
            this.setState( { invalidAddressWarning : "This address is not valid." } );
        }
    };

    handleBeneficiarySelect = option => {
        const { handleBeneficiaryChange, amount } = this.props;

        this.setState( { invalidAddressWarning : null }, () => handleBeneficiaryChange( option ) );
    };

    balanceIsInsufficient = () => {
        const { activeBalance, amount } = this.props;

        return Number( amount ) > Number( activeBalance );
    };

    getAmountInputClasses = () => {
        const classes = this.balanceIsInsufficient() ? "insufficient-balance" : "";

        return classes;
    };

    getFundAccordionClasses = () => {
        const { fundingAccordionIsOpen } = this.state;
        const baseStyles = "mt-4 mb-0";
        const insufficientBalanceStyles =
            this.balanceIsInsufficient() && !fundingAccordionIsOpen
                ? "animated bounce infinite slow"
                : "";

        return `${baseStyles} ${insufficientBalanceStyles}`;
    };

    getFundAccordionTitleClasses = () => {
        const { fundingAccordionIsOpen } = this.state;

        const baseStyles = "accordion__title";
        const insufficientBalanceStyles =
            this.balanceIsInsufficient() && !fundingAccordionIsOpen ? "insufficient-balance" : "";

        return `${baseStyles} ${insufficientBalanceStyles}`;
    };

    render() {
        const {
            contract,
            beneficiary,
            amount,
            ChequeUploader,
            hasIssuedChequeBefore,
            previousTotal,
            currentChequeBooks,
            updateCurrentBalance,
            selectChequeBook,
            handleContractChange,
            currentBeneficiaries,
            handleAmountChange,
            getCurrentChequeBooks,
            ethereumInterface,
            handleBeneficiaryChange
        } = this.props;
        const { invalidAddressWarning, fundingAccordionIsOpen } = this.state;

        return (
            <Fragment>
                <Accordion className="mt-4 mb-4" style={{ width : "100%" }}>
                    <AccordionItem expanded={true}>
                        <AccordionItemTitle>
                            <h6 className="u-position-relative">
                                <FontAwesomeIcon
                                    icon="clock"
                                    style={{
                                        marginRight : "5px"
                                    }}
                                    className="mr-2"
                                />
                                I already gave out a cheque to my beneficiary
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ChequeUploader />
                        </AccordionItemBody>
                    </AccordionItem>
                </Accordion>

                <Card>
                    <Card.Body>
                        <Form.Group as={Col} md="12">
                            <Form.Label>My cheque books</Form.Label>
                            <InputGroup className="mt-2">
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
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

                                <Select
                                    styles={this.getSelectStyles()}
                                    className="flex-expand searchSelect"
                                    placeholder="Select a cheque book"
                                    value={this.getChequeBookOptions().find(
                                        option => option.value == contract
                                    )}
                                    onChange={option => selectChequeBook( option.value )}
                                    isSearchable={true}
                                    selectOption={x => console.log( x )}
                                    //inputValue={contract}
                                    //defaultValue={ currentChequeBooks.find( x => x.address == contract )?.address }
                                    options={this.getChequeBookOptions()}
                                />
                            </InputGroup>

                            <Accordion className="mt-4" style={{ width : "100%" }}>
                                <AccordionItem>
                                    <AccordionItemTitle>
                                        <h6 className="u-position-relative">
                                            <FontAwesomeIcon icon="plus-circle" className="mr-2" />
                                            I want to create a new cheque book
                                            <div className="accordion__arrow" role="presentation" />
                                        </h6>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <RequestChequeBook
                                            ethereumInterface={ethereumInterface}
                                            selectChequeBook={selectChequeBook}
                                            getCurrentChequeBooks={getCurrentChequeBooks}
                                        />
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/*<Form.Row className="mt-2" />*/}
                <Card className="mt-4">
                    <Card.Body>
                        <Form.Group as={Col} md="12">
                            <Form.Label>Beneficiary</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button
                                        id="targetHashInput__prepend"
                                        variant="outline-secondary"
                                    >
                                        <FontAwesomeIcon
                                            icon="user"
                                            style={{
                                                marginRight : "3px",
                                                marginLeft : "3px"
                                            }}
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Creatable
                                    styles={this.getSelectStyles()}
                                    className="flex-expand searchSelect"
                                    noOptionsMessage={() =>
                                        "No options yet, go ahead and write down a new address"
                                    }
                                    placeholder="Known beneficiary or new wallet address"
                                    //onCreateOption={x => this.handleBeneficiaryCreation( x )}
                                    onChange={option =>
                                        this.handleBeneficiaryCreation( option.value )
                                    }
                                    value={this.getBeneficiariesOptions().find(
                                        option => option.value == beneficiary
                                    )}
                                    isSearchable={true}
                                    formatCreateLabel={() => "I'm done, add this address!"}
                                    //isValidNewOption={() => false}
                                    //inputValue={beneficiary}
                                    options={this.getBeneficiariesOptions()}
                                />
                            </InputGroup>
                            {invalidAddressWarning && (
                                <div className="mt-2">
                                    <AlertMessage
                                        style={{ width : "100%" }}
                                        intro="Uh oh..."
                                        message={invalidAddressWarning}
                                        icon="bug"
                                        variant="danger"
                                        dismissible={true}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="mt-4">
                    <Card.Body>
                        <Form.Group as={Col} md="12">
                            <Form.Label>New cheque amount</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button variant="outline-secondary">
                                        <FontAwesomeIcon
                                            icon={[ "fab", "ethereum" ]}
                                            style={{
                                                marginLeft : "2.5px",
                                                marginRight : "2.5px"
                                            }}
                                        />
                                    </Button>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    aria-label="Amount of ETH for new cheque"
                                    placeholder={( () => {
                                        if ( contract ) return "Amount of ETH for new cheque";
                                        else return "Please select a contract first";
                                    } )()}
                                    aria-describedby="basic-addon2"
                                    className={this.getAmountInputClasses()}
                                    name="Cheque amount"
                                    disabled={!contract}
                                    value={amount}
                                    onChange={e => handleAmountChange( e.target.value )}
                                />
                            </InputGroup>

                            <Accordion
                                className={this.getFundAccordionClasses()}
                                style={{ width : "100%" }}
                            >
                                <AccordionItem expanded={fundingAccordionIsOpen}>
                                    <AccordionItemTitle
                                        className={this.getFundAccordionTitleClasses()}
                                        onClick={() =>
                                            this.setState( prevState => ( {
                                                fundingAccordionIsOpen : !prevState.fundingAccordionIsOpen
                                            } ) )
                                        }
                                    >
                                        <h6 className="u-position-relative">
                                            <FontAwesomeIcon
                                                icon={[ "fab", "ethereum" ]}
                                                style={{
                                                    marginRight : "5px"
                                                }}
                                                className="mr-2"
                                            />
                                            Fund the cheque book
                                            <div className="accordion__arrow" role="presentation" />
                                        </h6>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <FundChequeBook
                                            getCurrentChequeBooks={getCurrentChequeBooks}
                                            ethereumInterface={ethereumInterface}
                                            contract={contract}
                                            preFilledBeneficiary={beneficiary}
                                        />
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {hasIssuedChequeBefore && (
                    <Alert
                        variant="info"
                        className="mt-2 alert-small animated fadeInUp"
                        style={{ width : "100%" }}
                    >
                        <FontAwesomeIcon
                            icon={[ "fab", "ethereum" ]}
                            className="mr-2"
                            style={{ marginLeft : "5px", marginRight : "5px" }}
                        />
                        Previously issued total amount for this beneficiary:{" "}
                        <strong>{previousTotal}</strong>
                    </Alert>
                )}
            </Fragment>
        );
    }
}
