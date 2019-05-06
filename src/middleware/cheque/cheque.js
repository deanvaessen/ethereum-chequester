export default class Cheque {
    /**
     * Creates an instance of the Cheque middlware.
     *
     * @param {object} web3 - Intialised web3 module
     * @param {object} utils - Initialised utils middleware
     * @param {string} contract - The address of the contract on the blockchain
     * @param {string} beneficiary - The beneficiary's wallet address
     * @param {string} amount - Amount of ETH to tie to the cheque //@TODO: Number or string?
     * @param {string} previousTotal - Amount of ETH to tie to the cheque //@TODO: Number or string?
     * @param {string} signature - Signature for this cheque
     */
    constructor( web3, utils, contract, beneficiary, amount, previousTotal, signature ) {
        this.web3 = web3;
        this.utils = utils;
        this.contract = contract;
        this.beneficiary = beneficiary;
        this.amount = amount;
        this.previousTotal = previousTotal;
        this.signature = signature;
    }

    /**
     * Validates the cheque by the parameters given
     * Implements try/catch as the frontend could pass incorrect types for the cheque parameters via loading the cheque
     *
     * @memberof Cheque
     */
    isValid = () => {
        try {
            const contractAddressIsValid = this.utils.addressIsValid( this.contract );
            const beneficiaryAddressIsValid = this.utils.addressIsValid( this.beneficiary );
            const amountIsValid = this.amount && this.amount > this.previousTotal; //!this.amount to cheque if
            const signatureIsValid = this.signature; //@TODO: Validate signature length
            const previousTotalIsValid = this.previousTotal < this.amount;

            return (
                contractAddressIsValid &&
                beneficiaryAddressIsValid &&
                amountIsValid &&
                signatureIsValid &&
                previousTotalIsValid
            );
        } catch ( e ) {
            return false;
        }
    };

    /**
     * Issues a cheque
     *
     * @memberof Cheque
     */
    issue = () => {
        return this.web3.eth
            .getAccounts()
            .then( accounts => {
                return accounts[0];
            } )
            .then( account => {
                const hash = this.hashSignature();

                return this.signHash( hash, account );
            } )
            .then( signature => {
                //this.signature = this.web3.utils.fromAscii( signature ); // bytes32
                this.signature = signature; //string

                window.dispatchEvent( new Event( "sign.hasApproved" ) );

                return this.print();
            } );
    };

    /**
     * Hashes a signature
     *
     * @memberof Cheque
     */
    hashSignature = () => {
        const amountInWei = this.web3.utils.toWei( Number( this.amount ).toString(), "ether" );
        const string = this.web3.utils.soliditySha3( this.contract, this.beneficiary, amountInWei );
        //const bytes32 = this.web3.utils.fromAscii( string );

        return string;
    };

    /**
     * Signs a hash
     *
     * Note: Can also sign with owner address directly: https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign
     *
     * @memberof Cheque
     */
    signHash = ( hash, account ) => {
        window.dispatchEvent( new Event( "sign.shouldApprove" ) );

        return this.web3.eth.sign( hash, account );
    };

    /**
     * Extracts signature parameters r, s, v from a signature
     *
     * @memberof Cheque
     */
    getSignatureParameters = () => {
        const signature = this.signature;
        const r = signature.slice( 0, 66 );
        const s = `0x${signature.slice( 66, 130 )}`;
        let v = `0x${signature.slice( 130, 132 )}`;
        v = this.web3.utils.toDecimal( v );

        if ( ![ 27, 28 ].includes( v ) ) v += 27;

        return {
            r,
            s,
            v
        };
    };

    /**
     * Submit cheque to Ethereum to be cashed out
     * @param {object} contractInterface - The ABI/Bytecode of a contract
     * @param {json} contractInterface.abi - The ABI of a contract
     * @param {} contractInterface.bytecode - The Bytecode of a contract
     *
     * @memberof Cheque
     */
    cash = contractInterface => {
        return new Promise( ( resolve, reject ) => {
            this.web3.eth
                .getAccounts()
                .then( accounts => accounts[0] )
                .then( account => {
                    const { abi } = contractInterface;

                    return {
                        contract : new this.web3.eth.Contract( JSON.parse( abi ), this.contract ),
                        account
                    };
                } )
                .then( result => {
                    const { contract, account } = result;
                    const { r, s, v } = this.getSignatureParameters();
                    const amountInWei = this.web3.utils.toWei( this.amount.toString(), "ether" );

                    window.dispatchEvent( new Event( "sign.shouldApprove" ) );

                    return contract.methods
                        .cash( this.beneficiary, amountInWei, v, r, s )
                        .send( { from : account } )
                        .on( "transactionHash", () =>
                            window.dispatchEvent( new Event( "sign.hasApproved" ) )
                        )
                        .on( "receipt", receipt => {
                            const { status } = receipt;

                            if ( status == "0x0" ) {
                                reject(
                                    Error(
                                        "The cheque could not be cashed, please check your transaction in MetaMask"
                                    )
                                );
                            } else {
                                resolve( "Execution worked fine!" );
                            }
                        } )
                        .on( "error", reject );
                } )
                .catch( reject );
        } );
    };

    /**
     * Returns an object as an overview of the current cheque
     *
     * @memberof Cheque
     */
    print = () => {
        return {
            contract : this.contract,
            beneficiary : this.beneficiary,
            amount : this.amount,
            signature : this.signature
        };
    };
}
