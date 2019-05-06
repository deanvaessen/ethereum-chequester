/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";

import { Row } from "react-bootstrap";

import Splash from "../Splash/";
import NavBar from "../NavBar/";
import PageNotFound from "../PageNotFound";
import Page from "../Page";
import AlertMessage from "../AlertMessage";
import IssueCheque from "../IssueCheque";
import CashCheque from "../CashCheque";
import FlushCheques from "../FlushCheques";

import "./App.scss";
import LoadingIndicator from "../LoadingIndicator";

import {
    actionPersistCheque,
    actionSetActiveEthereumAddress,
    actionSetChequeBooks,
    actionFetchChequeBooks,
    actionFetchCheques
    //actionFetchBeneficiaries
} from "../../Actions";
import { actionSetActiveChequeBook, actionSetActiveBeneficiary } from "./Actions";

export default class App extends React.Component {
    static propTypes = {
        history : PropTypes.object.isRequired,
        activeEthereumAddress : PropTypes.string,
        ethereumInterface : PropTypes.object.isRequired,
        location : PropTypes.object.isRequired
    };

    pages = [
        {
            path : "/",
            label : "Issue"
        },
        {
            path : "/cash",
            label : "Cash"
        }
    ];

    initialState = {
        hasCheckedMetaMask : false,
        hasCheckedEtherScan : false,
        shouldRenderSplash : false
    };

    state = this.initialState;

    componentDidMount() {
        const { dispatch, ethereumInterface, activeEthereumAddress } = this.props;

        this.monitorMetaMask();

        if ( activeEthereumAddress ) {
            this.primeEthereumAccount();
        } else {
            this.setState( { shouldRenderSplash : true } );
        }
    }

    componentDidUpdate( prevProps, prevState ) {
        const { activeEthereumAddress, dispatch } = this.props;

        const previousEthereumAddress = prevProps.activeEthereumAddress;
        //const noLongerConnectedToEthereum = !activeEthereumAddress && previousEthereumAddress;
        const hasSwitchedEthereumAddress = activeEthereumAddress !== previousEthereumAddress;

        if ( hasSwitchedEthereumAddress ) {
            actionSetActiveChequeBook( dispatch )( null );
            actionSetActiveBeneficiary( dispatch )( null );
            actionSetChequeBooks( dispatch )( [] );

            if ( activeEthereumAddress ) this.primeEthereumAccount();
        }
    }

    primeEthereumAccount() {
        const { isFetchingChequeBooks, isFetchingCheques } = this.props;

        if ( !isFetchingChequeBooks ) this.primeChequeBooks();
        if ( !isFetchingCheques ) this.primeCheques();
    }

    primeChequeBooks = () => {
        const { activeEthereumAddress, dispatch, ethereumInterface } = this.props;

        actionFetchChequeBooks( dispatch, ethereumInterface )( activeEthereumAddress )
            .then( () => this.setState( { hasCheckedEtherScan : true } ) )
            .catch( () => this.setState( { hasCheckedEtherScan : true } ) );
    };

    primeCheques = () => {
        const { activeEthereumAddress, dispatch } = this.props;

        actionFetchCheques( dispatch )( activeEthereumAddress );
    };

    monitorMetaMask = () => {
        setInterval( this.pollMetaMask, 1000 );
    };

    pollMetaMask = () => {
        const { ethereumInterface, activeEthereumAddress, dispatch } = this.props;
        const { hasCheckedMetaMask } = this.state;
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
                    const accountHasLoggedOut = activeEthereumAddress && !newAddress;
                    const accountHasBeenUpdated =
                        newAddress && newAddress !== activeEthereumAddress;

                    if ( accountHasBeenUpdated ) {
                        this.setState( {
                            hasCheckedMetaMask : true,
                            metaMaskError : null,
                            shouldRenderSplash : false
                        } );

                        actionSetActiveEthereumAddress( dispatch )( newAddress );
                    } else if ( accountHasLoggedOut ) {
                        this.setState( {
                            hasCheckedMetaMask : true,
                            metaMaskError : "You are not logged in to MetaMask"
                        } );

                        actionSetActiveEthereumAddress( dispatch )( newAddress );
                    } else if ( !hasCheckedMetaMask ) {
                        this.setState( {
                            metaMaskError : "You are not logged in to MetaMask",
                            hasCheckedMetaMask : true
                        } );
                    }
                } )
                .catch( err => {
                    console.warn( err );

                    this.setState( {
                        shouldRenderSplash : activeEthereumAddress ? false : true, // do not go back to splash when I was already logged in
                        metaMaskError : err.message,
                        hasCheckedMetaMask : true
                    } );
                } );
        }
    };

    skipSplash = () => {
        this.setState( {
            shouldRenderSplash : false,
            hasCheckedMetaMask : true, // override
            hasCheckedEtherScan : true // override
        } );
    };

    renderApp = () => {
        const { shouldRenderSplash } = this.state;
        const { metaMaskError, ethereumInterface, config } = this.props;
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
                                        messageIsBold={true}
                                        icon="sign-in-alt"
                                        variant="warning"
                                        dismissible={false}
                                        instruction="MetMask is a required component. Please add it to your browser and log in."
                                    />
                                </a>
                            </Row>
                        )}

                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <IssueCheque
                                        //entranceAnimation="fadeIn"
                                        ethereumInterface={ethereumInterface}
                                        preFilledContract={shouldPreFill && TEST_CONTRACT}
                                        preFilledBeneficiary={shouldPreFill && TEST_BENEFICIARY}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/cash"
                                render={() => (
                                    <Page
                                        columns="col-12 col-s-10 col-md-8 col-lg-6"
                                        pageIcon="hand-holding"
                                        pageHeader="Cash out cheques"
                                    >
                                        <CashCheque ethereumInterface={ethereumInterface} />

                                        <div className="mt-5 mb-5" />

                                        <FlushCheques ethereumInterface={ethereumInterface} />
                                    </Page>
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
        const { shouldRenderSplash, hasCheckedMetaMask, hasCheckedEtherScan } = this.state;
        const { location, activeEthereumAddress } = this.props;
        const currentPage = location.pathname;
        const shouldRenderApp = hasCheckedMetaMask && ( hasCheckedEtherScan || shouldRenderSplash );

        return (
            <div className="app-wrapper">
                <NavBar
                    pages={this.pages}
                    history={history}
                    currentPage={currentPage}
                    shouldRenderSplash={shouldRenderSplash}
                    activeEthereumAddress={activeEthereumAddress}
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
