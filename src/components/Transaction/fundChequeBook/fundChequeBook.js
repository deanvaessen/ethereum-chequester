export default function makeDeposit ( amount ) {
    const { getCurrentChequeBooks, ethereumInterface, receiverAddress } = this.props;
    const etherScanDelay = 5000; // @TODO: this is really stupid, but serves as a temporary quick hack to prevent an issue where there is a delay between transaction completion and when the result is available/queryable on Etherscan

    this.setState( {
        moneyHasBeenDeposited : false,
        isInteractionWithEthereum : true
    } );

    ethereumInterface
        .depositIntoChequeBook( amount, receiverAddress )
        .then( result => {
            setTimeout( () => {
                getCurrentChequeBooks( () => {
                    this.setState( {
                        moneyHasBeenDeposited : true,
                        isInteractionWithEthereum : false
                    } );
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