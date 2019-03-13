export default class Utils {
    /**
     * Creates an instance of Utils
     *
     * @param {object} web3 - Initialised web3 module
     */
    constructor( web3 ) {
        this.web3 = web3;
    }

    addressIsValid = address => address.length == 42;

    metaMaskIsLoaded = async () => {
        const metaMaskIsAvailable = this.metaMaskIsAvailable();
        const metaMaskIsLoggedIn = await this.metaMaskIsLoggedIn();

        return metaMaskIsAvailable && metaMaskIsLoggedIn;
    };

    metaMaskIsAvailable = () => {
        if ( !this.web3.currentProvider ) return false;

        return this.web3.currentProvider.isMetaMask === true;
    };

    metaMaskIsLoggedIn = async () => {
        const accounts = await this.getCurrentAccounts();

        return accounts.length > 0;
    };

    getCurrentProvider = () => {
        if ( !this.web3.currentProvider ) return null;

        return this.web3.currentProvider;
    };

    getCurrentAccounts = () => {
        return this.web3.eth.getAccounts();
    };
}
