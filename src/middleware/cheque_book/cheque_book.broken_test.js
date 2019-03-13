const config = require( "../../../config/app.json" );
const ChequeBook = require( "./cheque_book" ).default;

import "@babel/polyfill";
//import { provider } from "../tests/web3Provider";
import SolCompiler from "../sol_compiler";
import solc from "browser-solc";
import path from "path";
//import Web3 from "web3";

const solCompiler = new SolCompiler( { BrowserSolc : solc } );
const ganache = require( "ganache-cli" );
const Web3 = require( "web3" );
const provider = ganache.provider();
const web3 = new Web3( provider );

const bytecode = require( "../../contracts/compiled/chequebook.bytecode" );
const abi = require( "../../contracts/compiled/chequebook.abi.json" );

describe( "Middleware - Cheque Book", () => {
    it( "Deploys a contract", () => {
        const chequeBook = new ChequeBook( solCompiler, web3, path );

        return chequeBook
            .deploy( abi, bytecode, [ "MyTestContract" ] )
            .then( contract => expect( contract.options.address ).toContain( "0x" ) );
    }, 5000 );
} );
