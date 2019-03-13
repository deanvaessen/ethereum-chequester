const config = require( "../../../config/app.json" );
const EtherScan = require( "./etherscan" ).default;

const { ETHERSCAN_NETWORK, ETHERSCAN_API_KEY, TEST_OWNER } = config;
const etherScan = new EtherScan( ETHERSCAN_NETWORK, ETHERSCAN_API_KEY );

describe( "Middleware - EtherScan", () => {
    test( "Gets cheque books for our test owner", () => {
        global.fetch = require( "node-fetch" );

        return etherScan
            .getChequeBookContractCreationTransactions( null, TEST_OWNER )
            .then( chequeBooks => {
                expect( chequeBooks.length ).toBeGreaterThan( 0 );
            } )
            .catch( err => console.log( err ) );
    } );
} );
