export default class Etherscan {
    constructor( network, apiKey ) {
        this.network = network;
        this.apiKey = apiKey;
    }

    /**
     * Gets all cheque book contract creation events
     *
     * @param {string} account - The ethereum address to get all transactions from
     * @memberof Etherscan
     */
    getChequeBookContractCreationTransactions = ( contractInterface, account ) => {
        //prettier-ignore
        return this.getContractCreationTransactionsForAccount( account )
            .then( transactions => {
                return this.filterChequeBookContractCreationTransactions(
                    contractInterface,
                    transactions
                );
            } );
    };

    /**
     * Gets all contract creation transactionsf or an account
     *
     * @param {string} account - The ethereum address to get all transactions from
     * @memberof Etherscan
     */
    getContractCreationTransactionsForAccount = account => {
        return this.getAccountTransactionsForAccount( account ).then( transactions => {
            return this.filterContractCreationTransactions( transactions );
        } );
    };

    /**
     * Takes transactions and retains all the contract creation transcations
     * @param {array} transactions - All the transcations
     *
     * @memberof Etherscan
     */
    filterContractCreationTransactions = transactions => {
        return transactions.filter( transaction => transaction.to.length == 0 );
    };

    //@TODO: To remove: this is currently done in ethereum_interface by filtering any contracts that have an alias set by our methods
    filterChequeBookContractCreationTransactions = ( contractInterface, transactions ) => {
        return transactions;
    };

    /**
     * Gets all transcations for a certain account
     * @param {string} account - The ethereum address to get all transactions from
     *
     * @memberof Etherscan
     */
    getAccountTransactionsForAccount = account => {
        const baseUrl = `https://${this.network ||
            "api"}.etherscan.io/api?module=account&action=txlist&address=`;
        const query = `${account}&startblock=0&endblock=99999999sort=asc&apikey=`;
        const url = baseUrl + query + this.apiKey;

        return new Promise( ( resolve, reject ) => {
            if ( !account ) throw new Error( "Unable to find Ethereum account, are you logged in?" );

            resolve( fetch( url ) );
        } )
            .then( response => response.json() )
            .then( data => {
                const { status, message, result } = data;
                const responseIsOk = status === "1" || message == "No transactions found";

                if ( !responseIsOk ) throw new Error( "Unable to fetch data" );

                return result;
            } );
    };
}
