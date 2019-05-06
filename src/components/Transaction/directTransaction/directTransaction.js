export default function directTransaction( amount ) {
    const { ethereumInterface, receiverAddress } = this.props;

    this.setState( {
        moneyHasBeenDeposited : false,
        isInteractionWithEthereum : true
    } );

    ethereumInterface
        .sendFunds( amount, receiverAddress )
        .then( result => {
            this.setState( {
                moneyHasBeenDeposited : true,
                isInteractionWithEthereum : false
            } );
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
