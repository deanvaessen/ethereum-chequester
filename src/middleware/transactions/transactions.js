export default class Transactions {
    /**
     * Creates an instance of the Cheque Book middleware.
     *
     * @param {object} web3 - Intialised web3
     * @param {object} solCompiler - Initialised solCompiler middleware
     * @param {object} path - Path npm module
     * @param {string} contract - The address of the contract on the blockchain
     */
    constructor( web3, path ) {
        this.web3 = web3;
        this.path = path;
    }

    /**
     * Sends ETH funds to a receiver
     *
     * @param {string} amount - Amount of ETH to be sent
     * @param {string} receiverAddress - Receiver address to send the amount to
     */
    deposit = ( amount, receiverAddress ) => {
        const amountInWei = this.web3.utils.toWei( amount.toString(), "ether" );

        return this.web3.eth
            .getAccounts()
            .then( accounts => {
                window.dispatchEvent( new Event( "deposit.shouldApprove" ) );

                return accounts[0];
            } )
            .then( account => {
                return this.web3.eth
                    .sendTransaction( {
                        from : account,
                        to : receiverAddress,
                        value : amountInWei
                    } )
                    .on( "transactionHash", transactionHash => {
                        window.dispatchEvent( new Event( "deposit.hasApproved" ) );
                    } );
            } );
    };
}
