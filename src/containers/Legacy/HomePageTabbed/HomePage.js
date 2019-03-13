import { Fragment } from "react";
import "./style.scss";
import { Alert, Badge, Button, Row, Col, InputGroup, Form, Nav, Tabs, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IssueCheque from "../IssueCheque";
import RequestChequeBook from "../RequestChequeBook";
import FundChequeBook from "../FundChequeBook";
import CashCheque from "../CashCheque";
import PropTypes from "prop-types";

export default class HomePage extends React.Component {
    static propTypes = {
        history : PropTypes.object.isRequired,
        ethereumInterface : PropTypes.object.isRequired
    };

    initialState = {
        key : "issue"
    };

    state = this.initialState;

    render = () => {
        const { ethereumInterface, config, shouldPreFill } = this.props;
        const { TEST_CONTRACT, TEST_BENEFICIARY } = config;

        return (
            <article>
                <Tabs
                    id="homepage-tabs"
                    activeKey={this.state.key}
                    onSelect={key => this.setState( prevState => ( { ...prevState, key } ) )}
                    transition={false}
                >
                    <Tab eventKey="issue" title="Issue cheque">
                        <IssueCheque
                            ethereumInterface={ethereumInterface}
                            preFilledContract={shouldPreFill && TEST_CONTRACT}
                            preFilledBeneficiary={shouldPreFill && TEST_BENEFICIARY}
                        />
                    </Tab>
                    <Tab eventKey="cash" title="Cash cheque">
                        <CashCheque ethereumInterface={ethereumInterface} />
                    </Tab>
                    <Tab eventKey="requestChequeBook" title="Request cheque book">
                        <RequestChequeBook ethereumInterface={ethereumInterface} />
                    </Tab>
                    <Tab eventKey="FundChequeBook" title="Deposit funds">
                        <FundChequeBook
                            ethereumInterface={ethereumInterface}
                            preFilledContract={shouldPreFill && TEST_CONTRACT}
                            preFilledBeneficiary={shouldPreFill && TEST_BENEFICIARY}
                        />
                    </Tab>
                </Tabs>
            </article>
        );
    };
}

//<Nav.Link href="/">Active</Nav.Link>
