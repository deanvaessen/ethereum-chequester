/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";

import { Row } from "react-bootstrap";

//import HomePage from "../HomePage/";
import Splash from "../../components/Splash/";
import NavBar from "../../components/NavBar/";
import PageNotFound from "../../components/PageNotFound";
import Page from "../../components/Page";
import AlertMessage from "../../components/AlertMessage";
import IssueCheque from "../IssueCheque";
//import Dashboard from "../Dashboard";
import CashCheque from "../CashCheque";

import "./App.scss";
import LoadingIndicator from "../../components/LoadingIndicator";

export default class App extends React.Component {
    static propTypes = {
        history : PropTypes.object.isRequired,
        ethereumInterface : PropTypes.object.isRequired
    };

    initialState = {
        currentEthereumAddress : null,
        metaMaskError : null,
        hasCheckedMetaMask : false,
        hasCheckedEtherScan : false,
        shouldRenderSplash : false,
        currentChequeBooks : [],
        currentBeneficiaries : [],
        activeChequeBook : "",
        activeBalance : "0",
        activeBeneficiary : "",
        etherscanError : null
    };

    state = this.initialState;

    pages = [
        /*
        {
            path : "/",
            label : "Dashboard"
        },
        */
        {
            path : "/",
            label : "Issue"
        },
        {
            path : "/cash",
            label : "Cash"
        }
    ];

    componentDidMount() {
        const { currentEthereumAddress } = this.state;

        this.monitorMetaMask();

        if ( currentEthereumAddress ) {
            this.getCurrentChequeBooks();
            this.getCurrentBeneficiaries();
        } else {
            this.setState( { shouldRenderSplash : true } );
        }
    }

    pollMetaMask = () => {
        const { ethereumInterface } = this.props;
        const {
            currentEthereumAddress,
            metaMaskError,
            shouldRenderSplash,
            hasCheckedMetaMask
        } = this.state;
        //const { web3 } = this.props;
        const shouldCheckForAccountUpdate = ethereumInterface.metaMaskIsAvailable(); //web3;
        const shouldAskUserToInstallMetaMask = !ethereumInterface.metaMaskIsAvailable(); //!web3 && !metaMaskError;

        if ( shouldAskUserToInstallMetaMask ) {
            this.setState( {
                shouldRenderSplash : true,
                hasCheckedMetaMask : true,
                metaMaskError : "Please install MetaMask."
            } );
        } else if ( shouldCheckForAccountUpdate ) {
            ethereumInterface
                .getCurrentAccounts()
                .then( accounts => {
                    const newAddress = accounts[0];
                    const accountHasLoggedOut = currentEthereumAddress && !newAddress;
                    const accountHasBeenUpdated =
                        newAddress && newAddress !== currentEthereumAddress;

                    if ( accountHasBeenUpdated ) {
                        this.setState( {
                            hasCheckedMetaMask : true,
                            currentEthereumAddress : newAddress,
                            metaMaskError : null,
                            shouldRenderSplash : false
                        } );
                    } else if ( accountHasLoggedOut ) {
                        this.setState( {
                            hasCheckedMetaMask : true,
                            currentEthereumAddress : newAddress,
                            metaMaskError : "You are not logged in to MetaMask"
                        } );
                    } else if ( !hasCheckedMetaMask ) {
                        this.setState( {
                            metaMaskError : "You are not logged in to MetaMask",
                            hasCheckedMetaMask : true
                        } );
                    }
                } )
                .catch( err => {
                    this.setState( {
                        shouldRenderSplash : currentEthereumAddress ? false : true, // do not go back to splash when I was already logged in
                        metaMaskError : err.message,
                        hasCheckedMetaMask : true
                    } );
                } );
        }
    };

    getCurrentChequeBooks = callback => {
        const { ethereumInterface } = this.props;
        const { currentEthereumAddress } = this.state;

        this.setState( {
            currentChequeBooks : [],
            etherscanError : null
        } );

        return (
            ethereumInterface
                .getUserChequeBooks( currentEthereumAddress )
                .then( results =>
                    results.map( contract => ( {
                        balance : contract.balance,
                        alias : contract.alias,
                        address : contract.contractAddress.toLowerCase() // Etherscan and web3 sometimes give different cases
                    } ) )
                )
                //.then( chequeBooks => chequeBooks.map( chequeBook => ( { ...chequeBook, balance : 0 } ) ) )
                .then( currentChequeBooks => {
                    this.setState( { currentChequeBooks, hasCheckedEtherScan : true }, () => {
                        this.updateCurrentBalance( () => {
                            if ( callback ) callback( currentChequeBooks );
                        } );
                    } );

                    return currentChequeBooks;
                } )
                .catch( err => {
                    this.setState( {
                        etherscanError : err.message,
                        hasCheckedEtherScan : true
                    } );
                } )
        );
    };

    updateCurrentBalance = callback => {
        const { activeChequeBook, currentChequeBooks } = this.state;
        const activeBalance =
            currentChequeBooks.find( x => x.address == activeChequeBook )?.balance || "0";

        this.setState(
            {
                activeBalance
            },
            callback
        );
    };

    selectChequeBook = address => {
        if ( !address ) {
            this.setState( {
                activeChequeBook : "",
                activeBalance : "0"
            } );

            return;
        }

        address = address.toLowerCase(); // Etherscan and web3 sometimes give different cases

        const { currentChequeBooks } = this.state;
        const activeBalance = currentChequeBooks.find( chequeBook => chequeBook.address == address )
            ?.balance;

        this.setState( {
            activeChequeBook : address,
            activeBalance
        } );
    };

    selectBeneficiary = beneficiary => {
        if ( !beneficiary ) {
            this.setState( {
                activeBeneficiary : ""
            } );

            return;
        }

        const { currentBeneficiaries } = this.state;
        const updatedBeneficiaries = [ { address : beneficiary } ];

        // Make unique list
        for ( const beneficiary of currentBeneficiaries ) {
            const { address } = beneficiary;

            if ( !updatedBeneficiaries.map( b => b.address ).includes( address ) ) {
                updatedBeneficiaries.push( {
                    address
                } );
            }
        }

        this.setState( {
            activeBeneficiary : beneficiary,
            currentBeneficiaries : updatedBeneficiaries
        } );
    };

    //@TODO: Get real data
    getCurrentBeneficiaries = () => {
        const currentBeneficiaries = [];
        /*
        const currentBeneficiaries = [
            {
                address : "0x" + Math.floor( Math.random() * 80 ) + ".....",
                //alias : "lorem_ipsum_" + Math.floor( Math.random() * 20 ),
                chequesTotal : Math.floor( Math.random() * 20 )
            },
            {
                address : "0x" + Math.floor( Math.random() * 80 ) + ".....",
                //alias : "lorem_ipsum_" + Math.floor( Math.random() * 20 ),
                chequesTotal : Math.floor( Math.random() * 20 )
            },
            {
                address : "0x" + Math.floor( Math.random() * 80 ) + ".....",
                //alias : "lorem_ipsum_" + Math.floor( Math.random() * 20 ),
                chequesTotal : Math.floor( Math.random() * 20 )
            }
        ];
        */

        this.setState( {
            currentBeneficiaries
        } );
    };

    componentDidUpdate( prevProps, prevState ) {
        const { currentEthereumAddress } = this.state;
        const previousEthereumAddress = prevState.currentEthereumAddress;
        const noLongerConnectedToEthereum = !currentEthereumAddress && previousEthereumAddress;
        const shouldCheckForChequeBooks =
            currentEthereumAddress && currentEthereumAddress !== previousEthereumAddress;

        if ( noLongerConnectedToEthereum ) {
            this.setState( {
                currentChequeBooks : []
            } );
        } else if ( shouldCheckForChequeBooks ) {
            this.getCurrentChequeBooks();
            //this.getCurrentBeneficiaries(); //@TODO: Does not pull from Ethereum yet
        }
    }

    monitorMetaMask = () => {
        setInterval( this.pollMetaMask, 1000 );
    };

    skipSplash = () => {
        this.setState( {
            shouldRenderSplash : false,
            hasCheckedMetaMask : true, // override
            hasCheckedEtherScan : true // override
        } );
    };

    renderApp = () => {
        const {
            metaMaskError,
            etherscanError,
            shouldRenderSplash,
            currentEthereumAddress,
            activeChequeBook,
            currentBeneficiaries,
            activeBeneficiary,
            activeBalance,
            currentChequeBooks
        } = this.state;
        const { history, ethereumInterface, config } = this.props;
        const { TEST_CONTRACT, TEST_BENEFICIARY } = config;
        const shouldPreFill = process?.env?.NODE_ENV == "dev" ? true : false;

        return (
            <Fragment>
                {shouldRenderSplash ? (
                    <Splash metaMaskError={metaMaskError} skipSplash={this.skipSplash} />
                ) : (
                    <div>
                        {metaMaskError && (
                            <Row
                                //className="pl-0 pr-0 col-10 mx-auto animated fadeInUp"
                                className="pl-0 pr-0 col-12 col-s-10 col-md-8 col-lg-6 mx-auto animated fadeInUp"
                                style={{ marginTop : "5rem" }}
                            >
                                <a
                                    href="https://metamask.io"
                                    target="blank"
                                    className="w-100"
                                    style={{ textDecoration : "none" }}
                                >
                                    <AlertMessage
                                        style={{ width : "100%" }}
                                        intro="MetaMask is not available!"
                                        message={metaMaskError}
                                        icon="sign-in-alt"
                                        variant="warning"
                                        dismissible={false}
                                        instruction="MetMask is a required component. Please add it to your browser and log in."
                                    />
                                </a>
                            </Row>
                        )}
                        <Switch location={history.location}>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <IssueCheque
                                        //entranceAnimation="fadeIn"
                                        currentEthereumAddress={currentEthereumAddress}
                                        ethereumInterface={ethereumInterface}
                                        activeBalance={activeBalance}
                                        currentChequeBooks={currentChequeBooks}
                                        etherscanError={etherscanError}
                                        activeChequeBook={activeChequeBook}
                                        selectChequeBook={this.selectChequeBook}
                                        getCurrentChequeBooks={this.getCurrentChequeBooks}
                                        currentBeneficiaries={currentBeneficiaries}
                                        activeBeneficiary={activeBeneficiary}
                                        selectBeneficiary={this.selectBeneficiary}
                                        getCurrentBeneficiaries={this.getCurrentBeneficiaries}
                                        preFilledContract={shouldPreFill && TEST_CONTRACT}
                                        preFilledBeneficiary={shouldPreFill && TEST_BENEFICIARY}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/cash"
                                render={() => (
                                    <CashCheque
                                        //entranceAnimation="fadeIn"
                                        ethereumInterface={ethereumInterface}
                                    />
                                )}
                            />
                            <Route exact path="" render={() => <PageNotFound />} />
                        </Switch>
                    </div>
                )}
            </Fragment>
        );
    };

    render() {
        const {
            shouldRenderSplash,
            hasCheckedMetaMask,
            hasCheckedEtherScan,
            currentEthereumAddress
        } = this.state;
        const { history } = this.props;
        const currentPage = history.location.pathname;
        const shouldRenderApp = hasCheckedMetaMask && ( hasCheckedEtherScan || shouldRenderSplash );

        return (
            <div className="app-wrapper">
                <Helmet titleTemplate="%s" defaultTitle="ethereum-chequebook">
                    <meta name="description" content="Ethereum cheque book frontend" />
                </Helmet>

                <NavBar
                    pages={this.pages}
                    history={history}
                    currentPage={currentPage}
                    shouldRenderSplash={shouldRenderSplash}
                    currentEthereumAddress={currentEthereumAddress}
                />

                {shouldRenderApp ? (
                    this.renderApp()
                ) : (
                    <div className="flex-centre h-100">
                        <LoadingIndicator />
                    </div>
                )}
            </div>
        );
    }
}
