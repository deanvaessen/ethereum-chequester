import { Fragment } from "react";
import PropTypes from "prop-types";
import TransactionForm from "./TransactionForm";
import SubscribeToEventMetaMaskSign from "../Events/SignMetaMask";

export default class Transaction extends React.Component {
    static propTypes = {
        activeEthereumAddress : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        dispatch : PropTypes.func.isRequired,
        makeDeposit : PropTypes.func.isRequired,
        transactionDescription : PropTypes.string,
        receiverAddress : PropTypes.string,
        receiverType : PropTypes.string,
        icon : PropTypes.string.isRequired,
        amountDescription : PropTypes.string.isRequired,
        successText : PropTypes.string.isRequired,
        actionButtonText : PropTypes.string.isRequired
    };

    initialState = {
        error : null,
        moneyHasBeenDeposited : false,
        isInteractionWithEthereum : false,
        metaMaskPromptIsAvailable : false
    };

    state = this.initialState;

    componentDidMount() {
        SubscribeToEventMetaMaskSign.call( this );
    }

    render() {
        const {
            receiverAddress,
            makeDeposit,
            transactionIsToContract,
            receiverType,
            icon,
            amountDescription,
            transactionDescription,
            successText,
            actionButtonText
        } = this.props;

        const {
            error,
            moneyHasBeenDeposited,
            isInteractionWithEthereum,
            metaMaskPromptIsAvailable
        } = this.state;

        return (
            <TransactionForm
                error={error}
                receiverAddress={receiverAddress}
                makeDeposit={makeDeposit.bind( this )}
                transactionIsToContract={transactionIsToContract}
                moneyHasBeenDeposited={moneyHasBeenDeposited}
                receiverType={receiverType}
                icon={icon}
                transactionDescription={transactionDescription}
                amountDescription={amountDescription}
                successText={successText}
                actionButtonText={actionButtonText}
                isInteractionWithEthereum={isInteractionWithEthereum}
                metaMaskPromptIsAvailable={metaMaskPromptIsAvailable}
            />
        );
    }
}
