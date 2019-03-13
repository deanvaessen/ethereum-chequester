import PropTypes from "prop-types";
import { Fragment } from "react";
import { Row } from "react-bootstrap";
import FormSpacer from "../FormSpacer";
import BeneficiariesOverview from "../BeneficiariesOverview";
import RequestChequeBook from "../../containers/RequestChequeBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from "react-accessible-accordion";

export default class MyBeneficiaries extends React.PureComponent {
    static propTypes = {
        currentBeneficiaries : PropTypes.array,
        activeBeneficiary : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        etherscanError : PropTypes.string,
        currentEthereumAddress : PropTypes.string,
        selectBeneficiary : PropTypes.func.isRequired,
        getCurrentBeneficiaries : PropTypes.func.isRequired
    };

    render() {
        const {
            currentBeneficiaries,
            ethereumInterface,
            getCurrentBeneficiaries,
            selectBeneficiary,
            activeBeneficiary,
            currentEthereumAddress,
            etherscanError
        } = this.props;

        return (
            <Fragment>
                <h5 className="mt-4">My beneficiaries</h5>
                <hr className="mt-2 mb-4" />

                <BeneficiariesOverview
                    handleSelect={selectBeneficiary}
                    beneficiaries={currentBeneficiaries}
                    activeBeneficiary={activeBeneficiary}
                    currentEthereumAddress={currentEthereumAddress}
                    getCurrentBeneficiaries={getCurrentBeneficiaries}
                    etherscanError={etherscanError}
                    shouldRenderCompact={true}
                />
            </Fragment>
        );
    }
}
