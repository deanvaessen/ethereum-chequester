export default class SolCompiler {
    /**
     * Creates an instance of the SolCompiler middleware
     *
     * @param {object} BrowserSolc - BrowserSolc npm module
     */
    constructor( dependencies ) {
        this.BrowserSolc = dependencies.BrowserSolc;
    }

    getCompilers = () => {
        return new Promise( ( resolve, reject ) => {
            this.BrowserSolc.getVersions( ( soljsonSources, soljsonReleases ) => {
                resolve( soljsonReleases );
            } );
        } );
    };

    /**
     *
     * @param {string} leadContract - As we can have multiple inputs (contract imports), this is the contract you want the compilation result of.
     * @param {string} compilerVersion - Compiler version to load
     * @param {object} contracts - All the input contracts required
     */
    compile = ( leadContract, contracts, compilerVersion ) => {
        return new Promise( ( resolve, reject ) => {
            this.BrowserSolc.loadVersion( compilerVersion, compiler => {
                console.log( "Solc Version Loaded: " + compilerVersion );

                const shouldOptimise = 1;
                const result = compiler.compile( { sources : contracts }, shouldOptimise );
                const key = `${leadContract}:${leadContract.split( ".sol" )[0]}`;
                const { errors } = result;
                const hasErrors =
                    errors && errors?.length > 0 && JSON.stringify( result.errors ).match( /error/i );
                const hasOnlyWarnings = !hasErrors && errors?.length > 0;

                if ( hasOnlyWarnings ) {
                    console.log( "WARNINGS:" );
                    console.log( errors );
                }

                if ( hasErrors ) {
                    reject( new Error( result.errors.join( " && " ) ) );
                } else {
                    const abi = result.contracts[key].interface;
                    const bytecode = "0x" + result.contracts[key].bytecode;

                    resolve( {
                        abi,
                        bytecode
                    } );
                }
            } );
        } );
    };
}
