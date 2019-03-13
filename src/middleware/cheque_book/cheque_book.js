export default class ChequeBook {
    /**
     * Creates an instance of the Cheque Book middleware.
     *
     * @param {object} web3 - Intialised web3
     * @param {object} solCompiler - Initialised solCompiler middleware
     * @param {object} path - Path npm module
     * @param {string} contract - The address of the contract on the blockchain
     */
    constructor( solCompiler, web3, path, contract ) {
        this.solCompiler = solCompiler;
        this.web3 = web3;
        this.path = path;
        this.contract = contract;
    }

    /**
     * Records a new cheque book on Ethereum
     *
     * @param {string} alias - The alias for the new cheque book
     *
     * @memberof ChequeBook
     */
    request = async alias => {
        return this.getInterface().then( contract => {
            const { abi, bytecode } = contract;

            return this.deploy( abi, bytecode, [ alias ] );
        } );
    };

    /**
     * Adds balances to existing chequeBooks
     *
     * @param {array} chequeBooks - The cheque books you want to add balances of
     * @param {object} chequeBooks[i] - The target cheque book
     * @param {string} chequeBooks[i].contractAddress - The Ethereum address for the target contract
     *
     * @memberof ChequeBook
     */
    addBalances = chequeBooks => {
        return chequeBooks.map( chequeBook => {
            const { contractAddress } = chequeBook;

            //prettier-ignore
            return this.getBalance( contractAddress )
                .then( balance => ( {
                    ...chequeBook,
                    balance
                } ) );
        } );
    };

    /**
     * Gets a balance for a cheque book contract
     *
     * @param {string} contractAddress - The Ethereum address for the target contract
     *
     * @memberof ChequeBook
     */
    getBalance = contractAddress => {
        return this.web3.eth
            .getBalance( contractAddress )
            .then( balance => this.web3.utils.fromWei( balance ) );
    };

    /**
     * Adds aliases to existing chequeBooks
     *
     * @param {array} chequeBooks - The cheque books you want to add balances of
     * @param {object} chequeBooks[i] - The target cheque book
     * @param {string} chequeBooks[i].contractAddress - The Ethereum address for the target contract
     * @param {json} abi - The contract abi
     *
     * @memberof ChequeBook
     */
    addAliases = ( chequeBooks, abi ) => {
        return chequeBooks.map( chequeBook => {
            const { contractAddress } = chequeBook;

            //prettier-ignore
            return this.getAlias( contractAddress, abi )
                .then( alias => ( {
                    ...chequeBook,
                    alias
                } ) );
        } );
    };

    /**
     * Gets an alias for a cheque book contract
     *
     * @param {string} contractAddress - The Ethereum address for the target contract
     * @param {json} abi - The contract abi
     *
     * @memberof ChequeBook
     */
    getAlias = ( contractAddress, abi ) => {
        const instance = new this.web3.eth.Contract( JSON.parse( abi ), contractAddress );

        return instance
            .getPastEvents( "AliasRegistered", { fromBlock : 0, toBlock : "latest" } )
            .then( events => {
                const registrationEvent = events[0];

                return registrationEvent?.returnValues?.alias;
            } )
            .catch( err => console.log( err ) );
    };

    /**
     * Deposits ETH funds into the ChequeBook
     *
     * @param {string} amount - Amount of ETH to deposit into the cheque book
     */
    deposit = amount => {
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
                        to : this.contract,
                        value : amountInWei
                    } )
                    .on( "transactionHash", transactionHash => {
                        window.dispatchEvent( new Event( "deposit.hasApproved" ) );
                    } );
            } );
    };

    /**
     * Gets the ABI/Bytecode interface for a contract
     *
     * @memberof ChequeBook
     */
    getInterface = () => {
        //prettier-ignore
        return this.getPreCompiledChequeBook()
            .then( contract => {
                if ( !contract ) return this.compile();
                else return contract;
            } );
    };

    /**
     * Gets a pre-compiled interface for a contract
     *
     * @memberof ChequeBook
     */
    getPreCompiledChequeBook = () => {
        const contractPaths = [
            {
                filename : "chequebook.bytecode",
                path : this.path.resolve( __dirname, "src/contracts/compiled", "chequebook.bytecode" )
            },
            {
                filename : "chequebook.abi.json",
                path : this.path.resolve( __dirname, "src/contracts/compiled", "chequebook.abi.json" )
            }
        ];

        return this.getContracts( contractPaths ).then( contract => {
            if ( !contract ) return null;
            //return null; // temp

            return {
                bytecode : contract["chequebook.bytecode"],
                abi : contract["chequebook.abi.json"]
            };
        } );
    };

    /**
     *
     * @param {array} [ head, ...tail ] - Array of objects with "filename" & "path" keys
     * @param {array} [total] - Intermediate result recursively called by the function
     */
    getContracts = ( [ head, ...tail ], total ) => {
        //prettier-ignore
        return !head
            ? Promise.resolve( total )
            : this.getContract( head )
                .then( result => {
                    total = {
                        ...total || {},
                        ...result
                    };

                    return this.getContracts( tail, total );
                } );
    };

    /**
     *
     * @param {string} path - The path to the contract
     */
    getContract = contract => {
        const { filename, path } = contract;

        return fetch( path )
            .then( response => response.text() )
            .then( text => ( {
                [filename] : text
            } ) );
    };

    /**
     * Compiles a new version of the ABI/Bytecode for a cheque book contract
     *
     * @memberof ChequeBook
     */
    compile = () => {
        const leadContract = "chequebook.sol";
        const contractPaths = [
            {
                filename : "chequebook.sol",
                path : this.path.resolve( __dirname, "src/contracts", "chequebook.sol" )
            },
            {
                filename : "mortal.sol",
                path : this.path.resolve( __dirname, "src/contracts", "mortal.sol" )
            },
            {
                filename : "owned.sol",
                path : this.path.resolve( __dirname, "src/contracts", "owned.sol" )
            }
        ];
        let contracts = {};

        return this.getContracts( contractPaths )
            .then( result => {
                console.log( "Fetched contract" );
                contracts = result;

                return this.solCompiler.getCompilers();
            } )
            .then( compilers => {
                console.log( "Fetched compiler" );
                //const compiler = Object.values( compilers )[0];
                const compiler = compilers["0.4.25"];

                return this.solCompiler.compile( leadContract, contracts, compiler );
            } )
            .then( result => {
                console.log( "Compiled contracts" );

                return result;
            } );
        //.catch( err => console.log( err ) );
    };

    /*
        estimateGas = ( contract bytecode, parameter ) => {
            const contractData = contract.new.getData( parameter, {
                data : bytecode
            } );

            return this.web3.eth.estimateGas( { data : contractData } );
        }
    */

    //@TODO: Deploy to real network
    /**
     *
     * @param {json} abi
     * @param {} bytecode
     * @param {array} parameters - array of arguments for the contract
     * @returns
     * @memberof ChequeBook
     */
    deploy = ( abi, bytecode, parameters ) => {
        console.log( "Deploying contract" );

        let account;
        let contract;

        return this.web3.eth
            .getAccounts()
            .then( accounts => {
                account = accounts[0];
            } )
            .then( _ => new this.web3.eth.Contract( JSON.parse( abi ) ) )
            .then( loadedContract => {
                console.log( "Loaded contract, now deploying..." );
                contract = loadedContract;

                return contract.deploy(
                    {
                        data : bytecode,
                        arguments : parameters
                    },
                    { gas : 5000000 }
                );
            } )
            .then( deployableContract => {
                console.log( "Prepared contract for deployment, now sending..." );

                window.dispatchEvent( new Event( "contract.shouldApprove" ) );

                //deployableContract.estimateGas().then( result => console.log( result ) );

                return (
                    deployableContract
                        .send( { from : account } )
                        //.on('error', (error) => { ... })
                        .on( "transactionHash", transactionHash => {
                            window.dispatchEvent( new Event( "contract.hasApproved" ) );
                        } )
                );

                /*
                    .on( "receipt", receipt => {
                        console.log( receipt.contractAddress ); // contains the new contract address
                    } )
                    .on( "confirmation", ( confirmationNumber, receipt ) => {
                        console.log( confirmationNumber );
                        console.log( receipt );
                    } )
                */
                /*
                    .then( newContractInstance => {
                        console.log( newContractInstance.options.address ); // instance with the new contract address

                        return newContractInstance;
                    } )
                */
            } );
    };
}
