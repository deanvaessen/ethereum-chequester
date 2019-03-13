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
import "animate.css/source/fading_entrances/fadeInLeft.css";
import "animate.css/source/fading_entrances/fadeInRight.css";
import "animate.css/source/fading_exits/fadeOutDown.css";

import {
    //faSearch,
    //faLink,
    //faPen,
    faCheckCircle,
    faCheck,
    faCircle,
    faUser,
    faUserAstronaut,
    faSignInAlt,
    //faRocket,
    //faHashtag,
    faBug,
    faHourglassHalf,
    //faEnvelopeOpen,
    faKey,
    faEnvelope,
    //faEnvelopeOpenText,
    faTimesCircle,
    //faFingerprint,
    //faExclamationTriangle,
    faCoins,
    faUndo,
    faQuestionCircle,
    faQuestion,
    //faCaretDown,
    faClock,
    faHandHolding,
    //faMinus,
    //faChevronDown,
    faExchangeAlt,
    faStar,
    faPlusCircle,
    //faInfoCircle,
    faMoneyCheck,
    faFileSignature,
    faFileContract,
    //faBookOpen,
    faWallet,
    faSave
} from "@fortawesome/free-solid-svg-icons";

import { faEthereum } from "@fortawesome/free-brands-svg-icons";

library.add(
    //faSearch,
    //faLink,
    //faPen,
    faKey,
    faSignInAlt,
    faCheckCircle,
    faCheck,
    faHourglassHalf,
    faCircle,
    //faRocket,
    faUser,
    faUserAstronaut,
    faQuestionCircle,
    faQuestion,
    //faTimesCircle,
    faExchangeAlt,
    faUndo,
    faClock,
    faHandHolding,
    //faCaretDown,
    //faInfoCircle,
    //faFingerprint,
    //faMinus,
    //faChevronDown,
    faStar,
    //faEnvelopeOpen,
    faEnvelope,
    //faHashtag,
    faBug,
    faPlusCircle,
    //faExclamationTriangle,
    faEthereum,
    faMoneyCheck,
    faCoins,
    //faEnvelopeOpenText,
    faFileSignature,
    faFileContract,
    //faBookOpen,
    faWallet,
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
import createHashHistory from "history/createHashHistory";

const history = createHashHistory();
const MOUNT_NODE = document.getElementById("app");

// The app
import App from "./containers/App";

// Middleware
import solc from "browser-solc";
import path from "path";
import Web3 from "web3";
import ChequeBook from "./middleware/cheque_book";
import Cheque from "./middleware/cheque";
import SolCompiler from "./middleware/sol_compiler";
import Etherscan from "./middleware/etherscan";
import EthereumInterface from "./middleware/ethereum_interface";
import Utils from "./middleware/utils";

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
        Etherscan,
        ChequeBook,
        Cheque,
        path,
        utils
    });

    ReactDOM.render(
        <HashRouter history={history}>
            <App history={history} config={config} ethereumInterface={ethereumInterface} />
        </HashRouter>,
        MOUNT_NODE
    );
}
