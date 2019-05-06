/**
 * Interface to wrap ChequeBook & Cheque
 */
export default class EthereumInterface {
    /**
     * Creates an instance of the EthereumInterface middleware.
     *
     * @param {object} web3 - Intialised web3
     * @param {object} utils - Initialised utils middleware
     * @param {object} ChequeBook - The cheque book middleware
     * @param {object} Cheque - The cheque middleware
     * @param {object} EtherScan - EtherScan middleware
     * @param {object} solCompiler - Initialised solCompiler middleware
     * @param {string} path - Path npm module
     * @param {string} config - Application config
     */
    constructor( dependencies ) {
        this.web3 = dependencies.web3;
        this.path = dependencies.path;
        this.utils = dependencies.utils;
        this.EtherScan = dependencies.EtherScan;
        this.transactions = new dependencies.Transactions( this.web3, this.path );
        this.ChequeBook = dependencies.ChequeBook;
        this.Cheque = dependencies.Cheque;
        this.solCompiler = dependencies.solCompiler;
        this.config = dependencies.config;
    }

    /**
     * Verifies if an ethereum address is valid
     *
     * @param {string} address - The address in question
     *
     * @memberof EthereumInterface
     */
    addressIsValid = address => this.utils.addressIsValid( address );

    metaMaskIsLoaded = () => this.utils.metaMaskIsLoaded();

    getCurrentProvider = () => this.utils.getCurrentProvider();

    metaMaskIsAvailable = () => this.utils.metaMaskIsAvailable();

    metaMaskIsLoggedIn = () => this.utils.metaMaskIsLoggedIn();

    getCurrentAccounts = () => this.utils.getCurrentAccounts();

    /**
     * Records a new cheque book on Ethereum
     *
     * @param {string} alias - The alias for the new cheque book
     *
     * @memberof EthereumInterface
     */
    requestChequeBook = alias => {
        const chequeBook = new this.ChequeBook(
            this.solCompiler,
            this.web3,
            this.path,
            this.transactions
        );

        return chequeBook.request( alias );
    };

    getBalance = contractAddress => this.transactions.getBalance( contractAddress );

    /**
     * Deposits ETH into a cheque book
     * @param {string} amount - Amount of eth
     * @param {string} contract - Ethereum address of the cheque book contract
     *
     * @memberof EthereumInterface
     */
    depositIntoChequeBook = ( amount, contract ) => {
        const chequeBook = new this.ChequeBook(
            this.solCompiler,
            this.web3,
            this.path,
            this.transactions,
            contract
        );

        return chequeBook.deposit( amount );
    };

    /**
     * Sends ETH funds to a receiver
     *
     * @param {string} amount - Amount of ETH to be sent
     * @param {string} receiverAddress - Receiver address to send the amount to
     */
    sendFunds = ( amount, receiverAddress ) => {
        return this.transactions.deposit( amount, receiverAddress );
    };

    /**
     * Gets all the cheque books for a user
     * @param {string} account - The account to get the cheque books for
     *
     * @memberof EthereumInterface
     */
    getUserChequeBooks = account => {
        const { ETHERSCAN_API_KEY, ETHERSCAN_NETWORK } = this.config;
        const chequeBook = new this.ChequeBook(
            this.solCompiler,
            this.web3,
            this.path,
            this.transactions
        );
        const etherScan = new this.EtherScan( ETHERSCAN_NETWORK, ETHERSCAN_API_KEY );

        return new Promise( async ( resolve, reject ) => {
            try {
                const { abi, bytecode } = await chequeBook.getInterface();

                etherScan
                    .getChequeBookContractCreationTransactions( { abi, bytecode }, account )
                    .then( chequeBooks => Promise.all( chequeBook.addBalances( chequeBooks ) ) )
                    .then( chequeBooks => Promise.all( chequeBook.addAliases( chequeBooks, abi ) ) )
                    .then( chequeBooks => chequeBooks.filter( chequeBook => chequeBook.alias ) )
                    .then( chequeBooks => resolve( chequeBooks ) )
                    .catch( err => reject( err ) );
            } catch ( err ) {
                reject( err );
            }
        } );
    };

    /** Cheques methods */

    /**
     * Verifies validity of a cheque
     *
     * @param {json} jsonFile - The cheque
     * @param {string} jsonFile.contract - Ethereum address of the cheque book contract
     * @param {string} jsonFile.beneficiary - Ethereum address of the beneficiary
     * @param {string} jsonFile.amount  - Amount of eth
     * @param {string} jsonFile.previousTotal  - Previous total amount of eth for this beneficiary
     * @param {string} jsonFile.signature  - Cheque signature
     * @memberof EthereumInterface
     */
    chequeIsValid = jsonFile => {
        const { contract, beneficiary, amount, previousTotal, signature } = jsonFile;
        const cheque = new this.Cheque(
            this.web3,
            this.utils,
            contract,
            beneficiary,
            amount,
            previousTotal,
            signature
        );

        return cheque.isValid();
    };

    /**
     * Issues a cheque
     *
     * @param {string} contract - Ethereum address of the cheque book contract
     * @param {string} beneficiary - Ethereum address of the beneficiary
     * @param {string} amount - Amount of eth
     * @memberof EthereumInterface
     */
    issueCheque = ( contract, beneficiary, amount ) => {
        const cheque = new this.Cheque( this.web3, this.utils, contract, beneficiary, amount );

        return cheque.issue();
    };

    /**
     * @param {string} contract - Ethereum address of the cheque book contract
     * @param {string} beneficiary - Ethereum address of the beneficiary
     * @param {string} amount  - Amount of eth
     * @param {string} previousTotal  - Previous total amount of eth for this beneficiary
     * @param {string} signature  - Cheque signature
     * @memberof EthereumInterface
     */
    cashCheque = ( contract, beneficiary, amount, previousTotal, signature ) => {
        const chequeBook = new this.ChequeBook(
            this.solCompiler,
            this.web3,
            this.path,
            this.transactions
        );
        const cheque = new this.Cheque(
            this.web3,
            this.utils,
            contract,
            beneficiary,
            amount,
            previousTotal,
            signature
        );

        //prettier-ignore
        return chequeBook.getInterface()
            .then( contractInterface => cheque.cash( contractInterface ) );
    };
}
