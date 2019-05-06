/*******************************
 * The app entry file
 ******************************/
/*eslint-disable */

/**
 * { Dependencies }
 */

// Presentation
require("./assets/favicon.ico");
import "bootstrap/dist/css/bootstrap.min.css";
import "react-accessible-accordion/dist/fancy-example.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import "animate.css/source/_base.css";
import "animate.css/source/_base.css";
import "animate.css/source/attention_seekers/bounce.css";
import "animate.css/source/attention_seekers/pulse.css";
import "animate.css/source/fading_entrances/fadeIn.css";
import "animate.css/source/fading_entrances/fadeInUp.css";
import "animate.css/source/fading_entrances/fadeInDown.css";
import "animate.css/source/fading_entrances/fadeInLeft.css";
import "animate.css/source/fading_entrances/fadeInRight.css";
import "animate.css/source/fading_exits/fadeOutDown.css";

import {
    faCheckCircle,
    faCheck,
    faCircle,
    faUser,
    faUserAstronaut,
    faSignInAlt,
    faBug,
    faTint,
    faHourglassHalf,
    faExclamationTriangle,
    faKey,
    faEnvelope,
    faTimesCircle,
    faCoins,
    faUndo,
    faQuestionCircle,
    faQuestion,
    faClock,
    faHandHolding,
    faExchangeAlt,
    faStar,
    faPlusCircle,
    faMoneyCheck,
    faFileSignature,
    faFileContract,
    faWallet,
    faSave,
    faDownload
} from "@fortawesome/free-solid-svg-icons";

import { faEthereum } from "@fortawesome/free-brands-svg-icons";

library.add(
    faKey,
    faSignInAlt,
    faCheckCircle,
    faCheck,
    faExclamationTriangle,
    faTint,
    faHourglassHalf,
    faCircle,
    faUser,
    faUserAstronaut,
    faQuestionCircle,
    faQuestion,
    faTimesCircle,
    faExchangeAlt,
    faUndo,
    faClock,
    faHandHolding,
    faStar,
    faEnvelope,
    faBug,
    faPlusCircle,
    faEthereum,
    faMoneyCheck,
    faCoins,
    faFileSignature,
    faFileContract,
    faWallet,
    faDownload,
    faSave
);

const HOST = window.location.host.split(":")[0];

// React
import config from "../config/app.json";
import React from "react";
import ReactDOM from "react-dom";

// Routing
import { Router as HashRouter } from "react-router-dom";
//import { HashRouter } from "react-router-dom";
//import createHashHistory from "history/createHashHistory";
import { createBrowserHistory } from "history";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";

//const history = createHashHistory();
const history = createBrowserHistory();
const MOUNT_NODE = document.getElementById("app");

// The app
import App from "./components/App";

// Middleware
import solc from "browser-solc";
import path from "path";
import Web3 from "web3";
import ChequeBook from "./middleware/cheque_book";
import Transactions from "./middleware/transactions";
import Cheque from "./middleware/cheque";
import SolCompiler from "./middleware/sol_compiler";
import EtherScan from "./middleware/etherScan";
import EthereumInterface from "./middleware/ethereum_interface";
import Utils from "./middleware/utils";

import thunk from "redux-thunk";
import logger from "redux-logger";

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import { mainReducer, defaultState, createRootReducer } from "./Reducer";
const runDebug = process.env.NODE_ENV == "dev";
const middleWare = [thunk, routerMiddleware(history), runDebug && logger].filter(Boolean);
const store = createStore(
    createRootReducer(history),
    defaultState(),
    compose(applyMiddleware(...middleWare))
);

/**
 * { Init }
 * Initiate the app
 */

// Config override
const modeIsProd = !process;

if (modeIsProd) {
    fetch("config.json")
        .then(response => response.json())
        .then(config => {
            const options = Object.keys(config);

            for (const key of options) {
                window[key] = config[key];
            }

            loadReact();
        })
        .catch(err => loadReact()); // Skip config and just load the app with default values
} else {
    const waitForBrowserSolc = setInterval(() => {
        if (window.BrowserSolc) {
            loadReact();
            clearInterval(waitForBrowserSolc);
        } else {
            console.log("Waiting for browser solc");
        }
    }, 50);
}

function loadReact() {
    const web3 = new Web3(window.web3?.currentProvider);
    const utils = new Utils(web3);
    const solCompiler = new SolCompiler({ BrowserSolc: window.BrowserSolc });
    const ethereumInterface = new EthereumInterface({
        solCompiler,
        web3,
        config,
        EtherScan,
        ChequeBook,
        Transactions,
        Cheque,
        path,
        utils
    });

    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {/*<HashRouter history={history}>*/}
                <App history={history} config={config} ethereumInterface={ethereumInterface} />
                {/*</HashRouter>*/}
            </ConnectedRouter>
        </Provider>,
        MOUNT_NODE
    );
}
