import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Card, Col, Form, InputGroup, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import Async from "react-select/lib/Async";
import Select from "react-select";
import { Fragment } from "react";
import Creatable from "react-select/lib/Creatable";
import fundChequeBook from "../Transaction/fundChequeBook";
import Transaction from "../Transaction";
import directTransaction from "../Transaction/directTransaction";
import AlertMessage from "../AlertMessage";
import RequestChequeBook from "../RequestChequeBook";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

import { actionSetActiveChequeBook, actionFetchBeneficiaries } from "../../Actions";

export default class ChequeForm extends React.Component {
    static propTypes = {
        contract : PropTypes.string,
        beneficiary : PropTypes.string,
        activeChequeBookBalance : PropTypes.string,
        knownBeneficiaries : PropTypes.array,
        amount : PropTypes.string.isRequired,
        isFetchingChequeBooks : PropTypes.bool.isRequired,
        knownChequeBooks : PropTypes.array,
        hasIssuedChequeBefore : PropTypes.bool.isRequired,
        previousTotal : PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
        activeEthereumAddress : PropTypes.string,
        handleAmountChange : PropTypes.func.isRequired,
        ChequeUploader : PropTypes.func.isRequired,
        handleBeneficiaryChange : PropTypes.func.isRequired
    };

    initialState = {
        beneficiaryHasInsufficientFunds : false,
        chequeBookHasInsufficientFunds : false,
        invalidAddressWarning : null,
        directTransactionAccordionIsOpen : false,
        fundingAccordionIsOpen : false
    };

    state = this.initialState;

    componentDidMount() {
        this.verifyFunds();
    }

    componentDidUpdate( prevProps, prevState ) {
        this.verifyFunds();
    }

    getSelectStyles = () => {
        return {
            menu : ( provided, state ) => ( {
                ...provided,
                zIndex : 50
            } )
        };
    };

    verifyFunds = () => {
        const {
            activeBeneficiaryBalance,
            beneficiary,
            activeChequeBookBalance,
            amount
        } = this.props;

        const beneficiaryHasInsufficientFunds =
            beneficiary && activeBeneficiaryBalance && Number( activeBeneficiaryBalance ) > 0
                ? false
                : true;
        const chequeBookHasInsufficientFunds = this.balanceIsInsufficient(
            activeChequeBookBalance,
            amount
        );
        let fundingSituationChanged = false;

        fundingSituationChanged =
            this.state.beneficiaryHasInsufficientFunds !== beneficiaryHasInsufficientFunds ||
            this.state.chequeBookHasInsufficientFunds !== chequeBookHasInsufficientFunds;

        if ( fundingSituationChanged ) {
            this.setState( {
                beneficiaryHasInsufficientFunds,
                chequeBookHasInsufficientFunds
            } );
        }
    };

    getChequeBookOptions = () => {
        const { knownChequeBooks } = this.props;
        const chequeBookOptions = knownChequeBooks
            ? knownChequeBooks.map( chequeBook => {
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
        const { knownBeneficiaries } = this.props;
        const beneficiaryOptions = knownBeneficiaries
            ? knownBeneficiaries.map( beneficiary => {
                return {
                    value : beneficiary,
                    label : `${beneficiary}`
                };
            } )
            : [];

        return beneficiaryOptions;
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

    balanceIsInsufficient = ( balance, amount ) => {
        if ( amount == null ) return true;

        return Number( amount ) > Number( balance );
    };

    getAmountInputClasses = () => {
        const { activeChequeBookBalance, amount } = this.props;

        const classes = this.balanceIsInsufficient( activeChequeBookBalance, amount )
            ? "insufficient-balance"
            : "";

        return classes;
    };

    getFundAccordionClasses = () => {
        //const { fundingAccordionIsOpen, directTransactionAccordionIsOpen } = this.state;

        const baseStyles = "mt-4 mb-0";

        return baseStyles;

        /*
        const insufficientBalanceStyles =
            this.balanceIsInsufficient() &&
            !fundingAccordionIsOpen &&
            !directTransactionAccordionIsOpen
                ? "animated bounce infinite slow"
                : "";

        return `${baseStyles} ${insufficientBalanceStyles}`;
        */
    };

    getFundingAccordionTitleClasses = () => {
        const {
            fundingAccordionIsOpen,
            beneficiaryHasInsufficientFunds,
            chequeBookHasInsufficientFunds
        } = this.state;

        const baseStyles = "accordion__title";
        const insufficientBalanceStyles =
            chequeBookHasInsufficientFunds &&
            !beneficiaryHasInsufficientFunds &&
            !fundingAccordionIsOpen
                ? "call-to-action"
                : "";

        return `${baseStyles} ${insufficientBalanceStyles}`;
    };

    getDirectPaymentAccordionTitleClasses = () => {
        const { directTransactionAccordionIsOpen, beneficiaryHasInsufficientFunds } = this.state;
        const { beneficiary, activeBeneficiaryBalance } = this.props;

        const baseStyles = "accordion__title";
        const insufficientBalanceStyles =
            beneficiary &&
            activeBeneficiaryBalance &&
            beneficiaryHasInsufficientFunds &&
            !directTransactionAccordionIsOpen
                ? "call-to-action"
                : "";

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
            knownChequeBooks,
            isFetchingChequeBooks,
            activeEthereumAddress,
            handleAmountChange,
            ethereumInterface,
            dispatch
        } = this.props;
        const {
            invalidAddressWarning,
            fundingAccordionIsOpen,
            directTransactionAccordionIsOpen,
            beneficiaryHasInsufficientFunds,
            chequeBookHasInsufficientFunds
        } = this.state;

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
                                    placeholder={
                                        isFetchingChequeBooks
                                            ? "Updating your cheque books, one moment please..."
                                            : "Select a cheque book"
                                    }
                                    value={
                                        this.getChequeBookOptions().find(
                                            option => option.value == contract
                                        ) || null
                                    }
                                    onChange={option =>
                                        actionSetActiveChequeBook( dispatch )(
                                            option.value,
                                            knownChequeBooks
                                        ).then( () =>
                                            actionFetchBeneficiaries( dispatch )(
                                                activeEthereumAddress,
                                                option.value
                                            )
                                        )
                                    }
                                    isSearchable={true}
                                    selectOption={x => console.log( x )}
                                    //inputValue={contract}
                                    //defaultValue={ knownChequeBooks.find( x => x.address == contract )?.address }
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
                                        <RequestChequeBook ethereumInterface={ethereumInterface} />
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        </Form.Group>
                    </Card.Body>
                </Card>

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
                                    onCreateOption={x => console.log( x )}
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
                                        messageIsBold={true}
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
                                        className={this.getFundingAccordionTitleClasses()}
                                        onClick={() => {
                                            this.setState( prevState => {
                                                const willOpen = !prevState.fundingAccordionIsOpen;

                                                return {
                                                    directTransactionAccordionIsOpen : willOpen
                                                        ? false
                                                        : prevState.directTransactionAccordionIsOpen,
                                                    fundingAccordionIsOpen : !prevState.fundingAccordionIsOpen
                                                };
                                            } );
                                        }}
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
                                        <Transaction
                                            successText="Your ETH has been deposited into the contract"
                                            icon="file-contract"
                                            receiverType="contract"
                                            amountDescription="Amount to deposit"
                                            actionButtonText="Deposit funds"
                                            transactionDescription={
                                                chequeBookHasInsufficientFunds &&
                                                !beneficiaryHasInsufficientFunds
                                                    ? "Your cheque book does not have sufficient funds to issue this cheque." +
                                                      "You may deposit funds here."
                                                    : null
                                            }
                                            makeDeposit={fundChequeBook}
                                            ethereumInterface={ethereumInterface}
                                            receiverAddress={contract}
                                        />
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>

                            <Accordion className="mt-4 mb-0" style={{ width : "100%" }}>
                                <AccordionItem expanded={directTransactionAccordionIsOpen}>
                                    <AccordionItemTitle
                                        className={this.getDirectPaymentAccordionTitleClasses()}
                                        onClick={() => {
                                            this.setState( prevState => {
                                                const willOpen = !prevState.directTransactionAccordionIsOpen;

                                                return {
                                                    directTransactionAccordionIsOpen : !prevState.directTransactionAccordionIsOpen,
                                                    fundingAccordionIsOpen : willOpen
                                                        ? false
                                                        : prevState.fundingAccordionIsOpen
                                                };
                                            } );
                                        }}
                                    >
                                        <h6 className="u-position-relative">
                                            <FontAwesomeIcon
                                                icon={[ "fab", "ethereum" ]}
                                                style={{
                                                    marginRight : "5px"
                                                }}
                                                className="mr-2"
                                            />
                                            Make direct payment
                                            <div className="accordion__arrow" role="presentation" />
                                        </h6>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <Transaction
                                            successText="Your ETH has been transfered to the beneficiary's account"
                                            icon="user"
                                            receiverType="beneficiary"
                                            amountDescription="Amount to transfer"
                                            actionButtonText="Transfer funds"
                                            transactionDescription={
                                                beneficiaryHasInsufficientFunds
                                                    ? "Your beneficiary does not have sufficient funds to pay the transaction fees." +
                                                      " You may either ignore this warning and proceed, or make a direct transfer."
                                                    : null
                                            }
                                            makeDeposit={directTransaction}
                                            ethereumInterface={ethereumInterface}
                                            receiverAddress={beneficiary}
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
