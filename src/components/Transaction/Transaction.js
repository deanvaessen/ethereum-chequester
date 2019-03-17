import { Fragment } from "react";
import PropTypes from "prop-types";
import TransactionForm from "./TransactionForm";

export default class Transaction extends React.Component {
    static propTypes = {
        ethereumInterface : PropTypes.object.isRequired,
        getCurrentChequeBooks : PropTypes.func.isRequired,
        makeDeposit : PropTypes.func.isRequired,
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
        this.addListeners();
    }

    addListeners = () => {
        window.addEventListener( "deposit.shouldApprove", e => {
            this.setState( {
                metaMaskPromptIsAvailable : true
            } );
        } );

        window.addEventListener( "deposit.hasApproved", e => {
            this.setState( {
                metaMaskPromptIsAvailable : false
            } );
        } );
    };

    render() {
        const {
            receiverAddress,
            makeDeposit,
            transactionIsToContract,
            receiverType,
            icon,
            amountDescription,
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
                amountDescription={amountDescription}
                successText={successText}
                actionButtonText={actionButtonText}
                isInteractionWithEthereum={isInteractionWithEthereum}
                metaMaskPromptIsAvailable={metaMaskPromptIsAvailable}
            />
        );
    }
}
