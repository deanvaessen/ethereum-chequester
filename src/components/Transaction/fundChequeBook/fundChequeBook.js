import { actionFetchChequeBooks, actionSetActiveChequeBookBalance } from "../../../Actions";
import { getBalanceOfChequeBook } from "../../App/Actions/helpers/ChequeBook";

export default function fundChequeBook( amount ) {
    const { activeEthereumAddress, ethereumInterface, receiverAddress, dispatch } = this.props;
    const etherScanDelay = 5000; // @TODO: this is really stupid, but serves as a temporary quick hack to prevent an issue where there is a delay between transaction completion and when the result is available/queryable on EtherScan

    this.setState( {
        moneyHasBeenDeposited : false,
        isInteractionWithEthereum : true,
        error : null
    } );

    ethereumInterface
        .depositIntoChequeBook( amount, receiverAddress )
        .then( result => {
            setTimeout( () => {
                actionFetchChequeBooks( dispatch, ethereumInterface )( activeEthereumAddress )
                    .then( () => {
                        this.setState( {
                            moneyHasBeenDeposited : true,
                            isInteractionWithEthereum : false
                        } );
                    } )
                    .then( () => {
                        const { knownChequeBooks, activeChequeBook } = this.props;
                        const balance = getBalanceOfChequeBook( activeChequeBook, knownChequeBooks );

                        actionSetActiveChequeBookBalance( dispatch )( balance );
                    } );
            }, etherScanDelay );
        } )
        .catch( error =>
            this.setState( {
                isInteractionWithEthereum : false,
                metaMaskPromptIsAvailable : false,
                moneyHasBeenDeposited : false,
                error : error.message
            } )
        );
}
